import {Icon} from '@blueprintjs/core';
import Image from 'next/image';
import React from 'react';
import {useDispatch} from 'react-redux';
import {bookData} from '@/components/Book/Books';
import {useAppSelector} from '@/pages/hooks';
import {
  addPrice,
  decrease,
  increase,
  removeCartItem,
  removedFromCart,
  subtractPrice,
  TCartItem
} from '@/reducer';
import unfilledStar from '../../../public/assets/Star.svg';
import filledStar from '../../../public/assets/star-filled.svg';
import s from './CartItem.module.scss';

export default function CartItem() {
  const starsCount = [1, 2, 3, 4, 5];
  const cart = useAppSelector((state) => state.cart);
  const books = useAppSelector((state) => state.books);
  const dispatch = useDispatch();

  return cart.map((cartItem: TCartItem, id: number) => {
    // Use book from cart item, or fallback to books array for backward compatibility
    const book =
      cartItem.book ||
      books.find((book: bookData) => String(book.id) === cartItem.id);

    if (!book) return null;

    return (
      <div className={s.item} key={cartItem.id}>
        <div className={s.booksContainer}>
          <Image
            src={
              book.volumeInfo?.imageLinks?.thumbnail || '/assets/no-cover.jpg'
            }
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
                {starsCount.map((star, index) => (
                  <Image
                    src={
                      book.volumeInfo.averageRating >= star
                        ? filledStar
                        : unfilledStar
                    }
                    key={index}
                    alt="rating"
                    width="12"
                    height="12"
                  />
                ))}
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
          <div className={s.itemAmountCounter} data-id={cartItem.id} key={id}>
            <button
              className={s.counterBtn}
              onClick={() => {
                if (cartItem.number <= 1) {
                  dispatch(removeCartItem(cartItem));
                  dispatch(subtractPrice(book.saleInfo.listPrice.amount));
                  dispatch(
                    removedFromCart({
                      id: String(book.id),
                      isClicked: 'buy now'
                    })
                  );
                  return;
                }
                dispatch(decrease(cartItem));
                dispatch(subtractPrice(book.saleInfo.listPrice.amount));
              }}
            >
              <Icon icon="minus" iconSize={12} />
            </button>
            <span className={s.itemsAmount} key={cartItem.number}>{cartItem.number}</span>
            <button
              className={s.counterBtn}
              onClick={() => {
                dispatch(increase(cartItem));
                dispatch(addPrice(book.saleInfo.listPrice.amount));
              }}
            >
              <Icon icon="plus" iconSize={12} />
            </button>
          </div>
          <div className={s.price}>
            {book.saleInfo.listPrice
              ? `$${(book.saleInfo.listPrice.amount * cartItem.number).toFixed(2)}`
              : 'out of stock'}
          </div>
          <div
            className={s.trash}
            onClick={() => dispatch(removeCartItem(cartItem))}
          >
            <Icon icon="trash" />
          </div>
        </div>
      </div>
    );
  });
}
