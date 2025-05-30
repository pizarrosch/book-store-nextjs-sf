import {render, screen} from '@testing-library/react';
import React from 'react';
import Layout from './Layout';

// Mock the Navigation component
jest.mock('@/components/Navigation/Navigation', () => {
  return function MockNavigation() {
    return <div data-testid="navigation-mock">Navigation Mock</div>;
  };
});

// Mock the next/head component
jest.mock('next/head', () => {
  return function MockHead({children}: {children: React.ReactNode}) {
    return <div data-testid="head-mock">{children}</div>;
  };
});

// Mock the next/link component
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

describe('Layout', () => {
  const handleShowLoginMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with a link to the homepage', () => {
    render(
      <Layout handleShowLogin={handleShowLoginMock}>
        <div>Test Content</div>
      </Layout>
    );

    const link = screen.getByTestId('link-mock');
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveTextContent('Bookshop');
  });

  it('renders the navigation component', () => {
    render(
      <Layout handleShowLogin={handleShowLoginMock}>
        <div>Test Content</div>
      </Layout>
    );

    const navigation = screen.getByTestId('navigation-mock');
    expect(navigation).toBeInTheDocument();
  });

  it('renders the children content', () => {
    render(
      <Layout handleShowLogin={handleShowLoginMock}>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );

    const content = screen.getByTestId('test-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Test Content');
  });
});