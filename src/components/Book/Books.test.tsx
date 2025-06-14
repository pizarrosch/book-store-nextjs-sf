import {configureStore} from '@reduxjs/toolkit';
import {render, screen, fireEvent} from '@testing-library/react';
import {useRouter} from 'next/navigation';
import React from 'react';
import {Provider} from 'react-redux';
import Books from './Books';

// Mock the components used by Books
jest.mock('./BookDetails', () => {
  return function MockBookDetails(props: any) {
    return (
      <div data-testid="book-details-mock">
        <button onClick={props.onClick} data-id={props.id}>
          Add to cart
        </button>
      </div>
    );
  };
});

jest.mock('./CoverImage', () => {
  return function MockCoverImage() {
    return <div data-testid="book-cover-image-mock">Book Cover Image</div>;
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock the Backdrop component
jest.mock('@/components/Backdrop/Backdrop', () => {
  return function MockBackdrop() {
    return <div data-testid="backdrop-mock">Loading...</div>;
  };
});

// Mock fetch
global.fetch = jest.fn();

describe('Books', () => {
  const mockRouter = {
    push: jest.fn()
  };

  // Mock Redux store
  const mockStore = configureStore({
    reducer: {
      clickedItem: () => [],
      userCredentials: () => ({
        isAuthenticated: true,
        token: 'mock-token'
      })
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [
          {
            id: 1,
            volumeInfo: {
              title: 'Book 1',
              authors: ['Author 1'],
              imageLinks: {thumbnail: 'https://example.com/image1.jpg'},
              averageRating: 4,
              ratingsCount: 100
            },
            saleInfo: {
              listPrice: {amount: 9.99}
            }
          },
          {
            id: 2,
            volumeInfo: {
              title: 'Book 2',
              authors: ['Author 2'],
              imageLinks: {thumbnail: 'https://example.com/image2.jpg'},
              averageRating: 3,
              ratingsCount: 50
            },
            saleInfo: {
              listPrice: {amount: 14.99}
            }
          }
        ]
      })
    });
  });

  it('renders books when data is loaded', async () => {
    render(
      <Provider store={mockStore}>
        <Books category="fiction" maxResults={6} setMaxResults={jest.fn()} />
      </Provider>
    );

    // Initially it should show the loading state
    expect(screen.queryByTestId('backdrop-mock')).not.toBeInTheDocument();

    // After data is loaded, it should show the books
    expect(await screen.findAllByTestId('book-details-mock')).toHaveLength(2);
    expect(await screen.findAllByTestId('book-cover-image-mock')).toHaveLength(
      2
    );
  });

  it('shows loading state when there are no books', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({items: []})
    });

    render(
      <Provider store={mockStore}>
        <Books category="fiction" maxResults={6} setMaxResults={jest.fn()} />
      </Provider>
    );

    // It should show the loading state
    expect(await screen.findByTestId('backdrop-mock')).toBeInTheDocument();
  });

  it('redirects to login page when user is not authenticated', async () => {
    const unauthenticatedStore = configureStore({
      reducer: {
        clickedItem: () => [],
        userCredentials: () => ({
          isAuthenticated: false,
          token: null
        })
      }
    });

    render(
      <Provider store={unauthenticatedStore}>
        <Books category="fiction" maxResults={6} setMaxResults={jest.fn()} />
      </Provider>
    );

    // Find a book and click its "Add to cart" button
    const addToCartButtons = await screen.findAllByText('Add to cart');
    fireEvent.click(addToCartButtons[0]);

    // It should redirect to the login page
    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.stringContaining('/login')
    );
  });
});
