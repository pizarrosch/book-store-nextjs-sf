import {render, screen} from '@testing-library/react';
import React from 'react';
import Backdrop from './Backdrop';

describe('Backdrop', () => {
  it('renders the backdrop with the correct class', () => {
    render(<Backdrop />);

    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveClass('backdrop');
  });

  it('renders the spinner with the correct class', () => {
    render(<Backdrop />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner');
  });
});
