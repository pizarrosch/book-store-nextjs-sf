import React from 'react';
import {useDispatch} from 'react-redux';
import CartItem from '@/components/Cart/CartItem';
import Layout from '@/components/Layout/Layout';
import {useAppSelector} from '@/pages/hooks';
import {setShowLogin} from '@/reducer';
import s from '../styles/cart.module.scss';

export default function Cart() {
  const dispatch = useDispatch();
  const cart = useAppSelector((state) => state.cart);
  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + (item.book?.saleInfo?.listPrice?.amount ?? 0) * item.number,
    0
  );
  const userCredentials = useAppSelector((state) => state.userCredentials);

  const handleCheckout = () => {
    if (!userCredentials.isAuthenticated) {
      dispatch(setShowLogin(true));
    } else {
      console.log('Proceed to checkout');
    }
  };

  return (
    <Layout>
      <h1 className={s.title}>Shopping cart</h1>
      <div className={s.cartContainer}>
        <div className={s.itemsContainer}>
          <CartItem />
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
