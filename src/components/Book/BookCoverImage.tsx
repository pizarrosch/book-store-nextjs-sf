import Image from 'next/image';
import React from 'react';
import {bookData} from '@/components/Book/Books';
import noCoverBook from '../../../public/assets/no-cover.jpg';
import s from './BookCoverImage.module.scss';

export default function BookCoverImage(data: bookData) {
  return (
    <Image
      src={
        data.volumeInfo?.imageLinks
          ? data.volumeInfo.imageLinks.thumbnail
          : noCoverBook
      }
      alt="book-cover"
      className={s.bookCover}
      width={212}
      height={287}
    />
  );
}
