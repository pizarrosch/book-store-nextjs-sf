import {useRouter} from 'next/navigation';
import {useDispatch} from 'react-redux';
import Layout from '@/components/Layout/Layout';
import {useAppSelector} from '@/pages/hooks';
import {addCoupon, setShowLogin} from '@/reducer';
import s from '../styles/coupons.module.scss';

const COUPONS = [
  {
    id: 'coupon-20',
    value: 20,
    label: '20 €',
    description: 'A great starter gift for any book lover.',
    color: 'green'
  },
  {
    id: 'coupon-50',
    value: 50,
    label: '50 €',
    description: 'Perfect for exploring new genres and titles.',
    color: 'blue'
  },
  {
    id: 'coupon-100',
    value: 100,
    label: '100 €',
    description: 'The ultimate gift for a dedicated reader.',
    color: 'purple'
  }
];

export default function Coupons() {
  const dispatch = useDispatch();
  const router = useRouter();
  const userCredentials = useAppSelector((state) => state.userCredentials);

  const handleAddCoupon = (coupon: (typeof COUPONS)[number]) => {
    if (!userCredentials.isAuthenticated) {
      dispatch(setShowLogin(true));
      return;
    }
    dispatch(
      addCoupon({
        id: coupon.id,
        value: coupon.value,
        label: coupon.label,
        quantity: 1
      })
    );
    router.push('/cart');
  };

  return (
    <Layout>
      <div className={s.pageContainer}>
        <div className={s.pageHeader}>
          <h1 className={s.pageTitle}>Gift Coupons</h1>
          <p className={s.pageSubtitle}>
            Give the gift of reading. Our gift coupons are the perfect present
            for every book lover.
          </p>
        </div>

        <div className={s.couponsGrid}>
          {COUPONS.map((coupon) => (
            <div
              key={coupon.value}
              className={`${s.couponCard} ${s[coupon.color]}`}
            >
              <div className={s.couponLeft}>
                <div className={s.couponLabel}>Gift Coupon</div>
                <div className={s.couponValue}>{coupon.label}</div>
                <div className={s.couponDescription}>{coupon.description}</div>
              </div>
              <div className={s.couponDivider}>
                <span className={s.notch} />
                <span className={s.notch} />
              </div>
              <div className={s.couponRight}>
                <div className={s.bookIcon}>📚</div>
                <button
                  className={s.addButton}
                  onClick={() => handleAddCoupon(coupon)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className={s.note}>
          Coupon codes will be sent to your email after purchase.
        </p>
      </div>
    </Layout>
  );
}
