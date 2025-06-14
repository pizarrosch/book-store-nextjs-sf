import {Button, ButtonProps} from '@blueprintjs/core';
import Image from 'next/image';
import React from 'react';
import {bookData} from '@/components/Book/Books';
import {useAppSelector, useAppDispatch} from '@/pages/hooks';
import {removeCartItem, subtractPrice, TClicked} from '@/reducer';
import unfilledStar from '../../../public/assets/Star.svg';
import filledStar from '../../../public/assets/star-filled.svg';
import s from './BookDetails.module.scss';

type BookDetailsProps = bookData & {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  buyIndex: TClicked | undefined;
};

export default function BookDetails(details: BookDetailsProps) {
  const {onClick} = details;
  const dispatch = useAppDispatch();

  const cart = useAppSelector((state) => state.cart);
  const isItemAdded = cart.some((item) => item.id === String(details.id));
  const itemToRemove = cart.filter((item) => item.id === String(details.id));
  const itemInTheCart = cart.find((item) => item.id === String(details.id));
  const quantity = itemInTheCart?.number || 0;

  const handleClick: ButtonProps['onClick'] = (e) => {
    onClick(e as React.MouseEvent<HTMLButtonElement>);
  };

  function removeFromCart() {
    dispatch(removeCartItem(itemToRemove[itemToRemove.length - 1]));
    dispatch(subtractPrice(details.saleInfo.listPrice.amount * quantity));
  }

  return (
    <div className={s.bookInformation}>
      <span className={s.author}>{details.volumeInfo?.authors}</span>
      <h2 className={s.title}>{details.volumeInfo?.title}</h2>
      <div className={s.ratingsWrapper}>
        <div className={s.rating}>
          <Image
            src={
              details.volumeInfo?.averageRating > 0 ? filledStar : unfilledStar
            }
            alt="rating"
            width="12"
            height="12"
          />
          <Image
            src={
              details.volumeInfo?.averageRating > 1 ? filledStar : unfilledStar
            }
            alt="rating"
            width="12"
            height="12"
          />
          <Image
            src={
              details.volumeInfo?.averageRating > 2 ? filledStar : unfilledStar
            }
            alt="rating"
            width="12"
            height="12"
          />
          <Image
            src={
              details.volumeInfo?.averageRating > 3 ? filledStar : unfilledStar
            }
            alt="rating"
            width="12"
            height="12"
          />
          <Image
            src={
              details.volumeInfo?.averageRating > 4 ? filledStar : unfilledStar
            }
            alt="rating"
            width="12"
            height="12"
          />
        </div>
        <span>
          {details.volumeInfo?.ratingsCount
            ? `${details.volumeInfo.ratingsCount} ${details.volumeInfo.ratingsCount === 1 ? 'review' : 'reviews'}`
            : 'N/A'}
        </span>
      </div>
      <p className={s.bookDescription}>
        {details.volumeInfo?.description || 'No description available'}
      </p>
      <span className={s.price}>
        {details.saleInfo?.listPrice
          ? '$' + details.saleInfo?.listPrice.amount
          : 'out of stock'}
      </span>
      <Button
        style={{width: '132px'}}
        onClick={!isItemAdded ? handleClick : removeFromCart}
        data-id={details.id}
        intent={!isItemAdded ? 'primary' : 'danger'}
        text={!isItemAdded ? 'Add to cart' : 'Remove from cart'}
      />
    </div>
  );
}
