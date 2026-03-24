import {Icon} from '@blueprintjs/core';
import Image from 'next/image';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import {bookData} from '@/components/Book/Books';
import {useAppDispatch, useAppSelector} from '@/pages/hooks';
import {
  addBook,
  addCartItem,
  addWatchlistItem,
  removeCartItem,
  removeWatchlistItem
} from '@/reducer';
import unfilledStar from '../../../public/assets/Star.svg';
import noCoverBook from '../../../public/assets/no-cover.jpg';
import filledStar from '../../../public/assets/star-filled.svg';
import s from './BookItem.module.scss';

type BookItemProps = {
  book: bookData;
};

export default function BookItem({book}: BookItemProps) {
  const {volumeInfo, saleInfo} = book;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const watchlist = useAppSelector((state) => state.watchlist);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  // Check if book is already in cart or watchlist
  const isInCart = cart.some((item) => item.id === String(book.id));
  const isInWatchlist = watchlist.some((item) => item.id === String(book.id));

  // Handle add to cart
  const handleAddToCart = () => {
    if (!isInCart && saleInfo?.listPrice) {
      dispatch(addBook(book));
      dispatch(
        addCartItem({
          number: 1,
          id: String(book.id),
          book: book
        })
      );
    }
  };

  // Handle remove from cart
  const handleRemoveFromCart = () => {
    const cartItem = cart.find((item) => item.id === String(book.id));
    if (cartItem) {
      dispatch(removeCartItem(cartItem));
    }
  };

  // Handle toggle watchlist
  const handleToggleWatchlist = () => {
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 350);
    if (isInWatchlist) {
      dispatch(removeWatchlistItem(String(book.id)));
    } else {
      dispatch(
        addWatchlistItem({
          id: String(book.id),
          book: book
        })
      );
    }
  };

  // Get the image URL with priority: custom cover > Google thumbnail > fallback
  const customCover = volumeInfo?.imageLinks?.customCover;
  const googleThumbnail = volumeInfo?.imageLinks?.thumbnail;
  const imageUrl = customCover
    ? customCover
    : googleThumbnail
      ? googleThumbnail
          .replace('http:', 'https:')
          .replace('&edge=curl', '')
          .replace(/zoom=\d+/, 'zoom=3')
      : noCoverBook;

  return (
    <div className={s.container}>
      <button className={s.backBtn} onClick={() => router.back()}>
        <Icon icon="arrow-left" size={14} />
        Back to results
      </button>
      <div className={s.productGrid}>
        {/* Left Column - Image */}
        <div className={s.imageSection}>
          <Image
            src={imageUrl}
            alt={volumeInfo?.title || 'Book cover'}
            width={400}
            height={600}
            className={s.coverImage}
            priority
            quality={95}
          />
        </div>

        {/* Right Column - Details */}
        <div className={s.detailsSection}>
          {/* Title and Authors */}
          <div className={s.titleSection}>
            <h1>{volumeInfo.title}</h1>
            <p className={s.authors}>
              {volumeInfo.authors?.join(', ') || 'Unknown Author'}
            </p>
          </div>

          {/* Rating Section */}
          <div className={s.ratingSection}>
            <div
              className={s.rating}
              aria-label={`Rated ${volumeInfo?.averageRating || 0} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <Image
                  key={star}
                  src={
                    volumeInfo?.averageRating >= star
                      ? filledStar
                      : unfilledStar
                  }
                  alt=""
                  width="16"
                  height="16"
                />
              ))}
            </div>
            <span className={s.reviewCount}>
              {volumeInfo?.ratingsCount
                ? `${volumeInfo.ratingsCount} ${volumeInfo.ratingsCount === 1 ? 'review' : 'reviews'}`
                : 'No reviews yet'}
            </span>
          </div>

          {/* Price Section */}
          <div className={s.priceSection}>
            {saleInfo?.listPrice ? (
              <>
                <span className={s.price}>${saleInfo.listPrice.amount}</span>
                <span className={s.availability}>In Stock</span>
              </>
            ) : (
              <span className={s.outOfStock}>Out of stock</span>
            )}
          </div>

          {/* Description */}
          {volumeInfo.description && (
            <div className={s.descriptionWrapper}>
              <div
                className={`${s.description} ${isExpanded ? s.expanded : s.collapsed}`}
              >
                <p>{volumeInfo.description}</p>
              </div>
              <button
                className={s.showMoreBtn}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className={s.actionButtons}>
            <button
              onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
              className={`${s.addToCartBtn} ${isInCart ? s.addedToCart : ''}`}
              disabled={!saleInfo?.listPrice}
            >
              {isInCart ? 'Remove from Cart' : 'Add to Cart'}
            </button>
            <button
              onClick={handleToggleWatchlist}
              className={isInWatchlist ? s.bookmarkBtnActive : s.bookmarkBtn}
              aria-label={
                isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'
              }
            >
              <Icon
                icon="heart"
                size={22}
                color={
                  isInWatchlist
                    ? 'var(--color-primary)'
                    : 'var(--color-gray-400)'
                }
                className={isHeartAnimating ? s.heartAnimate : undefined}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
