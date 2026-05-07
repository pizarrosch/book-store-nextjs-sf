import {Icon} from '@blueprintjs/core';
import Image from 'next/image';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
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
  setBookReviews,
  setShowLogin,
  TReview,
  updateReviewVote
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
  const [reviewSentiment, setReviewSentiment] = useState<
    'positive' | 'negative' | 'neutral' | null
  >(null);
  const [reviewFilter, setReviewFilter] = useState<
    'all' | 'positive' | 'negative' | 'neutral'
  >('all');

  const allReviews = useAppSelector((state) => state.reviews);
  const bookReviews = allReviews.filter(
    (r: TReview) => r.bookId === String(book.id)
  );
  const userId = useAppSelector((state) => state.userCredentials.id);
  const token = useAppSelector((state) => state.userCredentials.token);
  const isAuthenticated = useAppSelector(
    (state) => state.userCredentials.isAuthenticated
  );

  useEffect(() => {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    fetch(`/api/reviews?bookId=${String(book.id)}`, {headers})
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews) {
          dispatch(
            setBookReviews({bookId: String(book.id), reviews: data.reviews})
          );
        }
      });
  }, [book.id, token, dispatch]);

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

  const handleSubmitReview = async () => {
    if (!reviewText.trim() || !reviewSentiment) return;
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        bookId: String(book.id),
        text: reviewText.trim(),
        sentiment: reviewSentiment
      })
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(addReview(data.review));
      setReviewText('');
      setReviewSentiment(null);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {Authorization: `Bearer ${token}`}
    });
    if (res.ok) {
      dispatch(removeReview(reviewId));
    }
  };

  const handleVote = async (reviewId: string, type: 'up' | 'down') => {
    if (!isAuthenticated) {
      dispatch(setShowLogin(true));
      return;
    }
    const res = await fetch(`/api/reviews/${reviewId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({type})
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(updateReviewVote({reviewId, ...data}));
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

        {/* Sentiment summary bars */}
        {bookReviews.length > 0 &&
          (() => {
            const counts = {
              positive: bookReviews.filter(
                (r: TReview) => r.sentiment === 'positive'
              ).length,
              neutral: bookReviews.filter(
                (r: TReview) => r.sentiment === 'neutral'
              ).length,
              negative: bookReviews.filter(
                (r: TReview) => r.sentiment === 'negative'
              ).length
            };
            const sorted = (['positive', 'neutral', 'negative'] as const)
              .slice()
              .sort((a, b) => counts[b] - counts[a]);
            const max = Math.max(...Object.values(counts), 1);
            const barClass: Record<string, string> = {
              positive: s.summaryBarPositive,
              neutral: s.summaryBarNeutral,
              negative: s.summaryBarNegative
            };
            const labelClass: Record<string, string> = {
              positive: s.summaryLabelPositive,
              neutral: s.summaryLabelNeutral,
              negative: s.summaryLabelNegative
            };
            return (
              <div className={s.summaryBars}>
                {sorted.map((sentiment) => (
                  <div key={sentiment} className={s.summaryRow}>
                    <span
                      className={`${s.summaryRowLabel} ${labelClass[sentiment]}`}
                    >
                      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                    </span>
                    <div className={s.summaryBarTrack}>
                      <div
                        className={barClass[sentiment]}
                        style={{
                          width: `${Math.round((counts[sentiment] / max) * 100)}%`
                        }}
                      />
                    </div>
                    <span className={s.summaryRowCount}>
                      {counts[sentiment]}
                    </span>
                  </div>
                ))}
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
                  onClick={() =>
                    setReviewSentiment(
                      reviewSentiment === 'positive' ? null : 'positive'
                    )
                  }
                  type="button"
                  aria-pressed={reviewSentiment === 'positive'}
                >
                  Positive
                </button>
                <button
                  className={`${s.sentimentBtn} ${reviewSentiment === 'neutral' ? s.sentimentNeutralActive : ''}`}
                  onClick={() =>
                    setReviewSentiment(
                      reviewSentiment === 'neutral' ? null : 'neutral'
                    )
                  }
                  type="button"
                  aria-pressed={reviewSentiment === 'neutral'}
                >
                  Neutral
                </button>
                <button
                  className={`${s.sentimentBtn} ${reviewSentiment === 'negative' ? s.sentimentNegativeActive : ''}`}
                  onClick={() =>
                    setReviewSentiment(
                      reviewSentiment === 'negative' ? null : 'negative'
                    )
                  }
                  type="button"
                  aria-pressed={reviewSentiment === 'negative'}
                >
                  Negative
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

        {/* Filter tabs */}
        {bookReviews.length > 0 && (
          <div className={s.filterTabs}>
            {(['all', 'positive', 'neutral', 'negative'] as const).map((f) => (
              <button
                key={f}
                className={`${s.filterTab} ${reviewFilter === f ? s.filterTabActive : ''}`}
                onClick={() => setReviewFilter(f)}
              >
                {f === 'all' && `All (${bookReviews.length})`}
                {f !== 'all' &&
                  `${f.charAt(0).toUpperCase() + f.slice(1)} (${bookReviews.filter((r: TReview) => r.sentiment === f).length})`}
              </button>
            ))}
          </div>
        )}

        {/* Review list */}
        {bookReviews.length === 0 ? (
          <p className={s.noReviews}>
            No reviews yet. Be the first to share your thoughts!
          </p>
        ) : (
          (() => {
            const filtered = [...bookReviews]
              .reverse()
              .filter(
                (r: TReview) =>
                  reviewFilter === 'all' || r.sentiment === reviewFilter
              );
            return filtered.length === 0 ? (
              <p className={s.noReviews}>No {reviewFilter} reviews yet.</p>
            ) : (
              <div className={s.reviewList}>
                {filtered.map((review: TReview) => (
                  <div
                    key={review.id}
                    className={`${s.reviewCard} ${review.sentiment === 'positive' ? s.reviewPositive : review.sentiment === 'negative' ? s.reviewNegative : s.reviewNeutral}`}
                  >
                    {review.authorId === userId && (
                      <button
                        className={s.deleteReviewBtn}
                        onClick={() => handleDeleteReview(review.id)}
                        aria-label="Delete review"
                      >
                        <Icon icon="trash" size={14} />
                      </button>
                    )}
                    <div className={s.reviewHeader}>
                      <div className={s.reviewMeta}>
                        <span className={s.reviewAuthor}>{review.author}</span>
                        <span className={s.reviewDate}>
                          {new Date(review.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }
                          )}
                        </span>
                      </div>
                      <div className={s.reviewActions}>
                        <span
                          className={`${s.sentimentLabel} ${review.sentiment === 'positive' ? s.sentimentLabelPositive : review.sentiment === 'negative' ? s.sentimentLabelNegative : s.sentimentLabelNeutral}`}
                        >
                          {review.sentiment.charAt(0).toUpperCase() +
                            review.sentiment.slice(1)}
                        </span>
                      </div>
                    </div>
                    <p className={s.reviewText}>{review.text}</p>
                    <div className={s.reviewFooter}>
                      <div className={s.voteButtons}>
                        <button
                          className={`${s.voteBtn} ${review.userVote === 'up' ? s.voteBtnUpActive : ''}`}
                          onClick={() => handleVote(review.id, 'up')}
                          aria-label="Upvote review"
                        >
                          👍
                          {review.upvotes > 0 && (
                            <span className={s.voteCount}>
                              {review.upvotes}
                            </span>
                          )}
                        </button>
                        <button
                          className={`${s.voteBtn} ${review.userVote === 'down' ? s.voteBtnDownActive : ''}`}
                          onClick={() => handleVote(review.id, 'down')}
                          aria-label="Downvote review"
                        >
                          👎
                          {review.downvotes > 0 && (
                            <span className={s.voteCount}>
                              {review.downvotes}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
