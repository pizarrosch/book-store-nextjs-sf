import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useAppSelector} from '@/pages/hooks';
import shopBag from '../../../public/assets/shop-bag.svg';
import user from '../../../public/assets/user.svg';
import s from './Navigation.module.scss';

type TShowLogin = {
  handleShowLogin: () => void;
};

export default function Navigation({handleShowLogin}: TShowLogin) {
  const cart = useAppSelector((state) => state.cart);
  const router = useRouter();

  return (
    <div className={s.root}>
      <nav aria-label="Main navigation">
        <ul className={s.nav}>
          <li>
            <Link href="/" aria-label="Browse books">
              Books
            </Link>
          </li>
          <li>
            <Link href="/" aria-label="Browse audiobooks">
              Audiobooks
            </Link>
          </li>
          <li>
            <Link href="/" aria-label="Browse stationery and gifts">
              Stationery & gifts
            </Link>
          </li>
          <li>
            <Link href="/" aria-label="Read our blog">
              Blog
            </Link>
          </li>
        </ul>
      </nav>
      <div className={s.accountActionsMenu} role="toolbar" aria-label="Account actions">
        <button
          onClick={handleShowLogin}
          aria-label="User account"
          className={s.iconButton}
        >
          <Image src={user} alt="" width={24} height={24} />
        </button>
        <Link href={'/cart'} aria-label={`Shopping cart with ${cart.length} item${cart.length !== 1 ? 's' : ''}`}>
          <Image src={shopBag} alt="" width={24} height={24} />
        </Link>
        {cart.length > 0 && (
          <div
            className={s.itemsNumber}
            onClick={() => router.push('/cart')}
            role="status"
            aria-label={`${cart.length} item${cart.length !== 1 ? 's' : ''} in cart`}
          >
            {cart.length}
          </div>
        )}
      </div>
    </div>
  );
}
