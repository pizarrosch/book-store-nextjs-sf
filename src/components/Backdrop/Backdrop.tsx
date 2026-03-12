import s from './Backdrop.module.scss';

type BackdropProps = {
  type?: 'loading' | 'empty';
  message?: string;
};

export default function Backdrop({
  type = 'empty',
  message
}: BackdropProps = {}) {
  const defaultMessage =
    type === 'loading'
      ? 'Loading books...'
      : 'No books available for this category. Please try later.';

  return (
    <div className={s.backdrop} data-testid="backdrop" role="status" aria-live="polite">
      <div className={s.content} data-testid="spinner">
        {type === 'loading' ? (
          <>
            <div className={s.spinner} aria-label="Loading"></div>
            <h2 className={s.message}>{message || defaultMessage}</h2>
          </>
        ) : (
          <>
            <div className={s.emptyIcon} aria-hidden="true">
              📚
            </div>
            <h2 className={s.message}>{message || defaultMessage}</h2>
            <p className={s.subMessage}>Try selecting a different category</p>
          </>
        )}
      </div>
    </div>
  );
}
