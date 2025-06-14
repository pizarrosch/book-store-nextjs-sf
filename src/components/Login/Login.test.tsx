import {configureStore} from '@reduxjs/toolkit';
import {render, screen, fireEvent} from '@testing-library/react';
import {useRouter} from 'next/navigation';
import React from 'react';
import {Provider} from 'react-redux';
import Login from './Login';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock the useDispatch hook
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn().mockReturnValue(jest.fn())
}));

// Mock fetch
global.fetch = jest.fn();

describe('Login', () => {
  const mockSetShowLogin = jest.fn();

  // Mock Redux store
  const mockStore = configureStore({
    reducer: {
      userCredentials: () => ({
        isAuthenticated: false,
        name: '',
        email: ''
      })
    }
  });

  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        name: 'Test User',
        email: 'test@example.com',
        token: 'mock-token'
      })
    });
  });

  it('renders the login form', () => {
    render(
      <Provider store={mockStore}>
        <Login setShowLogin={mockSetShowLogin} />
      </Provider>
    );

    expect(screen.getByRole('heading', {name: 'Log in'})).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Log in'})).toBeInTheDocument();
  });

  it('validates email input', () => {
    render(
      <Provider store={mockStore}>
        <Login setShowLogin={mockSetShowLogin} />
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');

    // Enter invalid email
    fireEvent.change(emailInput, {target: {value: 'invalid-email'}});
    fireEvent.blur(emailInput);

    // Check for validation error
    expect(screen.getByText('Your email must contain @')).toBeInTheDocument();

    // Enter valid email
    fireEvent.change(emailInput, {target: {value: 'valid@example.com'}});
    fireEvent.blur(emailInput);

    // Error message should be gone
    expect(
      screen.queryByText('Your email must contain @')
    ).not.toBeInTheDocument();
  });

  it('validates password input', () => {
    render(
      <Provider store={mockStore}>
        <Login setShowLogin={mockSetShowLogin} />
      </Provider>
    );

    const passwordInput = screen.getByLabelText('Password');

    // Enter short password
    fireEvent.change(passwordInput, {target: {value: '12345'}});
    fireEvent.blur(passwordInput);

    // Check for validation error
    expect(
      screen.getByText('Your password must be at least 6 characters long')
    ).toBeInTheDocument();

    // Enter valid password
    fireEvent.change(passwordInput, {target: {value: '123456'}});
    fireEvent.blur(passwordInput);

    // Error message should be gone
    expect(
      screen.queryByText('Your password must be at least 6 characters long')
    ).not.toBeInTheDocument();
  });

  it('submits the form with valid credentials', async () => {
    render(
      <Provider store={mockStore}>
        <Login setShowLogin={mockSetShowLogin} />
      </Provider>
    );

    // Fill in valid credentials
    fireEvent.change(screen.getByLabelText('Email'), {
      target: {value: 'test@example.com'}
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: {value: 'password123'}
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', {name: 'Log in'}));

    // Check that fetch was called with the right arguments
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: expect.any(String)
      })
    );
  });
});
