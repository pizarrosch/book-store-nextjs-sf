import s from './Header.module.scss';
import Image from "next/image";
import user from '../../../public/assets/user.svg';
import shopBag from '../../../public/assets/shop-bag.svg';

function Header() {
  return (
    <div className={s.header}>
      <div className={s.header_contentWrapper}>
        <h2>Bookshop</h2>
        <nav className={s.nav}>
          <a href="#">Books</a>
          <a href="#">Audiobooks</a>
          <a href="#">Stationery & gifts</a>
          <a href="#">Blog</a>
        </nav>
        <div className={s.accountActionsMenu}>
          <Image src={user} alt={'user'} />
          <Image src={shopBag} alt={'bag'} />
          <div className={s.itemsNumber}>1</div>
        </div>
      </div>
    </div>
  )
}

export default Header;