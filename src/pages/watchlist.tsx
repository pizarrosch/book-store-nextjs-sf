import {Icon} from '@blueprintjs/core';
import Link from 'next/link';
import {useDispatch} from 'react-redux';
import Layout from '@/components/Layout/Layout';
import {useAppSelector} from '@/pages/hooks';
import {addCartItem, removeWatchlistItem, setShowLogin} from '@/reducer';
import s from '../styles/watchlist.module.scss';

export default function Watchlist() {
  const dispatch = useDispatch();
  const watchlist = useAppSelector((state) => state.watchlist);
  const cart = useAppSelector((state) => state.cart);
  const userData = useAppSelector((state) => state.userCredentials);

  const handleRemove = async (bookId: string) => {
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
  };

  const handleMoveToCart = async (bookId: string) => {
    const item = watchlist.find((w) => w.id === bookId);
    if (!item) return;

    const isInCart = cart.some((c) => c.id === bookId);
    if (!isInCart) {
      dispatch(addCartItem({number: 1, id: bookId, book: item.book}));
    }

    await handleRemove(bookId);
  };

  return (
    <Layout>
      <div className={s.pageContainer}>
        <h1 className={s.title}>My Watchlist</h1>

        {!userData.isAuthenticated && watchlist.length > 0 && (
          <div className={s.loginBanner}>
            <Icon icon="info-sign" size={16} />
            <span>
              Log in to save your watchlist permanently.{' '}
              <button
                className={s.loginLink}
                onClick={() => dispatch(setShowLogin(true))}
              >
                Log in
              </button>
            </span>
          </div>
        )}

        {watchlist.length === 0 ? (
          <div className={s.emptyState}>
            <Icon icon="bookmark" size={48} className={s.emptyIcon} />
            <h2 className={s.emptyTitle}>Your watchlist is empty</h2>
            <p className={s.emptyText}>
              Save books you want to read later by clicking the bookmark icon on
              any book.
            </p>
            <Link href="/" className={s.browseLink}>
              Browse Books
            </Link>
          </div>
        ) : (
          <div className={s.grid}>
            {watchlist.map((item) => {
              const isInCart = cart.some((c) => c.id === item.id);
              const thumbnail = item.book.volumeInfo?.imageLinks?.thumbnail;

              return (
                <div key={item.id} className={s.card}>
                  <div className={s.cover}>
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={item.book.volumeInfo?.title}
                        className={s.coverImage}
                      />
                    ) : (
                      <div className={s.coverPlaceholder}>
                        <Icon icon="book" size={32} />
                      </div>
                    )}
                  </div>

                  <div className={s.info}>
                    <span className={s.author}>
                      {item.book.volumeInfo?.authors?.join(', ') ||
                        'Unknown Author'}
                    </span>
                    <h3 className={s.bookTitle}>
                      {item.book.volumeInfo?.title}
                    </h3>
                    <span className={s.price}>
                      {item.book.saleInfo?.listPrice
                        ? `€${item.book.saleInfo.listPrice.amount.toFixed(2)}`
                        : 'Out of stock'}
                    </span>
                  </div>

                  <div className={s.actions}>
                    <button
                      className={s.cartButton}
                      onClick={() => handleMoveToCart(item.id)}
                      disabled={isInCart}
                    >
                      {isInCart ? 'In Cart' : 'Move to Cart'}
                    </button>
                    <button
                      className={s.removeButton}
                      onClick={() => handleRemove(item.id)}
                      aria-label="Remove from watchlist"
                    >
                      <Icon icon="trash" size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
