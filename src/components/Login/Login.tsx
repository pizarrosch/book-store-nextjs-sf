import {Icon} from '@blueprintjs/core';
import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {
  setName,
  setEmail,
  setAuthenticated,
  setToken,
  setShowLogin
} from '@/reducer';
import s from './Login.module.scss';

function Login() {
  const [email, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [areCredentialsCorrect, setAreCredentialsCorrect] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch(setShowLogin(false));
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [dispatch]);

  async function logIn(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (!emailIsValid || !passwordIsValid || !email || !password) {
      if (!email) setEmailIsValid(false);
      if (!password) setPasswordIsValid(false);
      return;
    }

    setIsLoading(true);
    setAreCredentialsCorrect(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setEmail(data.email));
        dispatch(setName(data.name));
        dispatch(setToken(data.token));
        dispatch(setAuthenticated(true));
        dispatch(setShowLogin(false));
      } else {
        setAreCredentialsCorrect(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setAreCredentialsCorrect(false);
    } finally {
      setIsLoading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setUserEmail(value);
    setAreCredentialsCorrect(true);
    if (value && !value.includes('@')) {
      setEmailIsValid(false);
    } else {
      setEmailIsValid(true);
    }
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPassword(value);
    setAreCredentialsCorrect(true);
    if (value && value.length < 6) {
      setPasswordIsValid(false);
    } else {
      setPasswordIsValid(true);
    }
  }

  const handleClose = () => {
    dispatch(setShowLogin(false));
  };

  return (
    <div className={s.modalOverlay} onClick={handleClose}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={s.closeButton}
          onClick={handleClose}
          aria-label="Close login modal"
        >
          <Icon icon="cross" size={20} />
        </button>

        <div className={s.header}>
          <h2 className={s.title}>Welcome Back</h2>
          <p className={s.subtitle}>Log in to access your account</p>
        </div>

        <form className={s.form} onSubmit={logIn}>
          <div className={s.inputGroup}>
            <label htmlFor="email" className={s.label}>
              Email Address
            </label>
            <div className={s.inputWrapper}>
              <Icon icon="envelope" className={s.inputIcon} />
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className={`${s.input} ${!emailIsValid ? s.invalid : ''}`}
                value={email}
                onChange={handleInputChange}
                autoFocus
              />
            </div>
            {!emailIsValid && (
              <span className={s.errorText}>
                Please enter a valid email address
              </span>
            )}
          </div>

          <div className={s.inputGroup}>
            <label htmlFor="password" className={s.label}>
              Password
            </label>
            <div className={s.inputWrapper}>
              <Icon icon="lock" className={s.inputIcon} />
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className={`${s.input} ${!passwordIsValid || !areCredentialsCorrect ? s.invalid : ''}`}
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            {!passwordIsValid && (
              <span className={s.errorText}>
                Password must be at least 6 characters long
              </span>
            )}
            {!areCredentialsCorrect && (
              <span className={s.errorText}>Invalid email or password</span>
            )}
          </div>

          <div className={s.forgotPassword}>
            <a href="#">Forgot password?</a>
          </div>

          <button
            type="submit"
            className={s.loginButton}
            disabled={
              isLoading ||
              !email ||
              !password ||
              !emailIsValid ||
              !passwordIsValid
            }
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className={s.footer}>
          <p>
            Don&apos;t have an account? <a href="#">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
