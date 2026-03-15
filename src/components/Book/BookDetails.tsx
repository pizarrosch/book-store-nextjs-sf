import {Button, ButtonProps, Icon} from '@blueprintjs/core';
import Image from 'next/image';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import useRemoveFromCart from '@/hooks/hooks';
import {useAppSelector} from '@/pages/hooks';
import {addWatchlistItem, removeWatchlistItem} from '@/reducer';
import {BookDetailsProps} from '@/types';
import unfilledStar from '../../../public/assets/Star.svg';
import filledStar from '../../../public/assets/star-filled.svg';
import s from './BookDetails.module.scss';

export default function BookDetails(details: BookDetailsProps) {
  const {onClick} = details;
  const dispatch = useDispatch();

  const cart = useAppSelector((state) => state.cart);
  const watchlist = useAppSelector((state) => state.watchlist);
  const userData = useAppSelector((state) => state.userCredentials);
  const isItemAdded = cart.some((item) => item.id === String(details.id));
  const isInWatchlist = watchlist.some(
    (item) => item.id === String(details.id)
  );
  const removeFromCart = useRemoveFromCart();
  const [isPopping, setIsPopping] = useState(false);

  const handleWatchlist = async () => {
    setIsPopping(true);
    const bookId = String(details.id);
    const bookData = {
      id: details.id,
      volumeInfo: details.volumeInfo,
      saleInfo: details.saleInfo
    };

    if (isInWatchlist) {
      dispatch(removeWatchlistItem(bookId));
      if (userData.isAuthenticated && userData.token) {
        await fetch('/api/watchlist', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData.token}`
          },
          body: JSON.stringify({bookId})
        });
      }
    } else {
      dispatch(addWatchlistItem({id: bookId, book: bookData}));
      if (userData.isAuthenticated && userData.token) {
        await fetch('/api/watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData.token}`
          },
          body: JSON.stringify({bookId})
        });
      }
    }
  };

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
      <div className={s.buttonRow}>
        <Button
          onClick={!isItemAdded ? handleClick : () => removeFromCart(details)}
          data-id={details.id}
          intent={!isItemAdded ? 'primary' : 'danger'}
          text={!isItemAdded ? 'Add to cart' : 'Remove from cart'}
          large
          className={s.cartBtn}
        />
        <button
          className={`${s.watchlistBtn} ${isInWatchlist ? s.watchlistActive : ''} ${isPopping ? s.pop : ''}`}
          onClick={handleWatchlist}
          onAnimationEnd={() => setIsPopping(false)}
          aria-label={
            isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'
          }
          title={isInWatchlist ? 'Remove from watchlist' : 'Save for later'}
        >
          <Icon icon={isInWatchlist ? 'bookmark' : 'bookmark'} size={16} />
        </button>
      </div>
    </div>
  );
}
