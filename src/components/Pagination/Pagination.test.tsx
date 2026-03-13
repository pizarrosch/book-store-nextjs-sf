import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  const onPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render if totalPages is 1 or less', () => {
    const {container} = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={onPageChange} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render correct number of page buttons', () => {
    const {getByText, getAllByRole} = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );
    
    // Previous and Next buttons are also buttons
    const buttons = getAllByRole('button');
    // Prev, 1, 2, 3, 4, 5, Next = 7 buttons
    expect(buttons.length).toBe(7);
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
  });

  it('should call onPageChange when a page number is clicked', () => {
    const {getByText} = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );
    
    fireEvent.click(getByText('3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('should call onPageChange with currentPage + 1 when Next is clicked', () => {
    const {getByLabelText} = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );
    
    fireEvent.click(getByLabelText('Next page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange with currentPage - 1 when Previous is clicked', () => {
    const {getByLabelText} = render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
    );
    
    fireEvent.click(getByLabelText('Previous page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should disable Previous button on first page', () => {
    const {getByLabelText} = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );
    
    expect(getByLabelText('Previous page')).toBeDisabled();
  });

  it('should disable Next button on last page', () => {
    const {getByLabelText} = render(
      <Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />
    );
    
    expect(getByLabelText('Next page')).toBeDisabled();
  });

  it('should show ellipses for many pages', () => {
    const {getByText} = render(
      <Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />
    );
    
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('10')).toBeInTheDocument();
    const ellipses = document.querySelectorAll('span');
    expect(ellipses.length).toBeGreaterThan(0);
  });
});
