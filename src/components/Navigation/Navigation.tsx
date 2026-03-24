import {Icon} from '@blueprintjs/core';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '@/pages/hooks';
import {setShowLogin} from '@/reducer';
import s from './Navigation.module.scss';

type SearchResult = {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    imageLinks: {
      thumbnail: string | null;
      customCover: string | null;
    };
  };
  saleInfo: {
    listPrice: {
      amount: number;
    };
  };
};

export default function Navigation() {
  const cart = useAppSelector((state) => state.cart);
  const userData = useAppSelector((state) => state.userCredentials);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const mobileSearchRef = useRef<HTMLFormElement>(null);

  const navLinks = [
    {name: 'Books', href: '/'},
    {name: 'Coupons', href: '/coupons'},
    {name: 'Watchlist', href: '/watchlist'}
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`)
          .then((res) => res.json())
          .then((data) => {
            setSearchResults(data.items || []);
            setHasSearched(true);
            setShowDropdown(true);
          })
          .catch(() => {
            setSearchResults([]);
            setHasSearched(true);
          })
          .finally(() => setIsSearching(false));
      } else {
        setSearchResults([]);
        setShowDropdown(false);
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleResultClick = (id: string) => {
    setShowDropdown(false);
    setSearchQuery('');
    router.push(`/books/${id}`);
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

        <form
          className={s.searchContainer}
          onSubmit={handleSearch}
          ref={searchRef}
        >
          <span className={s.searchIcon}>
            <Icon icon="search" size={18} />
          </span>
          <input
            type="text"
            placeholder="Search for books, authors..."
            className={s.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => hasSearched && setShowDropdown(true)}
          />
          {showDropdown && (
            <div className={s.searchDropdown}>
              {isSearching ? (
                <div className={s.searchMessage}>Searching...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((book) => (
                  <div
                    key={book.id}
                    className={s.searchResultItem}
                    onClick={() => handleResultClick(book.id)}
                  >
                    {book.volumeInfo.imageLinks.thumbnail && (
                      <img
                        src={book.volumeInfo.imageLinks.thumbnail}
                        alt={book.volumeInfo.title}
                        className={s.searchResultImage}
                      />
                    )}
                    <div className={s.searchResultInfo}>
                      <span className={s.searchResultTitle}>
                        {book.volumeInfo.title}
                      </span>
                      <span className={s.searchResultAuthor}>
                        {book.volumeInfo.authors.join(', ')}
                      </span>
                    </div>
                    <span className={s.searchResultPrice}>
                      ${book.saleInfo.listPrice.amount.toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <div className={s.searchMessage}>Book not found</div>
              )}
            </div>
          )}
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
          <form
            className={s.mobileSearch}
            onSubmit={handleSearch}
            ref={mobileSearchRef}
          >
            <input
              type="text"
              placeholder="Search..."
              className={s.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => hasSearched && setShowDropdown(true)}
            />
            {showDropdown && (
              <div className={s.searchDropdown}>
                {isSearching ? (
                  <div className={s.searchMessage}>Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((book) => (
                    <div
                      key={book.id}
                      className={s.searchResultItem}
                      onClick={() => {
                        handleResultClick(book.id);
                        setIsMenuOpen(false);
                      }}
                    >
                      {book.volumeInfo.imageLinks.thumbnail && (
                        <img
                          src={book.volumeInfo.imageLinks.thumbnail}
                          alt={book.volumeInfo.title}
                          className={s.searchResultImage}
                        />
                      )}
                      <div className={s.searchResultInfo}>
                        <span className={s.searchResultTitle}>
                          {book.volumeInfo.title}
                        </span>
                        <span className={s.searchResultAuthor}>
                          {book.volumeInfo.authors.join(', ')}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={s.searchMessage}>Book not found</div>
                )}
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
}
