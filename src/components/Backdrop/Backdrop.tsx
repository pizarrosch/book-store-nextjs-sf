import s from './Backdrop.module.scss';

export default function Backdrop() {
  return (
    <div className={s.backdrop} data-testid="backdrop">
      <div className={s.spinner} data-testid="spinner">
        <h2>No books available for this category. Please try later.</h2>
      </div>
    </div>
  );
}
