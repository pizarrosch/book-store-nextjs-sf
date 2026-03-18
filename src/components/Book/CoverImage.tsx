import Image from 'next/image';
import React from 'react';
import {bookData} from '@/components/Book/Books';
import noCoverBook from '../../../public/assets/no-cover.jpg';
import s from './BookCoverImage.module.scss';

export default function CoverImage(data: bookData) {
  // Priority: custom cover > Google thumbnail > fallback image
  const customCover = data.volumeInfo?.imageLinks?.customCover;
  const googleThumbnail = data.volumeInfo?.imageLinks?.thumbnail;

  // Use custom cover if available
  if (customCover) {
    return (
      <div className={s.coverWrapper}>
        <Image
          src={customCover}
          alt={data.volumeInfo?.title || 'Book cover'}
          className={s.bookCover}
          width={200}
          height={300}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={90}
        />
      </div>
    );
  }

  // Use Google thumbnail or fallback
  const imageUrl = googleThumbnail
    ? googleThumbnail
        .replace('http:', 'https:')
        .replace('&edge=curl', '')
        .replace(/zoom=\d+/, 'zoom=3')
    : noCoverBook;

  return (
    <div className={s.coverWrapper}>
      <Image
        src={imageUrl}
        alt={data.volumeInfo?.title || 'Book cover'}
        className={s.bookCover}
        width={200}
        height={300}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={90}
      />
    </div>
  );
}
