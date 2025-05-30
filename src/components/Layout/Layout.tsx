import Head from 'next/head';
import Link from 'next/link';
import {PropsWithChildren} from 'react';
import Navigation from '@/components/Navigation/Navigation';
import s from './Layout.module.scss';

type Props = {
  handleShowLogin: () => void;
} & PropsWithChildren;

export default function Layout({children, handleShowLogin}: Props) {
  return (
    <>
      <Head>
        <title>Book Store</title>
        <meta name="description" content="SkillFactory Next.js project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Montserrat:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <header className={s.header}>
        <Link href="/">
          <h2>Bookshop</h2>
        </Link>
        <Navigation handleShowLogin={handleShowLogin} />
      </header>
      <main className={s.mainContainer}>{children}</main>
    </>
  );
}