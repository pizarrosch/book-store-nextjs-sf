import {render, screen} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import MainContent from './MainContent';

// Mock the Books component
jest.mock('@/components/Book/Books', () => {
  return function MockBooks(props: any) {
    return (
      <div data-testid="books-mock" data-category={props.category}>
        Books Component
      </div>
    );
  };
});

describe('MainContent', () => {
  // Mock Redux store
  const mockStore = configureStore({
    reducer: {
      category: () => 'architecture'
    }
  });

  it('renders the main content with categories', () => {
    render(
      <Provider store={mockStore}>
        <MainContent />
      </Provider>
    );

    // Check for category headings
    expect(screen.getByText('Architecture')).toBeInTheDocument();
    expect(screen.getByText('Art & Fashion')).toBeInTheDocument();
    expect(screen.getByText('Biography')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
    
    // Check that Books component is rendered with the correct category
    const booksComponent = screen.getByTestId('books-mock');
    expect(booksComponent).toBeInTheDocument();
    expect(booksComponent).toHaveAttribute('data-category', 'architecture');
  });

  it('renders the correct number of categories', () => {
    render(
      <Provider store={mockStore}>
        <MainContent />
      </Provider>
    );

    // There should be 6 categories
    const categories = screen.getAllByRole('heading', {level: 2});
    expect(categories).toHaveLength(6);
  });
});