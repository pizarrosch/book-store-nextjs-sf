import {render, screen, fireEvent} from '@testing-library/react';
import React from 'react';
import BookDetails from './BookDetails';
import {bookData} from './Books';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  }
}));

describe('BookDetails', () => {
  const mockBook: bookData = {
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

  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders book details correctly', () => {
    render(
      <BookDetails {...mockBook} onClick={mockOnClick} buyIndex={undefined} />
    );

    expect(screen.getByText('Author Name')).toBeInTheDocument();
    expect(screen.getByText('Book Title')).toBeInTheDocument();
    expect(screen.getByText('Book description')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('100 reviews')).toBeInTheDocument();
    expect(screen.getByText('Add to cart')).toBeInTheDocument();
  });

  it('displays "review" singular when there is only one review', () => {
    const bookWithOneReview = {
      ...mockBook,
      volumeInfo: {
        ...mockBook.volumeInfo,
        ratingsCount: 1
      }
    };

    render(
      <BookDetails
        {...bookWithOneReview}
        onClick={mockOnClick}
        buyIndex={undefined}
      />
    );

    expect(screen.getByText('1 review')).toBeInTheDocument();
  });

  it('displays "N/A" when there are no reviews', () => {
    const bookWithNoReviews = {
      ...mockBook,
      volumeInfo: {
        ...mockBook.volumeInfo,
        ratingsCount: 0
      }
    };

    render(
      <BookDetails
        {...bookWithNoReviews}
        onClick={mockOnClick}
        buyIndex={undefined}
      />
    );

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('calls onClick when the Add to cart button is clicked', () => {
    render(
      <BookDetails {...mockBook} onClick={mockOnClick} buyIndex={undefined} />
    );

    const button = screen.getByText('Add to cart');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays "out of stock" when no price is available', () => {
    const bookWithoutPrice = {
      ...mockBook,
      saleInfo: {}
    };

    render(
      <BookDetails
        {...bookWithoutPrice}
        onClick={mockOnClick}
        buyIndex={undefined}
      />
    );

    expect(screen.getByText('out of stock')).toBeInTheDocument();
  });
});
