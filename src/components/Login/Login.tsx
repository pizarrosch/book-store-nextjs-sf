import React, {Dispatch, SetStateAction, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {setName, setEmail, setAuthenticated, setToken} from '@/reducer';
import s from './Login.module.scss';

type TShowLogin = {
  setShowLogin: Dispatch<SetStateAction<boolean>>;
};

function Login({setShowLogin}: TShowLogin) {
  const [email, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [areCredentialsCorrect, setAreCredentialsCorrect] = useState(true);

  const dispatch = useDispatch();

  async function logIn() {
    if (!emailIsValid || !passwordIsValid) {
      return;
    }

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
        // Store user data in Redux
        dispatch(setEmail(data.email));
        dispatch(setName(data.name));
        dispatch(setToken(data.token));
        dispatch(setAuthenticated(true));

        // Close login modal
        setShowLogin(false);

        // Optionally redirect to profile
        // router.push('/profile');
      } else {
        setAreCredentialsCorrect(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setAreCredentialsCorrect(false);
    }
  }

  function focus() {
    setAreCredentialsCorrect(true);
    setEmailIsValid(true);
    setPasswordIsValid(true);
  }

  function handleInputChange(e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement;
    setUserEmail(target.value);
    if (!target.value.includes('@')) {
      setEmailIsValid(false);
    } else if (target.value.includes('@')) {
      setEmailIsValid(true);
    }
  }

  function handlePasswordChange(e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement;
    setPassword(target.value);
    if (target.value.length < 6) {
      setPasswordIsValid(false);
    } else if (target.value.length >= 6) setPasswordIsValid(true);
  }

  return (
    <div className={s.root}>
      <h2 className={s.title}>Log in</h2>
      <form className={s.formContainer} onFocus={focus}>
        <div className={s.loginContainer}>
          <label htmlFor="login" className={s.label}>
            Email
          </label>
          <input
            type="email"
            id="login"
            className={s.input}
            value={email}
            onChange={handleInputChange}
          />
        </div>
        {!emailIsValid ? (
          <span className={s.errorText}>Your email must contain @</span>
        ) : (
          ''
        )}
        <div className={s.passwordContainer}>
          <label htmlFor="password" className={s.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            className={passwordIsValid ? s.input : s.invalid}
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {!passwordIsValid ? (
          <span className={s.errorText}>
            Your password must be at least 6 characters long
          </span>
        ) : (
          ''
        )}
        {!areCredentialsCorrect ? (
          <span className={s.errorText}>Email or password are wrong</span>
        ) : (
          ''
        )}
      </form>
      <button
        className={s.loginButton}
        onClick={logIn}
        disabled={!passwordIsValid || !emailIsValid}
      >
        Log in
      </button>
    </div>
  );
}

export default Login;
