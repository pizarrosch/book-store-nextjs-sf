import React from 'react';
import CartItems from '@/components/Cart/CartItems';
import Layout from '@/components/Layout/Layout';
import {useAppSelector} from '@/pages/hooks';
import s from '../styles/cart.module.scss';

type TShowLogin = {
  handleShowLogin: () => void;
};

export default function Cart({handleShowLogin}: TShowLogin) {
  const totalPrice = useAppSelector((state) => state.price);

  return (
    <Layout handleShowLogin={handleShowLogin}>
      <div className={s.cartContainer}>
        <h1>Shopping cart</h1>
        <div className={s.subscript}>
          <span className={s.subscript_items}>Items</span>
          <div className={s.subscript_subitems}>
            <span>Quantity</span>
            <span>Price</span>
            <span>Delivery</span>
          </div>
        </div>
        <div className={s.itemsContainer}>
          <CartItems />
        </div>
        <div className={s.priceContainer}>
          <span className={s.totalPrice}>
            TOTAL PRICE: ${totalPrice.toFixed(2)}
          </span>
          <button className={s.checkoutButton}>CHECKOUT</button>
        </div>
      </div>
    </Layout>
  );
}
