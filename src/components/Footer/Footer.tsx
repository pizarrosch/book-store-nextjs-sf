import Image from 'next/image';
import applepay from '../../../public/assets/footer_images/applepay.png';
import gpay from '../../../public/assets/footer_images/gpay.png';
import mastercard from '../../../public/assets/footer_images/mastercard.png';
import paypal from '../../../public/assets/footer_images/paypal.png';
import visa from '../../../public/assets/footer_images/visa.png';
import s from './Footer.module.scss';

export default function Footer() {
  return (
    <div className={s.root}>
      <div className={s['options-container']}>
        <span>&#10003; Free returns</span>
        <span>&#10003; In-store pickup</span>
      </div>
      <div className={s['payment-container']}>
        <Image src={visa} alt="visa" />
        <Image src={mastercard} alt="mastercard" />
        <Image src={gpay} alt="gpay" />
        <Image src={applepay} alt="applepay" />
        <Image src={paypal} alt="paypal" />
      </div>
    </div>
  );
}
