import classNames from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import {PropsWithChildren, useEffect, useState} from 'react';
import Footer from '@/components/Footer/Footer';
import Login from '@/components/Login/Login';
import Navigation from '@/components/Navigation/Navigation';
import {useAppSelector} from '@/pages/hooks';
import s from './Layout.module.scss';

export default function Layout({children}: PropsWithChildren) {
  const [isScrolled, setIsScrolled] = useState(false);
  const showLogin = useAppSelector((state) => state.userCredentials.showLogin);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Bookshop - Discover Your Next Great Read</title>
        <meta
          name="description"
          content="Browse our extensive collection of books across 15 categories. Find your next favorite book with free returns and in-store pickup."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Montserrat:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <header
        className={classNames(s.header, {[s.scrolled]: isScrolled})}
        role="banner"
      >
        <Link href="/" className={s.logo} aria-label="Bookshop home page">
          <h2>Bookshop</h2>
        </Link>
        <Navigation />
      </header>
      {showLogin && <Login />}
      <main className={s.mainContainer} id="main-content" role="main">
        {children}
      </main>
      <Footer />
    </>
  );
}
