import {render, screen} from '@testing-library/react';
import React from 'react';
import BookCoverImage from './BookCoverImage';
import {bookData} from './Books';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  }
}));

describe('BookCoverImage', () => {
  const mockBookWithImage: bookData = {
    id: 1,
    volumeInfo: {
      imageLinks: {
        thumbnail: 'https://example.com/image.jpg'
      },
      authors: ['Author Name'],
      title: 'Book Title',
      averageRating: 4,
      ratingsCount: 100,
      description: 'Book description'
    },
    saleInfo: {
      listPrice: {
        amount: 9.99
      }
    }
  };

  const mockBookWithoutImage: bookData = {
    id: 2,
    volumeInfo: {
      authors: ['Author Name'],
      title: 'Book Title',
      averageRating: 4,
      ratingsCount: 100,
      description: 'Book description'
    },
    saleInfo: {
      listPrice: {
        amount: 9.99
      }
    }
  };

  it('renders the book cover image when imageLinks are provided', () => {
    render(<BookCoverImage {...mockBookWithImage} />);

    const image = screen.getByAltText('book-cover');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('width', '212');
    expect(image).toHaveAttribute('height', '287');
  });

  it('renders the fallback image when imageLinks are not provided', () => {
    render(<BookCoverImage {...mockBookWithoutImage} />);

    const image = screen.getByAltText('book-cover');
    expect(image).toBeInTheDocument();
    // We can't check the exact src because it's a dynamic import
    // But we can check that it's not undefined
    expect(image).toHaveAttribute('src');
  });
});
