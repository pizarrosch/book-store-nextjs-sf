import {Icon} from '@blueprintjs/core';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '@/pages/hooks';
import {setShowLogin} from '@/reducer';
import s from './Navigation.module.scss';

export default function Navigation() {
  const cart = useAppSelector((state) => state.cart);
  const userData = useAppSelector((state) => state.userCredentials);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    {name: 'Books', href: '/'},
    {name: 'Audiobooks', href: '/audiobooks'},
    {name: 'Stationery & gifts', href: '/stationery'},
    {name: 'Blog', href: '/blog'}
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
    if (userData.isAuthenticated) {
      router.push('/profile');
    } else {
      dispatch(setShowLogin(true));
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
            <Icon icon="search" size={18} />
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
          {userData.isAuthenticated ? (
            <div
              className={s.userProfile}
              onClick={handleUserClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleUserClick()}
              aria-label={`Profile: ${userData.name}`}
            >
              <div className={s.userIconWrapper}>
                {userData.isAuthenticated && userData.profilePicture ? (
                  <img
                    src={userData.profilePicture}
                    alt="Profile"
                    className={s.userIconWrapper}
                  />
                ) : (
                  <Icon icon="user" size={18} />
                )}
              </div>
              <span className={s.userName}>{userData.name.split(' ')[0]}</span>
            </div>
          ) : (
            <button
              onClick={handleUserClick}
              aria-label="User account"
              className={s.iconButton}
            >
              <Icon icon="log-in" size={20} />
            </button>
          )}

          <Link
            href="/cart"
            className={s.iconButton}
            aria-label={`Shopping cart with ${cart.length} item${cart.length !== 1 ? 's' : ''}`}
          >
            <Icon icon="shopping-cart" size={20} />
            {cart.length > 0 && (
              <span className={s.badge} role="status">
                {cart.length}
              </span>
            )}
          </Link>

          <button
            className={s.mobileMenuButton}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <Icon icon={isMenuOpen ? 'cross' : 'menu'} size={20} />
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
