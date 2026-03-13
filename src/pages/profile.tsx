import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Layout from '@/components/Layout/Layout';
import {setShowLogin, logout} from '@/reducer';
import profileImage from '../../public/assets/profile-image.png';
import s from '../styles/profile.module.scss';

export default function Profile() {
  const userData: any = useSelector((state: any) => state.userCredentials);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!userData.isAuthenticated) {
      router.push('/');
      // Show login modal
      dispatch(setShowLogin(true));
    }
  }, [userData.isAuthenticated, router, dispatch]);

  if (!userData.isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <Layout>
      <div className={s.root}>
        <div className={s.userDataContainer}>
          <div className={s.profileHeader}>
            <h2 className={s.sectionTitle}>Profile</h2>
            <div className={s.imageWrapper}>
              <Image
                src={profileImage}
                alt="Profile picture"
                width={200}
                height={200}
                className={s.profileImage}
              />
            </div>
          </div>
          <div className={s.contactData}>
            <div className={s.infoGroup}>
              <span className={s.infoLabel}>Your name</span>
              <h3 className={s.infoValue}>{userData.name}</h3>
            </div>
            <div className={s.infoGroup}>
              <span className={s.infoLabel}>Your email</span>
              <p className={s.infoValue}>{userData.email}</p>
            </div>
            <div className={s.actions}>
              <button className={s.editButton}>Edit profile</button>
              <button className={s.logoutButton} onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        </div>
        <div className={s.description}>
          <span className={s.infoLabel}>About me</span>
          <p className={s.paragraph}>
            Charles Dickens was an English writer and social critic. During his
            lifetime, his works enjoyed unprecedented popularity. He is now
            considered a literary genius because he created some of the worlds
            best-known fictional characters and is regarded as the greatest
            novelist of the Victorian era. His novels and short stories enjoy
            lasting popularity.
          </p>
        </div>
      </div>
    </Layout>
  );
}
