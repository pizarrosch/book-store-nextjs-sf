import {Icon} from '@blueprintjs/core';
import Image from 'next/image';
import React, {useState} from 'react';
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
  const books = useAppSelector((state) => state.books);
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useDispatch();

  return cart.map((cartItem: TCartItem, id: number) => {
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
            <div
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
                dispatch(
                  decrease({
                    number: cartItem.number,
                    id: String(book.id)
                  })
                );
                dispatch(subtractPrice(book.saleInfo.listPrice.amount));
              }}
            >
              <Icon icon="minus" />
            </div>
            <span className={s.itemsAmount}>{cartItem.number}</span>
            <div
              onClick={() => {
                dispatch(
                  increase({
                    number: cartItem.number,
                    id: String(book.id)
                  })
                );
                dispatch(addPrice(book.saleInfo.listPrice.amount));
              }}
            >
              <Icon icon="plus" />
            </div>
          </div>
          <div>
            {book.saleInfo.listPrice
              ? `$${(book.saleInfo.listPrice.amount * cartItem.number).toFixed(2)}`
              : 'out of stock'}
          </div>
          <Icon icon="trash" />
        </div>
      </div>
    );
  });
}
