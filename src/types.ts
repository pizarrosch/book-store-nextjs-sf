import React from 'react';
import {bookData} from '@/components/Book/Books';
import {TClicked} from '@/reducer';

export type BookDetailsProps = bookData & {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  buyIndex: TClicked | undefined;
};
