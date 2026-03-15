import {Icon} from '@blueprintjs/core';
import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '@/pages/hooks';
import {
  setName,
  setEmail,
  setAuthenticated,
  setToken,
  setShowLogin,
  setProfilePicture,
  setWatchlist
} from '@/reducer';
import s from './Login.module.scss';

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setUserName] = useState('');
  const [email, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameIsValid, setNameIsValid] = useState(true);
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const guestWatchlist = useAppSelector((state) => state.watchlist);

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

  // Reset errors when switching modes
  useEffect(() => {
    setAuthError('');
    setNameIsValid(true);
    setEmailIsValid(true);
    setPasswordIsValid(true);
  }, [isSignup]);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    // Validation
    let isValid = true;
    if (isSignup && !name.trim()) {
      setNameIsValid(false);
      isValid = false;
    }
    if (!email || !email.includes('@')) {
      setEmailIsValid(false);
      isValid = false;
    }
    if (!password || password.length < 6) {
      setPasswordIsValid(false);
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);
    setAuthError('');

    const endpoint = isSignup ? '/api/signup' : '/api/auth';
    const payload = isSignup ? {name, email, password} : {email, password};

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setEmail(data.email));
        dispatch(setName(data.name));
        dispatch(setToken(data.token));
        dispatch(setAuthenticated(true));
        if (data.profilePicture) {
          dispatch(setProfilePicture(data.profilePicture));
        }
        dispatch(setShowLogin(false));

        // Sync guest watchlist to DB, or load the user's saved watchlist
        const syncEndpoint = guestWatchlist.length > 0 ? '/api/watchlist/sync' : null;
        if (syncEndpoint) {
          const syncRes = await fetch(syncEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.token}`
            },
            body: JSON.stringify({bookIds: guestWatchlist.map((i) => i.id)})
          });
          if (syncRes.ok) {
            const syncData = await syncRes.json();
            dispatch(setWatchlist(syncData.items));
          }
        } else {
          const wlRes = await fetch('/api/watchlist', {
            headers: {Authorization: `Bearer ${data.token}`}
          });
          if (wlRes.ok) {
            const wlData = await wlRes.json();
            dispatch(setWatchlist(wlData.items));
          }
        }
      } else {
        setAuthError(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setUserName(value);
    setNameIsValid(true);
    setAuthError('');
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setUserEmail(value);
    setEmailIsValid(true);
    setAuthError('');
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPassword(value);
    setPasswordIsValid(true);
    setAuthError('');
  }

  const handleClose = () => {
    dispatch(setShowLogin(false));
  };

  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSignup(!isSignup);
  };

  return (
    <div className={s.modalOverlay} onClick={handleClose}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={s.closeButton}
          onClick={handleClose}
          aria-label="Close modal"
        >
          <Icon icon="cross" size={20} />
        </button>

        <div className={s.header}>
          <h2 className={s.title}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className={s.subtitle}>
            {isSignup
              ? 'Join our community of book lovers'
              : 'Log in to access your account'}
          </p>
        </div>

        <form className={s.form} onSubmit={handleSubmit}>
          {isSignup && (
            <div className={s.inputGroup}>
              <label htmlFor="name" className={s.label}>
                Full Name
              </label>
              <div className={s.inputWrapper}>
                <Icon icon="user" className={s.inputIcon} />
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className={`${s.input} ${!nameIsValid ? s.invalid : ''}`}
                  value={name}
                  onChange={handleNameChange}
                  autoFocus
                />
              </div>
              {!nameIsValid && (
                <span className={s.errorText}>Please enter your full name</span>
              )}
            </div>
          )}

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
                onChange={handleEmailChange}
                autoFocus={!isSignup}
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
                className={`${s.input} ${!passwordIsValid ? s.invalid : ''}`}
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            {!passwordIsValid && (
              <span className={s.errorText}>
                Password must be at least 6 characters long
              </span>
            )}
            {authError && <span className={s.errorText}>{authError}</span>}
          </div>

          {!isSignup && (
            <div className={s.forgotPassword}>
              <a href="#">Forgot password?</a>
            </div>
          )}

          <button type="submit" className={s.loginButton} disabled={isLoading}>
            {isLoading
              ? isSignup
                ? 'Creating account...'
                : 'Logging in...'
              : isSignup
                ? 'Sign Up'
                : 'Log In'}
          </button>
        </form>

        <div className={s.footer}>
          <p>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <a href="#" onClick={toggleMode}>
              {isSignup ? 'Log in' : 'Sign up'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
