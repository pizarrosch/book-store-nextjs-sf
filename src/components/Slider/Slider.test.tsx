import {render, screen} from '@testing-library/react';
import React from 'react';
import Slider from './Slider';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  }
}));

describe('Slider', () => {
  it('renders the slider with dots', () => {
    render(<Slider />);

    // Check for slider dots
    const dots = screen.getAllByRole('button');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('renders the slider with images', () => {
    render(<Slider />);

    // Check for slider images
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders the slider with the correct title', () => {
    render(<Slider />);

    // Check for slider title
    const title = screen.getByText(/change the world/i);
    expect(title).toBeInTheDocument();
  });
});
