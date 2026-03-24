import {useRouter} from 'next/navigation';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import Layout from '@/components/Layout/Layout';
import {useAppSelector} from '@/pages/hooks';
import {clearCart, setShowLogin, TCouponItem} from '@/reducer';
import s from '../styles/checkout.module.scss';

type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type PaymentData = {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
};

type OrderResult = {
  id: string;
  totalAmount: number;
  createdAt: string;
};

const STEP_LABELS = ['Shipping', 'Payment', 'Review'];

const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
};

export default function Checkout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useAppSelector((state) => state.cart);
  const coupons = useAppSelector((state) => state.coupons);
  const userCredentials = useAppSelector((state) => state.userCredentials);

  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });
  const orderPlacedRef = useRef(false);
  const finalTotalRef = useRef(0);

  const booksTotal = cart.reduce(
    (sum, item) =>
      sum + (item.book?.saleInfo?.listPrice?.amount ?? 0) * item.number,
    0
  );
  const couponsTotal = coupons.reduce(
    (sum, coupon) => sum + coupon.value * coupon.quantity,
    0
  );
  const totalPrice = booksTotal + couponsTotal;

  // Pre-fill shipping address from profile
  useEffect(() => {
    if (userCredentials.shippingAddress) {
      setShippingAddress(userCredentials.shippingAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auth and cart guards
  useEffect(() => {
    if (!userCredentials.isAuthenticated) {
      dispatch(setShowLogin(true));
      router.push('/');
      return;
    }
    if (cart.length === 0 && coupons.length === 0 && !orderPlacedRef.current) {
      router.push('/cart');
    }
  }, [userCredentials.isAuthenticated, cart.length, coupons.length, dispatch, router]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({show: true, message, type});
    setTimeout(() => setToast((t) => ({...t, show: false})), 3000);
  };

  // Validation
  const validateShipping = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!shippingAddress.street.trim()) {
      newErrors.street = 'Street is required';
    }
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    if (!shippingAddress.country.trim()) {
      newErrors.country = 'Country is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = (): boolean => {
    const newErrors: Record<string, string> = {};
    const digits = paymentData.cardNumber.replace(/\s/g, '');
    if (digits.length !== 16) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number';
    }
    if (!paymentData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }

    const expiryParts = paymentData.expiryDate.split('/');
    if (expiryParts.length !== 2) {
      newErrors.expiryDate = 'Enter a valid date (MM/YY)';
    } else {
      const month = parseInt(expiryParts[0], 10);
      const year = parseInt(expiryParts[1], 10);
      if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
        newErrors.expiryDate = 'Enter a valid date (MM/YY)';
      } else {
        const now = new Date();
        const expiry = new Date(2000 + year, month);
        if (expiry <= now) {
          newErrors.expiryDate = 'Card has expired';
        }
      }
    }

    if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      newErrors.cvv = 'Enter a valid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = () => {
    if (validateShipping()) {
      setStep(2);
      setErrors({});
    }
  };

  const handlePaymentSubmit = () => {
    if (validatePayment()) {
      setStep(3);
      setErrors({});
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userCredentials.token}`
        },
        body: JSON.stringify({
          items: [
            ...cart.map((item) => ({
              bookId: String(item.id),
              quantity: item.number,
              price: item.book?.saleInfo?.listPrice?.amount ?? 0
            })),
            ...coupons.map((coupon) => ({
              bookId: coupon.id,
              quantity: coupon.quantity,
              price: coupon.value
            }))
          ],
          shippingAddress,
          paymentLast4: paymentData.cardNumber.replace(/\s/g, '').slice(-4)
        })
      });

      const result = await res.json();

      if (res.status === 401) {
        dispatch(setShowLogin(true));
        router.push('/');
        return;
      }

      if (result.error) {
        showToast(result.message || 'Failed to place order', 'error');
        return;
      }

      orderPlacedRef.current = true;
      finalTotalRef.current = totalPrice;
      setOrderResult(result.data);
      dispatch(clearCart());
      setStep(4);
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShippingChange = (
    field: keyof ShippingAddress,
    value: string
  ) => {
    setShippingAddress((prev) => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors((prev) => {
        const next = {...prev};
        delete next[field];
        return next;
      });
    }
  };

  const handlePaymentChange = (field: keyof PaymentData, value: string) => {
    let formatted = value;
    if (field === 'cardNumber') formatted = formatCardNumber(value);
    if (field === 'expiryDate') formatted = formatExpiry(value);
    if (field === 'cvv') formatted = value.replace(/\D/g, '').slice(0, 4);

    setPaymentData((prev) => ({...prev, [field]: formatted}));
    if (errors[field]) {
      setErrors((prev) => {
        const next = {...prev};
        delete next[field];
        return next;
      });
    }
  };

  // Step indicator
  const renderSteps = () => (
    <div className={s.steps}>
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const isActive = step === stepNum;
        const isCompleted = step > stepNum;
        return (
          <React.Fragment key={label}>
            {i > 0 && (
              <div
                className={`${s.stepDivider} ${isCompleted ? s.completed : ''}`}
              />
            )}
            <div className={s.stepItem}>
              <div
                className={`${s.stepNumber} ${isActive ? s.active : ''} ${isCompleted ? s.completed : ''}`}
              >
                {isCompleted ? '\u2713' : stepNum}
              </div>
              <span
                className={`${s.stepLabel} ${isActive ? s.active : ''} ${isCompleted ? s.completed : ''}`}
              >
                {label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );

  // Step 1: Shipping
  const renderShipping = () => (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <h2 className={s.cardTitle}>Shipping Address</h2>
      </div>
      <div className={s.addressGrid}>
        <div className={`${s.fieldGroup} ${s.fullWidth}`}>
          <label className={s.fieldLabel}>Street Address</label>
          <div className={s.inputWrapper}>
            <input
              className={`${s.formInput} ${errors.street ? s.invalid : ''}`}
              type="text"
              placeholder="123 Main Street"
              value={shippingAddress.street}
              onChange={(e) => handleShippingChange('street', e.target.value)}
            />
          </div>
          {errors.street && (
            <span className={s.errorText}>{errors.street}</span>
          )}
        </div>
        <div className={s.fieldGroup}>
          <label className={s.fieldLabel}>City</label>
          <div className={s.inputWrapper}>
            <input
              className={`${s.formInput} ${errors.city ? s.invalid : ''}`}
              type="text"
              placeholder="New York"
              value={shippingAddress.city}
              onChange={(e) => handleShippingChange('city', e.target.value)}
            />
          </div>
          {errors.city && <span className={s.errorText}>{errors.city}</span>}
        </div>
        <div className={s.fieldGroup}>
          <label className={s.fieldLabel}>State</label>
          <div className={s.inputWrapper}>
            <input
              className={`${s.formInput} ${errors.state ? s.invalid : ''}`}
              type="text"
              placeholder="NY"
              value={shippingAddress.state}
              onChange={(e) => handleShippingChange('state', e.target.value)}
            />
          </div>
          {errors.state && <span className={s.errorText}>{errors.state}</span>}
        </div>
        <div className={s.fieldGroup}>
          <label className={s.fieldLabel}>Postal Code</label>
          <div className={s.inputWrapper}>
            <input
              className={`${s.formInput} ${errors.postalCode ? s.invalid : ''}`}
              type="text"
              placeholder="10001"
              value={shippingAddress.postalCode}
              onChange={(e) =>
                handleShippingChange('postalCode', e.target.value)
              }
            />
          </div>
          {errors.postalCode && (
            <span className={s.errorText}>{errors.postalCode}</span>
          )}
        </div>
        <div className={s.fieldGroup}>
          <label className={s.fieldLabel}>Country</label>
          <div className={s.inputWrapper}>
            <input
              className={`${s.formInput} ${errors.country ? s.invalid : ''}`}
              type="text"
              placeholder="United States"
              value={shippingAddress.country}
              onChange={(e) => handleShippingChange('country', e.target.value)}
            />
          </div>
          {errors.country && (
            <span className={s.errorText}>{errors.country}</span>
          )}
        </div>
      </div>
      <div className={s.navButtons}>
        <button
          className={`${s.button} ${s.secondaryButton}`}
          onClick={() => router.push('/cart')}
        >
          Back to Cart
        </button>
        <button
          className={`${s.button} ${s.primaryButton}`}
          onClick={handleShippingSubmit}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );

  // Step 2: Payment
  const renderPayment = () => (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <h2 className={s.cardTitle}>Payment Method</h2>
      </div>
      <div className={s.simulatedNotice}>
        This is a demo store. No real charges will be made.
      </div>
      <div className={s.formContent}>
        <div className={s.fieldGroup}>
          <label className={s.fieldLabel}>Card Number</label>
          <div className={s.inputWrapper}>
            <input
              className={`${s.formInput} ${errors.cardNumber ? s.invalid : ''}`}
              type="text"
              placeholder="1234 5678 9012 3456"
              value={paymentData.cardNumber}
              onChange={(e) =>
                handlePaymentChange('cardNumber', e.target.value)
              }
              maxLength={19}
            />
          </div>
          {errors.cardNumber && (
            <span className={s.errorText}>{errors.cardNumber}</span>
          )}
        </div>
        <div className={s.fieldGroup}>
          <label className={s.fieldLabel}>Cardholder Name</label>
          <div className={s.inputWrapper}>
            <input
              className={`${s.formInput} ${errors.cardName ? s.invalid : ''}`}
              type="text"
              placeholder="John Doe"
              value={paymentData.cardName}
              onChange={(e) => handlePaymentChange('cardName', e.target.value)}
            />
          </div>
          {errors.cardName && (
            <span className={s.errorText}>{errors.cardName}</span>
          )}
        </div>
        <div className={s.paymentGrid}>
          <div className={s.fieldGroup}>
            <label className={s.fieldLabel}>Expiry Date</label>
            <div className={s.inputWrapper}>
              <input
                className={`${s.formInput} ${errors.expiryDate ? s.invalid : ''}`}
                type="text"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={(e) =>
                  handlePaymentChange('expiryDate', e.target.value)
                }
                maxLength={5}
              />
            </div>
            {errors.expiryDate && (
              <span className={s.errorText}>{errors.expiryDate}</span>
            )}
          </div>
          <div className={s.fieldGroup}>
            <label className={s.fieldLabel}>CVV</label>
            <div className={s.inputWrapper}>
              <input
                className={`${s.formInput} ${errors.cvv ? s.invalid : ''}`}
                type="password"
                placeholder="123"
                value={paymentData.cvv}
                onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                maxLength={4}
              />
            </div>
            {errors.cvv && <span className={s.errorText}>{errors.cvv}</span>}
          </div>
        </div>
      </div>
      <div className={s.navButtons}>
        <button
          className={`${s.button} ${s.secondaryButton}`}
          onClick={() => {
            setStep(1);
            setErrors({});
          }}
        >
          Back
        </button>
        <button
          className={`${s.button} ${s.primaryButton}`}
          onClick={handlePaymentSubmit}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );

  // Step 3: Review
  const renderReview = () => (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <h2 className={s.cardTitle}>Order Review</h2>
      </div>

      <div className={s.reviewSection}>
        <h3 className={s.reviewSectionTitle}>Shipping Address</h3>
        <p className={s.reviewText}>
          {shippingAddress.street}
          <br />
          {shippingAddress.city}, {shippingAddress.state}{' '}
          {shippingAddress.postalCode}
          <br />
          {shippingAddress.country}
        </p>
      </div>

      <div className={s.reviewSection}>
        <h3 className={s.reviewSectionTitle}>Payment Method</h3>
        <p className={s.reviewText}>
          Card ending in {paymentData.cardNumber.replace(/\s/g, '').slice(-4)}
        </p>
      </div>

      <div className={s.reviewSection}>
        <h3 className={s.reviewSectionTitle}>
          Items ({cart.length + coupons.length})
        </h3>
        {cart.map((item) => {
          const thumbnail =
            item.book?.volumeInfo?.imageLinks?.thumbnail ||
            item.book?.volumeInfo?.imageLinks?.customCover;
          return (
            <div key={item.id} className={s.orderItemRow}>
              {thumbnail && (
                <img
                  className={s.orderItemCover}
                  src={thumbnail}
                  alt={item.book?.volumeInfo?.title || ''}
                />
              )}
              <div className={s.orderItemInfo}>
                <div className={s.orderItemTitle}>
                  {item.book?.volumeInfo?.title}
                </div>
                <div className={s.orderItemDetails}>
                  Qty: {item.number} x $
                  {(item.book?.saleInfo?.listPrice?.amount ?? 0).toFixed(2)}
                </div>
              </div>
              <div className={s.orderItemPrice}>
                $
                {(
                  (item.book?.saleInfo?.listPrice?.amount ?? 0) * item.number
                ).toFixed(2)}
              </div>
            </div>
          );
        })}
        {coupons.map((coupon: TCouponItem) => (
          <div key={coupon.id} className={s.orderItemRow}>
            <div className={s.orderItemInfo}>
              <div className={s.orderItemTitle}>
                Gift Coupon — {coupon.label}
              </div>
              <div className={s.orderItemDetails}>
                Qty: {coupon.quantity} x ${coupon.value.toFixed(2)}
              </div>
            </div>
            <div className={s.orderItemPrice}>
              ${(coupon.value * coupon.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className={s.orderTotal}>
        <span className={s.orderTotalLabel}>Total</span>
        <span className={s.orderTotalAmount}>${totalPrice.toFixed(2)}</span>
      </div>

      <div className={s.navButtons}>
        <button
          className={`${s.button} ${s.secondaryButton}`}
          onClick={() => {
            setStep(2);
            setErrors({});
          }}
        >
          Back
        </button>
      </div>

      <button
        className={`${s.button} ${s.primaryButton} ${s.placeOrderButton}`}
        onClick={handlePlaceOrder}
        disabled={isLoading}
      >
        {isLoading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );

  // Step 4: Confirmation
  const renderConfirmation = () => (
    <div className={s.card}>
      <div className={s.confirmationContainer}>
        <div className={s.successIcon} />
        <h2 className={s.confirmationTitle}>Order Confirmed!</h2>
        <p className={s.orderNumber}>Order #{orderResult?.id}</p>
        <p className={s.confirmationDetails}>
          Total: ${finalTotalRef.current.toFixed(2)} &middot;{' '}
          {orderResult?.createdAt
            ? new Date(orderResult.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            : ''}
        </p>
        <button
          className={`${s.button} ${s.primaryButton}`}
          onClick={() => router.push('/')}
          style={{margin: '0 auto'}}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );

  if (!userCredentials.isAuthenticated) return null;

  return (
    <Layout>
      <div className={s.pageContainer}>
        <h1 className={s.pageTitle}>Checkout</h1>
        {step < 4 && renderSteps()}
        {step === 1 && renderShipping()}
        {step === 2 && renderPayment()}
        {step === 3 && renderReview()}
        {step === 4 && renderConfirmation()}
      </div>
      {toast.show && (
        <div className={`${s.toast} ${s[toast.type]}`}>{toast.message}</div>
      )}
    </Layout>
  );
}
