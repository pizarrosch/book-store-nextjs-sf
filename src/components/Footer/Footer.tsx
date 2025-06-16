import Image from 'next/image';
import applepay from '../../../public/assets/footer_images/applepay.png';
import gpay from '../../../public/assets/footer_images/gpay.png';
import mastercard from '../../../public/assets/footer_images/mastercard.png';
import paypal from '../../../public/assets/footer_images/paypal.png';
import visa from '../../../public/assets/footer_images/visa.png';

export default function Footer() {
  return (
    <div>
      <div>
        <span>Free returns</span>
        <span>In-store pickup</span>
      </div>
      <div>
        <Image src={visa} alt="visa" />
        <Image src={mastercard} alt="mastercard" />
        <Image src={gpay} alt="gpay" />
        <Image src={applepay} alt="applepay" />
        <Image src={paypal} alt="paypal" />
      </div>
    </div>
  );
}
