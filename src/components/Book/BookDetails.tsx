import {Button, ButtonProps} from '@blueprintjs/core';
import Image from 'next/image';
import React from 'react';
import useRemoveFromCart from '@/hooks/hooks';
import {useAppSelector} from '@/pages/hooks';
import {BookDetailsProps} from '@/types';
import unfilledStar from '../../../public/assets/Star.svg';
import filledStar from '../../../public/assets/star-filled.svg';
import s from './BookDetails.module.scss';

export default function BookDetails(details: BookDetailsProps) {
  const {onClick} = details;

  const cart = useAppSelector((state) => state.cart);
  const isItemAdded = cart.some((item) => item.id === String(details.id));
  const removeFromCart = useRemoveFromCart();

  const handleClick: ButtonProps['onClick'] = (e) => {
    onClick(e as React.MouseEvent<HTMLButtonElement>);
  };

  return (
    <div className={s.bookInformation}>
      <span className={s.author}>
        {details.volumeInfo?.authors?.join(', ') || 'Unknown Author'}
      </span>
      <h2 className={s.title}>{details.volumeInfo?.title}</h2>
      <div
        className={s.ratingsWrapper}
        aria-label={`Rated ${details.volumeInfo?.averageRating || 0} out of 5 stars`}
      >
        <div className={s.rating} aria-hidden="true">
          {[1, 2, 3, 4, 5].map((star) => (
            <Image
              key={star}
              src={
                details.volumeInfo?.averageRating >= star
                  ? filledStar
                  : unfilledStar
              }
              alt=""
              width="12"
              height="12"
            />
          ))}
        </div>
        <span>
          {details.volumeInfo?.ratingsCount
            ? `${details.volumeInfo.ratingsCount} ${details.volumeInfo.ratingsCount === 1 ? 'review' : 'reviews'}`
            : 'No reviews yet'}
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
        onClick={!isItemAdded ? handleClick : () => removeFromCart(details)}
        data-id={details.id}
        intent={!isItemAdded ? 'primary' : 'danger'}
        text={!isItemAdded ? 'Add to cart' : 'Remove from cart'}
        large
      />
    </div>
  );
}
