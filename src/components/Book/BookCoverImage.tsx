import Image from 'next/image';
import React from 'react';
import {bookData} from '@/components/Book/Books';
import noCoverBook from '../../../public/assets/no-cover.jpg';
import s from './BookCoverImage.module.scss';

export default function BookCoverImage(data: bookData) {
  const imageUrl = data.volumeInfo?.imageLinks?.thumbnail
    ? data.volumeInfo.imageLinks.thumbnail
        .replace('http:', 'https:')
        .replace('&edge=curl', '')
        .replace('zoom=1', 'zoom=2')
    : noCoverBook;

  return (
    <div className={s.coverWrapper}>
      <Image
        src={imageUrl}
        alt={data.volumeInfo?.title || 'Book cover'}
        className={s.bookCover}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={90}
      />
    </div>
  );
}
