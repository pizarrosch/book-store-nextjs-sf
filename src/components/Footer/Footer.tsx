import Image from 'next/image';
import applepay from '../../../public/assets/footer_images/applepay.png';
import gpay from '../../../public/assets/footer_images/gpay.png';
import mastercard from '../../../public/assets/footer_images/mastercard.png';
import paypal from '../../../public/assets/footer_images/paypal.png';
import visa from '../../../public/assets/footer_images/visa.png';
import s from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={s.root} role="contentinfo">
      <div className={s['options-container']} role="list">
        <div className={s.option} role="listitem">
          <span className={s.checkmark} aria-hidden="true">
            ✓
          </span>
          <span>Free returns</span>
        </div>
        <div className={s.option} role="listitem">
          <span className={s.checkmark} aria-hidden="true">
            ✓
          </span>
          <span>In-store pickup</span>
        </div>
      </div>
      <div
        className={s['payment-container']}
        role="list"
        aria-label="Accepted payment methods"
      >
        <Image src={visa} alt="Visa" width={50} height={32} />
        <Image src={mastercard} alt="Mastercard" width={50} height={32} />
        <Image src={gpay} alt="Google Pay" width={50} height={32} />
        <Image src={applepay} alt="Apple Pay" width={50} height={32} />
        <Image src={paypal} alt="PayPal" width={50} height={32} />
      </div>
    </footer>
  );
}
