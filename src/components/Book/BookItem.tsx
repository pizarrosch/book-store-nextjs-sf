import Image from 'next/image';
import React from 'react';
import {bookData} from '@/components/Book/Books';

type BookItemProps = {
  book: bookData;
};

export default function BookItem({book}: BookItemProps) {
  const {volumeInfo, saleInfo} = book;

  return (
    <div>
      {volumeInfo.imageLinks?.thumbnail && (
        <Image
          src={volumeInfo.imageLinks.thumbnail}
          alt={volumeInfo.title}
          width={200}
          height={300}
        />
      )}
      <h1>{volumeInfo.title}</h1>
      <p>{volumeInfo.authors?.join(', ')}</p>
      <p>{volumeInfo.description}</p>
      <span>
        {saleInfo?.listPrice ? `$${saleInfo.listPrice.amount}` : 'Out of stock'}
      </span>
    </div>
  );
}
