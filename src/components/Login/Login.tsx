import s from './Login.module.scss';
import React, {Dispatch, SetStateAction, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {setName, setEmail} from "@/reducer";

type TShowLogin = {
    setShowLogin: Dispatch<SetStateAction<boolean>>
}

function Login({setShowLogin}: TShowLogin) {

    const [email, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailIsValid, setEmailIsValid] = useState(true);
    const [passwordIsValid, setPasswordIsValid] = useState(true);
    const [areCredentialsCorrect, setAreCredentialsCorrect] = useState(true);
    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();

    function logIn() {
        fetch('/api/auth')
            .then(response => response.json())
            .then(data => {
                if (email === data.email && password === data.password) {
                    // router.push('/profile');
                    dispatch(setEmail(data.email));
                    dispatch(setName(data.name));
                    setShowLogin(false);
                } else {
                    setAreCredentialsCorrect(false);
                }
            })
    }


    function focus() {
        setAreCredentialsCorrect(true);
        setEmailIsValid(true);
        setPasswordIsValid(true);
    }

    function handleInputChange(e: React.KeyboardEvent) {
        const target = e.target as HTMLInputElement;
        setUserEmail(target.value);
        if (!target.value.includes('@')) {
            setEmailIsValid(false);
        } else if (target.value.includes('@')) {
            setEmailIsValid(true)
        }
    }

    function handlePasswordChange(e: InputEvent) {
        const target = e.target as HTMLInputElement;
        setPassword(target.value);
        if (target.value.length < 6) {
            setPasswordIsValid(false);
        } else if (target.value.length >= 6)
            setPasswordIsValid(true);
    }

    return (
        <div className={s.root}>
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
                           value={password} onInput={handlePasswordChange}/>
                </div>
                {!passwordIsValid ?
                    <span className={s.errorText}>Your password must be at least 6 characters long</span> : ''}
                {!areCredentialsCorrect ? <span className={s.errorText}>Email or password are wrong</span> : ''}
            </form>
            <button className={s.loginButton} onClick={logIn} disabled={!passwordIsValid || !emailIsValid}>Log in
            </button>
        </div>
    )
}

export default Login;