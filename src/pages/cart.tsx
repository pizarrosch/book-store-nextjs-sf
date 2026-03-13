import React from 'react';
import CartItem from '@/components/Cart/CartItem';
import Layout from '@/components/Layout/Layout';
import {useAppSelector} from '@/pages/hooks';
import s from '../styles/cart.module.scss';

export default function Cart() {
  const totalPrice = useAppSelector((state) => state.price);

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
          <button className={s.checkoutButton}>CHECKOUT</button>
        </div>
      </div>
    </Layout>
  );
}
