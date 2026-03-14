import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useEffect, useState, ChangeEvent} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Layout from '@/components/Layout/Layout';
import {setShowLogin, logout, updateProfile} from '@/reducer';
import s from '../styles/profile.module.scss';

type TFormData = {
  name: string;
  bio: string;
  phone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
};

type TPasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function Profile() {
  const userData: any = useSelector((state: any) => state.userCredentials);
  const router = useRouter();
  const dispatch = useDispatch();

  // Edit modes
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Form data
  const [formData, setFormData] = useState<TFormData>({
    name: '',
    bio: '',
    phone: '',
    shippingAddress: null
  });

  const [passwordData, setPasswordData] = useState<TPasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // UI states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Fetch profile on mount
  useEffect(() => {
    if (!userData.isAuthenticated) {
      router.push('/');
      dispatch(setShowLogin(true));
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', {
          headers: {Authorization: `Bearer ${userData.token}`}
        });
        const result = await res.json();

        if (res.status === 401) {
          // Token expired or invalid - log out
          dispatch(logout());
          router.push('/');
          dispatch(setShowLogin(true));
          return;
        }

        if (result.error) {
          showToast(result.message || 'Failed to load profile', 'error');
        } else {
          dispatch(updateProfile(result.data));
          setFormData({
            name: result.data.name,
            bio: result.data.bio,
            phone: result.data.phone,
            shippingAddress: result.data.shippingAddress
          });
        }
      } catch (error) {
        showToast('Failed to load profile. Please try logging out and back in.', 'error');
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchProfile();
  }, [userData.isAuthenticated, userData.token, router, dispatch]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({...prev, show: false}));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({show: true, message, type});
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  // Validation functions
  const validateName = (name: string): string | null => {
    if (!name.trim()) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    return null;
  };

  const validateBio = (bio: string): string | null => {
    if (bio.length > 500) return 'Bio must not exceed 500 characters';
    return null;
  };

  const validateAddress = (
    address: TFormData['shippingAddress']
  ): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!address) return errors;

    if (!address.street.trim()) errors.street = 'Street is required';
    if (!address.city.trim()) errors.city = 'City is required';
    if (!address.state.trim()) errors.state = 'State is required';
    if (!address.postalCode.trim())
      errors.postalCode = 'Postal code is required';
    if (!address.country.trim()) errors.country = 'Country is required';

    return errors;
  };

  const validatePassword = (data: TPasswordData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.currentPassword)
      errors.currentPassword = 'Current password is required';
    if (!data.newPassword) errors.newPassword = 'New password is required';
    if (data.newPassword && data.newPassword.length < 6)
      errors.newPassword = 'New password must be at least 6 characters';
    if (!data.confirmPassword)
      errors.confirmPassword = 'Please confirm your password';
    if (data.newPassword !== data.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';

    return errors;
  };

  // Personal Info handlers
  const handleEditInfo = () => {
    setFormData({
      name: userData.name,
      bio: userData.bio,
      phone: userData.phone,
      shippingAddress: userData.shippingAddress
    });
    setIsEditingInfo(true);
    setErrors({});
  };

  const handleCancelInfo = () => {
    setIsEditingInfo(false);
    setErrors({});
  };

  const handleSaveInfo = async () => {
    // Validate
    const nameError = validateName(formData.name);
    const bioError = validateBio(formData.bio);

    if (nameError || bioError) {
      setErrors({
        name: nameError || '',
        bio: bioError || ''
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`
        },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          phone: formData.phone
        })
      });

      const result = await res.json();

      if (res.status === 401) {
        dispatch(logout());
        router.push('/');
        dispatch(setShowLogin(true));
        return;
      }

      if (result.error) {
        showToast(result.message, 'error');
      } else {
        dispatch(updateProfile(result.data));
        setIsEditingInfo(false);
        showToast('Profile updated successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Address handlers
  const handleEditAddress = () => {
    setFormData({
      ...formData,
      shippingAddress: userData.shippingAddress || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      }
    });
    setIsEditingAddress(true);
    setErrors({});
  };

  const handleCancelAddress = () => {
    setIsEditingAddress(false);
    setErrors({});
  };

  const handleSaveAddress = async () => {
    // Validate
    const addressErrors = validateAddress(formData.shippingAddress);

    if (Object.keys(addressErrors).length > 0) {
      setErrors(addressErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`
        },
        body: JSON.stringify({
          shippingAddress: formData.shippingAddress
        })
      });

      const result = await res.json();

      if (res.status === 401) {
        dispatch(logout());
        router.push('/');
        dispatch(setShowLogin(true));
        return;
      }

      if (result.error) {
        showToast(result.message, 'error');
      } else {
        dispatch(updateProfile(result.data));
        setIsEditingAddress(false);
        showToast('Address updated successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to update address', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Avatar upload handler
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image too large (max 2MB)', 'error');
      return;
    }

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Invalid file type (jpg, png, webp only)', 'error');
      return;
    }

    // Read and upload
    const reader = new FileReader();

    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setUploadingImage(true);

      try {
        const res = await fetch('/api/profile/avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData.token}`
          },
          body: JSON.stringify({imageData: base64})
        });

        const result = await res.json();

        if (res.status === 401) {
          dispatch(logout());
          router.push('/');
          dispatch(setShowLogin(true));
          return;
        }

        if (result.error) {
          showToast(result.message || 'Failed to upload image', 'error');
        } else {
          dispatch(updateProfile({profilePicture: result.profilePicture}));
          showToast('Profile picture updated', 'success');
        }
      } catch (error) {
        showToast('Failed to upload image', 'error');
      } finally {
        setUploadingImage(false);
        // Reset file input so the same file can be selected again
        e.target.value = '';
      }
    };

    reader.onerror = () => {
      showToast('Failed to read image file', 'error');
      setUploadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  // Password change handler
  const handlePasswordChange = async () => {
    // Validate
    const passwordErrors = validatePassword(passwordData);

    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/profile/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`
        },
        body: JSON.stringify(passwordData)
      });

      const result = await res.json();

      if (res.status === 401) {
        dispatch(logout());
        router.push('/');
        dispatch(setShowLogin(true));
        return;
      }

      if (result.error) {
        if (result.message.includes('Current password')) {
          setErrors({currentPassword: result.message});
        } else {
          showToast(result.message, 'error');
        }
      } else {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordForm(false);
        showToast('Password changed successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to change password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!userData.name) return '';
    return userData.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!userData.isAuthenticated) {
    return null;
  }

  if (isInitialLoading) {
    return (
      <Layout>
        <div className={s.loadingContainer}>
          <div className={s.spinner}></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={s.pageContainer}>
        <div className={s.pageHeader}>
          <h1 className={s.pageTitle}>My Profile</h1>
        </div>

        <div className={s.cardsGrid}>
          {/* Profile Card */}
          <div className={`${s.card} ${s.profileCard}`}>
            <div className={s.avatarSection}>
              <div className={s.avatarWrapper}>
                {userData.profilePicture ? (
                  <img
                    src={userData.profilePicture}
                    alt="Profile"
                    className={s.avatar}
                  />
                ) : (
                  <div className={s.avatarInitials}>{getInitials()}</div>
                )}
                {uploadingImage && (
                  <div className={s.uploadingOverlay}>Uploading...</div>
                )}
              </div>

              <input
                type="file"
                id="avatar-upload"
                className={s.hiddenInput}
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                disabled={uploadingImage}
              />

              <button
                className={s.uploadButton}
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? 'Uploading...' : 'Change Photo'}
              </button>
            </div>

            <div className={s.memberInfo}>
              <div className={s.memberSince}>Member since</div>
              <div className={s.memberDate}>
                {formatDate(userData.createdAt)}
              </div>
            </div>

            <button className={s.logoutButton} onClick={handleLogout}>
              Log out
            </button>
          </div>

          {/* Personal Info Card */}
          <div className={`${s.card} ${s.infoCard}`}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>Personal Information</h2>
              {!isEditingInfo && (
                <button
                  className={`${s.button} ${s.editButton}`}
                  onClick={handleEditInfo}
                >
                  Edit
                </button>
              )}
            </div>

            <div className={s.formContent}>
              {/* Name */}
              <div className={s.fieldGroup}>
                <label className={s.fieldLabel}>Full Name</label>
                {isEditingInfo ? (
                  <>
                    <input
                      type="text"
                      className={`${s.formInput} ${errors.name ? s.invalid : ''}`}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({...formData, name: e.target.value})
                      }
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <span className={s.errorText}>{errors.name}</span>
                    )}
                  </>
                ) : (
                  <div className={s.fieldValue}>{userData.name}</div>
                )}
              </div>

              {/* Email */}
              <div className={s.fieldGroup}>
                <label className={s.fieldLabel}>Email Address</label>
                <div className={s.fieldValue}>{userData.email}</div>
              </div>

              {/* Bio */}
              <div className={s.fieldGroup}>
                <label className={s.fieldLabel}>Bio</label>
                {isEditingInfo ? (
                  <>
                    <textarea
                      className={`${s.formInput} ${s.formTextarea} ${errors.bio ? s.invalid : ''}`}
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({...formData, bio: e.target.value})
                      }
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                    />
                    <div
                      className={`${s.charCount} ${
                        formData.bio.length > 450
                          ? formData.bio.length > 490
                            ? s.error
                            : s.warning
                          : ''
                      }`}
                    >
                      {formData.bio.length} / 500
                    </div>
                    {errors.bio && (
                      <span className={s.errorText}>{errors.bio}</span>
                    )}
                  </>
                ) : (
                  <div
                    className={`${s.fieldValue} ${!userData.bio ? s.fieldValueMuted : ''}`}
                  >
                    {userData.bio || 'No bio added yet'}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className={s.fieldGroup}>
                <label className={s.fieldLabel}>Phone Number</label>
                {isEditingInfo ? (
                  <input
                    type="tel"
                    className={s.formInput}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({...formData, phone: e.target.value})
                    }
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div
                    className={`${s.fieldValue} ${!userData.phone ? s.fieldValueMuted : ''}`}
                  >
                    {userData.phone || 'No phone number added'}
                  </div>
                )}
              </div>

              {isEditingInfo && (
                <div className={s.buttonGroup}>
                  <button
                    className={`${s.button} ${s.primaryButton}`}
                    onClick={handleSaveInfo}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    className={`${s.button} ${s.secondaryButton}`}
                    onClick={handleCancelInfo}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className={`${s.card} ${s.addressCard}`}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>Shipping Address</h2>
              {!isEditingAddress && (
                <button
                  className={`${s.button} ${s.editButton}`}
                  onClick={handleEditAddress}
                >
                  {userData.shippingAddress ? 'Edit' : 'Add'}
                </button>
              )}
            </div>

            <div className={s.formContent}>
              {isEditingAddress ? (
                <>
                  <div className={s.addressGrid}>
                    <div className={`${s.fieldGroup} ${s.fullWidth}`}>
                      <label className={s.fieldLabel}>Street Address</label>
                      <input
                        type="text"
                        className={`${s.formInput} ${errors.street ? s.invalid : ''}`}
                        value={formData.shippingAddress?.street || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shippingAddress: {
                              ...(formData.shippingAddress || {
                                street: '',
                                city: '',
                                state: '',
                                postalCode: '',
                                country: ''
                              }),
                              street: e.target.value
                            }
                          })
                        }
                        placeholder="123 Main St"
                      />
                      {errors.street && (
                        <span className={s.errorText}>{errors.street}</span>
                      )}
                    </div>

                    <div className={s.fieldGroup}>
                      <label className={s.fieldLabel}>City</label>
                      <input
                        type="text"
                        className={`${s.formInput} ${errors.city ? s.invalid : ''}`}
                        value={formData.shippingAddress?.city || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shippingAddress: {
                              ...(formData.shippingAddress || {
                                street: '',
                                city: '',
                                state: '',
                                postalCode: '',
                                country: ''
                              }),
                              city: e.target.value
                            }
                          })
                        }
                        placeholder="New York"
                      />
                      {errors.city && (
                        <span className={s.errorText}>{errors.city}</span>
                      )}
                    </div>

                    <div className={s.fieldGroup}>
                      <label className={s.fieldLabel}>State / Province</label>
                      <input
                        type="text"
                        className={`${s.formInput} ${errors.state ? s.invalid : ''}`}
                        value={formData.shippingAddress?.state || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shippingAddress: {
                              ...(formData.shippingAddress || {
                                street: '',
                                city: '',
                                state: '',
                                postalCode: '',
                                country: ''
                              }),
                              state: e.target.value
                            }
                          })
                        }
                        placeholder="NY"
                      />
                      {errors.state && (
                        <span className={s.errorText}>{errors.state}</span>
                      )}
                    </div>

                    <div className={s.fieldGroup}>
                      <label className={s.fieldLabel}>Postal Code</label>
                      <input
                        type="text"
                        className={`${s.formInput} ${errors.postalCode ? s.invalid : ''}`}
                        value={formData.shippingAddress?.postalCode || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shippingAddress: {
                              ...(formData.shippingAddress || {
                                street: '',
                                city: '',
                                state: '',
                                postalCode: '',
                                country: ''
                              }),
                              postalCode: e.target.value
                            }
                          })
                        }
                        placeholder="10001"
                      />
                      {errors.postalCode && (
                        <span className={s.errorText}>{errors.postalCode}</span>
                      )}
                    </div>

                    <div className={s.fieldGroup}>
                      <label className={s.fieldLabel}>Country</label>
                      <input
                        type="text"
                        className={`${s.formInput} ${errors.country ? s.invalid : ''}`}
                        value={formData.shippingAddress?.country || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shippingAddress: {
                              ...(formData.shippingAddress || {
                                street: '',
                                city: '',
                                state: '',
                                postalCode: '',
                                country: ''
                              }),
                              country: e.target.value
                            }
                          })
                        }
                        placeholder="United States"
                      />
                      {errors.country && (
                        <span className={s.errorText}>{errors.country}</span>
                      )}
                    </div>
                  </div>

                  <div className={s.buttonGroup}>
                    <button
                      className={`${s.button} ${s.primaryButton}`}
                      onClick={handleSaveAddress}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Address'}
                    </button>
                    <button
                      className={`${s.button} ${s.secondaryButton}`}
                      onClick={handleCancelAddress}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : userData.shippingAddress ? (
                <div className={s.addressGrid}>
                  <div className={`${s.fieldGroup} ${s.fullWidth}`}>
                    <label className={s.fieldLabel}>Street Address</label>
                    <div className={s.fieldValue}>
                      {userData.shippingAddress.street}
                    </div>
                  </div>

                  <div className={s.fieldGroup}>
                    <label className={s.fieldLabel}>City</label>
                    <div className={s.fieldValue}>
                      {userData.shippingAddress.city}
                    </div>
                  </div>

                  <div className={s.fieldGroup}>
                    <label className={s.fieldLabel}>State</label>
                    <div className={s.fieldValue}>
                      {userData.shippingAddress.state}
                    </div>
                  </div>

                  <div className={s.fieldGroup}>
                    <label className={s.fieldLabel}>Postal Code</label>
                    <div className={s.fieldValue}>
                      {userData.shippingAddress.postalCode}
                    </div>
                  </div>

                  <div className={s.fieldGroup}>
                    <label className={s.fieldLabel}>Country</label>
                    <div className={s.fieldValue}>
                      {userData.shippingAddress.country}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={s.fieldValueMuted}>
                  No shipping address added yet
                </div>
              )}
            </div>
          </div>

          {/* Security Card */}
          <div className={`${s.card} ${s.securityCard}`}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>Security</h2>
            </div>

            <div
              className={s.securityToggle}
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              <span className={s.toggleText}>Change Password</span>
              <span
                className={`${s.toggleIcon} ${showPasswordForm ? s.open : ''}`}
              >
                ▼
              </span>
            </div>

            {showPasswordForm && (
              <div className={s.securityContent}>
                <div className={s.formContent}>
                  <div className={s.fieldGroup}>
                    <label className={s.fieldLabel}>Current Password</label>
                    <input
                      type="password"
                      className={`${s.formInput} ${errors.currentPassword ? s.invalid : ''}`}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value
                        })
                      }
                      placeholder="Enter current password"
                    />
                    {errors.currentPassword && (
                      <span className={s.errorText}>
                        {errors.currentPassword}
                      </span>
                    )}
                  </div>

                  <div className={s.fieldGroup}>
                    <label className={s.fieldLabel}>New Password</label>
                    <input
                      type="password"
                      className={`${s.formInput} ${errors.newPassword ? s.invalid : ''}`}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value
                        })
                      }
                      placeholder="Enter new password"
                    />
                    {errors.newPassword && (
                      <span className={s.errorText}>{errors.newPassword}</span>
                    )}
                  </div>

                  <div className={s.fieldGroup}>
                    <label className={s.fieldLabel}>Confirm New Password</label>
                    <input
                      type="password"
                      className={`${s.formInput} ${errors.confirmPassword ? s.invalid : ''}`}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value
                        })
                      }
                      placeholder="Confirm new password"
                    />
                    {errors.confirmPassword && (
                      <span className={s.errorText}>
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>

                  <div className={s.buttonGroup}>
                    <button
                      className={`${s.button} ${s.primaryButton}`}
                      onClick={handlePasswordChange}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div className={`${s.toast} ${s[toast.type]}`}>{toast.message}</div>
        )}
      </div>
    </Layout>
  );
}
