import {Icon} from '@blueprintjs/core';
import {useRouter} from 'next/navigation';
import React from 'react';
import {useDispatch} from 'react-redux';
import CartItem from '@/components/Cart/CartItem';
import Layout from '@/components/Layout/Layout';
import {useAppSelector} from '@/pages/hooks';
import {
  decreaseCoupon,
  increaseCoupon,
  removeCoupon,
  setShowLogin
} from '@/reducer';
import s from '../styles/cart.module.scss';

export default function Cart() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useAppSelector((state) => state.cart);
  const coupons = useAppSelector((state) => state.coupons);
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
  const userCredentials = useAppSelector((state) => state.userCredentials);

  const handleCheckout = () => {
    if (!userCredentials.isAuthenticated) {
      dispatch(setShowLogin(true));
    } else {
      router.push('/checkout');
    }
  };

  return (
    <Layout>
      <h1 className={s.title}>Shopping cart</h1>
      <div className={s.cartContainer}>
        <div className={s.itemsContainer}>
          <CartItem />
          {coupons.map((coupon) => (
            <div className={s.couponItem} key={coupon.id}>
              <div className={s.couponInfo}>
                <span className={s.couponBadge}>Gift Coupon</span>
                <span className={s.couponLabel}>{coupon.label}</span>
              </div>
              <div className={s.couponActions}>
                <div className={s.couponCounter}>
                  <button
                    className={s.counterBtn}
                    onClick={() => dispatch(decreaseCoupon(coupon.id))}
                  >
                    <Icon icon="minus" iconSize={12} />
                  </button>
                  <span className={s.couponQty}>{coupon.quantity}</span>
                  <button
                    className={s.counterBtn}
                    onClick={() => dispatch(increaseCoupon(coupon.id))}
                  >
                    <Icon icon="plus" iconSize={12} />
                  </button>
                </div>
                <div className={s.couponPrice}>
                  ${(coupon.value * coupon.quantity).toFixed(2)}
                </div>
                <div
                  className={s.couponTrash}
                  onClick={() => dispatch(removeCoupon(coupon.id))}
                >
                  <Icon icon="trash" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={s.priceContainer}>
          <span className={s.totalLabel}>
            TOTAL PRICE: ${totalPrice.toFixed(2)}
          </span>
          <button className={s.checkoutButton} onClick={handleCheckout}>
            CHECKOUT
          </button>
        </div>
      </div>
    </Layout>
  );
}
