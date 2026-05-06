import {Icon} from '@blueprintjs/core';
import Image from 'next/image';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import {bookData} from '@/components/Book/Books';
import WatchlistBookmark from '@/components/Book/WatchlistBookmark';
import {useAppDispatch, useAppSelector} from '@/pages/hooks';
import {
  addBook,
  addCartItem,
  addReview,
  addWatchlistItem,
  removeCartItem,
  removeReview,
  removeWatchlistItem,
  setShowLogin,
  TReview
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
  const [reviewText, setReviewText] = useState('');
  const [reviewSentiment, setReviewSentiment] = useState<'positive' | 'negative' | null>(null);

  const allReviews = useAppSelector((state) => state.reviews);
  const bookReviews = allReviews.filter((r: TReview) => r.bookId === String(book.id));
  const userName = useAppSelector((state) => state.userCredentials.name);
  const isAuthenticated = useAppSelector((state) => state.userCredentials.isAuthenticated);

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

  const handleSubmitReview = () => {
    if (!reviewText.trim() || !reviewSentiment) return;
    dispatch(
      addReview({
        id: Date.now().toString(),
        bookId: String(book.id),
        text: reviewText.trim(),
        sentiment: reviewSentiment,
        author: userName || 'Anonymous',
        createdAt: new Date().toISOString()
      })
    );
    setReviewText('');
    setReviewSentiment(null);
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
            <WatchlistBookmark
              isActive={isInWatchlist}
              onToggle={handleToggleWatchlist}
            />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className={s.reviewsSection}>
        <h2 className={s.reviewsHeading}>
          Community Reviews
          {bookReviews.length > 0 && (
            <span className={s.reviewsBadge}>{bookReviews.length}</span>
          )}
        </h2>

        {/* Sentiment summary bar */}
        {bookReviews.length > 0 && (() => {
          const positiveCount = bookReviews.filter((r: TReview) => r.sentiment === 'positive').length;
          const negativeCount = bookReviews.length - positiveCount;
          const positivePercent = Math.round((positiveCount / bookReviews.length) * 100);
          return (
            <div className={s.summaryBar}>
              <div className={s.summaryBarTrack}>
                {positivePercent > 0 && (
                  <div
                    className={s.summaryBarPositive}
                    style={{width: `${positivePercent}%`}}
                  />
                )}
                {positivePercent < 100 && (
                  <div
                    className={s.summaryBarNegative}
                    style={{width: `${100 - positivePercent}%`}}
                  />
                )}
              </div>
              <div className={s.summaryBarLabels}>
                <span className={s.summaryLabelPositive}>👍 {positiveCount} positive</span>
                <span className={s.summaryLabelNegative}>{negativeCount} negative 👎</span>
              </div>
            </div>
          );
        })()}

        {/* Write a review */}
        {isAuthenticated ? (
          <div className={s.reviewForm}>
            <textarea
              className={s.reviewTextarea}
              placeholder="Share your thoughts about this book..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              maxLength={1000}
            />
            <div className={s.reviewFormFooter}>
              <div className={s.sentimentToggle}>
                <button
                  className={`${s.sentimentBtn} ${reviewSentiment === 'positive' ? s.sentimentPositiveActive : ''}`}
                  onClick={() => setReviewSentiment(reviewSentiment === 'positive' ? null : 'positive')}
                  type="button"
                  aria-pressed={reviewSentiment === 'positive'}
                >
                  👍 Positive
                </button>
                <button
                  className={`${s.sentimentBtn} ${reviewSentiment === 'negative' ? s.sentimentNegativeActive : ''}`}
                  onClick={() => setReviewSentiment(reviewSentiment === 'negative' ? null : 'negative')}
                  type="button"
                  aria-pressed={reviewSentiment === 'negative'}
                >
                  👎 Negative
                </button>
              </div>
              <button
                className={s.submitReviewBtn}
                onClick={handleSubmitReview}
                disabled={!reviewText.trim() || !reviewSentiment}
              >
                Post Review
              </button>
            </div>
          </div>
        ) : (
          <div className={s.reviewGuestPrompt}>
            <p>
              Want to share your thoughts?{' '}
              <button
                className={s.reviewGuestLink}
                onClick={() => dispatch(setShowLogin(true))}
              >
                Sign in
              </button>{' '}
              or{' '}
              <button
                className={s.reviewGuestLink}
                onClick={() => dispatch(setShowLogin(true))}
              >
                create an account
              </button>{' '}
              to write a review.
            </p>
          </div>
        )}

        {/* Review list */}
        {bookReviews.length === 0 ? (
          <p className={s.noReviews}>No reviews yet. Be the first to share your thoughts!</p>
        ) : (
          <div className={s.reviewList}>
            {[...bookReviews].reverse().map((review: TReview) => (
              <div
                key={review.id}
                className={`${s.reviewCard} ${review.sentiment === 'positive' ? s.reviewPositive : s.reviewNegative}`}
              >
                <div className={s.reviewHeader}>
                  <div className={s.reviewMeta}>
                    <span className={s.reviewAuthor}>{review.author}</span>
                    <span className={s.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className={s.reviewActions}>
                    <span className={`${s.sentimentLabel} ${review.sentiment === 'positive' ? s.sentimentLabelPositive : s.sentimentLabelNegative}`}>
                      {review.sentiment === 'positive' ? '👍 Positive' : '👎 Negative'}
                    </span>
                    {(review.author === (userName || 'Anonymous')) && (
                      <button
                        className={s.deleteReviewBtn}
                        onClick={() => dispatch(removeReview(review.id))}
                        aria-label="Delete review"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
                <p className={s.reviewText}>{review.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
