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
      <nav>
        <ul className={s.nav}>
          <li>
            <Link href="/">Books</Link>
          </li>
          <li>
            <Link href="/">Audiobooks</Link>
          </li>
          <li>
            <Link href="/">Stationery & gifts</Link>
          </li>
          <li>
            <Link href="/">Blog</Link>
          </li>
        </ul>
      </nav>
      <div className={s.accountActionsMenu}>
        <Image src={user} alt="user" id="user-icon" onClick={handleShowLogin} />
        <Link href={'/cart'}>
          <Image src={shopBag} alt={'bag'} />
        </Link>
        {cart.length > 0 && (
          <div className={s.itemsNumber} onClick={() => router.push('/cart')}>
            {cart.length}
          </div>
        )}
      </div>
    </div>
  );
}
