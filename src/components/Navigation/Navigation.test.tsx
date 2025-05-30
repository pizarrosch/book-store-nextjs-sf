import {render, screen, fireEvent} from '@testing-library/react';
import {useRouter} from 'next/navigation';
import React from 'react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import Navigation from './Navigation';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return (
      <a href={href} data-testid="link-mock">
        {children}
      </a>
    );
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('Navigation', () => {
  const mockHandleShowLogin = jest.fn();
  const mockRouter = {
    push: jest.fn()
  };

  // Mock Redux store for authenticated user
  const authenticatedStore = configureStore({
    reducer: {
      userCredentials: () => ({
        isAuthenticated: true,
        name: 'Test User',
        email: 'test@example.com'
      }),
      cart: () => []
    }
  });

  // Mock Redux store for unauthenticated user
  const unauthenticatedStore = configureStore({
    reducer: {
      userCredentials: () => ({
        isAuthenticated: false,
        name: '',
        email: ''
      }),
      cart: () => []
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders navigation links', () => {
    render(
      <Provider store={unauthenticatedStore}>
        <Navigation handleShowLogin={mockHandleShowLogin} />
      </Provider>
    );

    const links = screen.getAllByTestId('link-mock');
    expect(links.length).toBeGreaterThan(0);

    // Check for specific links
    const booksLink = screen.getByText('Books');
    expect(booksLink).toBeInTheDocument();
  });

  it('has a user icon that can be clicked to show login', () => {
    render(
      <Provider store={unauthenticatedStore}>
        <Navigation handleShowLogin={mockHandleShowLogin} />
      </Provider>
    );

    const userIcon = screen.getByAltText('user');
    expect(userIcon).toBeInTheDocument();

    // Click the user icon
    fireEvent.click(userIcon);
    expect(mockHandleShowLogin).toHaveBeenCalledTimes(1);
  });

  it('has a shopping bag icon for the cart', () => {
    render(
      <Provider store={authenticatedStore}>
        <Navigation handleShowLogin={mockHandleShowLogin} />
      </Provider>
    );

    const bagIcon = screen.getByAltText('bag');
    expect(bagIcon).toBeInTheDocument();
  });
});
