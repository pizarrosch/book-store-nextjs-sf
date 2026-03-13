import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useState} from 'react';
import {useAppSelector} from '@/pages/hooks';
import shopBag from '../../../public/assets/shop-bag.svg';
import user from '../../../public/assets/user.svg';
import s from './Navigation.module.scss';

type TShowLogin = {
  handleShowLogin: () => void;
};

// Simple icon components to avoid adding new dependencies if possible, 
// or we can use the ones already in public/assets
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function Navigation({handleShowLogin}: TShowLogin) {
  const cart = useAppSelector((state) => state.cart);
  const userCredentials = useAppSelector((state) => state.userCredentials);
  const router = useRouter();
  const pathname = usePathname();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Books', href: '/' },
    { name: 'Audiobooks', href: '/audiobooks' },
    { name: 'Stationery & gifts', href: '/stationery' },
    { name: 'Blog', href: '/blog' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // For now just log or alert, since we don't have a search page yet
      console.log('Searching for:', searchQuery);
      // router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleUserClick = () => {
    if (userCredentials.isAuthenticated) {
      router.push('/profile');
    } else {
      handleShowLogin();
    }
  };

  return (
    <>
      <div className={s.root}>
        <nav aria-label="Main navigation">
          <ul className={s.nav}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href} 
                  className={pathname === link.href ? s.active : ''}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <form className={s.searchContainer} onSubmit={handleSearch}>
          <span className={s.searchIcon}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search for books, authors..."
            className={s.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className={s.actions} role="toolbar" aria-label="Account actions">
          <button
            onClick={handleUserClick}
            aria-label={userCredentials.isAuthenticated ? `Profile: ${userCredentials.name}` : "User account"}
            className={s.iconButton}
          >
            {userCredentials.isAuthenticated ? (
              <div className={s.userProfile}>
                <div className={s.userIconWrapper}>
                  <Image src={user} alt="" width={24} height={24} />
                </div>
                <span className={s.userName}>{userCredentials.name.split(' ')[0]}</span>
              </div>
            ) : (
              <Image src={user} alt="" width={24} height={24} />
            )}
          </button>

          <Link 
            href="/cart" 
            className={s.iconButton}
            aria-label={`Shopping cart with ${cart.length} item${cart.length !== 1 ? 's' : ''}`}
          >
            <Image src={shopBag} alt="" width={24} height={24} />
            {cart.length > 0 && (
              <span className={s.badge} role="status">
                {cart.length}
              </span>
            )}
          </Link>

          <button 
            className={s.mobileMenuButton} 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className={s.mobileMenu}>
          <nav className={s.mobileNav}>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={pathname === link.href ? s.active : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <form className={s.mobileSearch} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              className={s.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      )}
    </>
  );
}
