import Image from 'next/image';
import React from 'react';
import {useDispatch} from 'react-redux';
import {bookData} from '@/components/Book/Books';
import Layout from '@/components/Layout/Layout';
import {useAppSelector} from '@/pages/hooks';
import {
  increase,
  decrease,
  addPrice,
  subtractPrice,
  TCartItem,
  removeCartItem,
  removedFromCart
} from '@/reducer';
import unfilledStar from '../../public/assets/Star.svg';
import minus from '../../public/assets/minus.svg';
import plus from '../../public/assets/plus.svg';
import filledStar from '../../public/assets/star-filled.svg';
import s from '../styles/cart.module.scss';

type TShowLogin = {
  handleShowLogin: () => void;
};

export default function Cart({handleShowLogin}: TShowLogin) {
  const books = useAppSelector((state) => state.books);
  const totalPrice = useAppSelector((state) => state.price);
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <Layout handleShowLogin={handleShowLogin}>
      <div className={s.cartContainer}>
        <h1>Shopping cart</h1>
        <div className={s.subscript}>
          <span>Item</span>
          <div className={s.subscript_subitems}>
            <span>Quantity</span>
            <span>Price</span>
            <span>Delivery</span>
          </div>
        </div>
        <div className={s.itemsContainer}>
          {cart.map((cartItem: TCartItem, id: number) => {
            const book = books.find(
              (book: bookData) => String(book.id) === cartItem.id
            );

            if (!book) return 'Not found';

            return (
              <div className={s.item} key={cartItem.id}>
                <div className={s.booksContainer}>
                  <Image
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt="book-cover"
                    width={103}
                    height={145}
                    className={s.coverImage}
                  />
                  <div className={s.bookInformation}>
                    <span className={s.title}>{book.volumeInfo.title}</span>
                    <span className={s.author}>{book.volumeInfo.authors}</span>
                    <div className={s.ratingsContainer}>
                      <div className={s.rating}>
                        <Image
                          src={
                            book.volumeInfo.averageRating > 0
                              ? filledStar
                              : unfilledStar
                          }
                          alt="rating"
                          width="12"
                          height="12"
                        />
                        <Image
                          src={
                            book.volumeInfo.averageRating > 1
                              ? filledStar
                              : unfilledStar
                          }
                          alt="rating"
                          width="12"
                          height="12"
                        />
                        <Image
                          src={
                            book.volumeInfo.averageRating > 2
                              ? filledStar
                              : unfilledStar
                          }
                          alt="rating"
                          width="12"
                          height="12"
                        />
                        <Image
                          src={
                            book.volumeInfo.averageRating > 3
                              ? filledStar
                              : unfilledStar
                          }
                          alt="rating"
                          width="12"
                          height="12"
                        />
                        <Image
                          src={
                            book.volumeInfo.averageRating > 4
                              ? filledStar
                              : unfilledStar
                          }
                          alt="rating"
                          width="12"
                          height="12"
                        />
                      </div>
                      <span className={s.ratingAmount}>
                        {book.volumeInfo.ratingsCount
                          ? `${book.volumeInfo.ratingsCount} ${book.volumeInfo.ratingsCount === 1 ? 'review' : 'reviews'}`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={s.itemSubitems}>
                  <div
                    className={s.itemAmountCounter}
                    data-id={cartItem.id}
                    key={id}
                  >
                    <Image
                      src={minus}
                      alt=""
                      className={s.minus}
                      onClick={() => {
                        if (cartItem.number <= 1) {
                          dispatch(removeCartItem(cartItem));
                          dispatch(
                            subtractPrice(book.saleInfo.listPrice.amount)
                          );
                          dispatch(
                            removedFromCart({
                              id: String(book.id),
                              isClicked: 'buy now'
                            })
                          );
                          return;
                        }
                        dispatch(
                          decrease({
                            number: cartItem.number,
                            id: String(book.id)
                          })
                        );
                        dispatch(subtractPrice(book.saleInfo.listPrice.amount));
                      }}
                    />
                    <span className={s.itemsAmount}>{cartItem.number}</span>
                    <Image
                      src={plus}
                      alt=""
                      className={s.plus}
                      onClick={() => {
                        dispatch(
                          increase({
                            number: cartItem.number,
                            id: String(book.id)
                          })
                        );
                        dispatch(addPrice(book.saleInfo.listPrice.amount));
                      }}
                    />
                  </div>
                  <div className={s.itemPrice}>
                    {book.saleInfo.listPrice
                      ? `$${(book.saleInfo.listPrice.amount * cartItem.number).toFixed(2)}`
                      : 'out of stock'}
                  </div>
                  <div>Shipping: delivery</div>
                </div>
              </div>
            );
          })}
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
