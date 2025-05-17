import s from '../styles/login.module.scss';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setName, setEmail, setAuthenticated, setToken } from "@/reducer";
import Layout from "@/components/layout";
import Head from 'next/head';

export default function LoginPage() {
    const [email, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailIsValid, setEmailIsValid] = useState(true);
    const [passwordIsValid, setPasswordIsValid] = useState(true);
    const [areCredentialsCorrect, setAreCredentialsCorrect] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState('/');

    const router = useRouter();
    const dispatch = useDispatch();

    // Get the redirect URL from query parameters
    useEffect(() => {
        // In client-side navigation, we need to wait for the router to be ready
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const redirect = urlParams.get('redirect');
        if (redirect) {
            setRedirectUrl(redirect);
        }
    }, []);

    async function logIn() {
        if (!emailIsValid || !passwordIsValid) {
            return;
        }

        setIsLoading(true);
        setAreCredentialsCorrect(true);

        // Trim whitespace from email and password, and normalize email to lowercase
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
            });
            console.log(trimmedPassword, trimmedEmail)

            const data = await response.json();

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            console.log('Response data:', data);

            if (response.ok) {
                // Store user data in Redux
                console.log(password)
                dispatch(setEmail(data.email));
                dispatch(setName(data.name));
                dispatch(setToken(data.token));
                dispatch(setAuthenticated(true));

                // Redirect back to the original page or home
                router.push(redirectUrl);
            } else {
                setAreCredentialsCorrect(false);
                console.log('Password wrong')
            }
        } catch (error) {
            console.error('Login error:', error);
            setAreCredentialsCorrect(false);
        } finally {
            setIsLoading(false);
        }
    }

    function focus() {
        setAreCredentialsCorrect(true);
        setEmailIsValid(true);
        setPasswordIsValid(true);
    }

    function handleInputChange(e: React.ChangeEvent) {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        setUserEmail(value);
        // Trim the value and normalize to lowercase for validation to match what will be sent to the API
        const trimmedValue = value.trim().toLowerCase();
        if (!trimmedValue.includes('@')) {
            setEmailIsValid(false);
        } else if (trimmedValue.includes('@')) {
            setEmailIsValid(true)
        }
    }

    function handlePasswordChange(e: React.ChangeEvent) {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        setPassword(value);
        // Trim the value for validation to match what will be sent to the API
        const trimmedValue = value.trim();
        if (trimmedValue.length < 6) {
            setPasswordIsValid(false);
        } else if (trimmedValue.length >= 6)
            setPasswordIsValid(true);
    }

    // Dummy function for Layout component
    const handleShowLogin = () => {
        // No need to do anything here as we're already on the login page
    };

    return (
        <Layout handleShowLogin={handleShowLogin}>
            <Head>
                <title>Login - Book Store</title>
            </Head>
            <div className={s.pageContainer}>
                <h2 className={s.title}>Log in</h2>
                <form className={s.formContainer} onFocus={focus}>
                    <div className={s.loginContainer}>
                        <label htmlFor='login' className={s.label}>Email</label>
                        <input type='email' id='login' className={s.input} value={email} onChange={handleInputChange}/>
                    </div>
                    {!emailIsValid ? <span className={s.errorText}>Your email must contain @</span> : ''}
                    <div className={s.passwordContainer}>
                        <label htmlFor='password' className={s.label}>Password</label>
                        <input type='password' id='password' className={passwordIsValid ? s.input : s.invalid}
                               value={password} onChange={handlePasswordChange}/>
                    </div>
                    {!passwordIsValid ?
                        <span className={s.errorText}>Your password must be at least 6 characters long</span> : ''}
                    {!areCredentialsCorrect ? <span className={s.errorText}>Email or password are wrong</span> : ''}
                </form>
                <button className={s.loginButton} onClick={logIn} disabled={!passwordIsValid || !emailIsValid}>
                    {isLoading ? 'Logging in...' : 'Log in'}
                </button>
            </div>
        </Layout>
    );
}
