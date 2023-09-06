import s from './Login.module.scss';
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {setName, setEmail} from "@/reducer";

function Login() {

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
               dispatch(setEmail(data.email));
               dispatch(setName(data.name));
               if (inputRef.current!.value === data.email && passRef.current!.value === data.password) {
                   router.push('/profile');
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

    function handleInputChange() {
            // setEmail(inputRef.current!.value);
            // setPassword(passRef.current!.value);
        if (password.length < 6 || !email.includes('@')) {
            setEmailIsValid(false);
            setPasswordIsValid(false);
        } else if (password.length >= 6 || email.includes('@')) {
            setEmailIsValid(true);
            setPasswordIsValid(true);
        }
    }

    function validate() {
        if (password.length < 6 || !email.includes('@')) {
            setEmailIsValid(false);
            setPasswordIsValid(false);
            return;
        } else if (password.length >= 6 || email.includes('@')) {
            setEmailIsValid(true);
            setPasswordIsValid(true);
            router.push('/profile');
        }
    }

    return (
        <div className={s.root}>
            <h2 className={s.title}>Log in</h2>
            <form className={s.formContainer} onFocus={focus}>
                <div className={s.loginContainer}>
                    <label htmlFor='login' className={s.label}>Email</label>
                    <input type='email' id='login' className={s.input} ref={inputRef} onInput={handleInputChange}/>
                </div>
                { !emailIsValid ? <span className={s.errorText}>Your email must contain @</span> : ''}
                <div className={s.passwordContainer}>
                    <label htmlFor='password' className={s.label}>Password</label>
                    <input type='password' id='password' className={passwordIsValid ? s.input : s.invalid} ref={passRef} onInput={handleInputChange}/>
                </div>
                { !passwordIsValid ? <span className={s.errorText}>Your password must be at least 6 characters long</span> : ''}
                { !areCredentialsCorrect ? <span className={s.errorText}>Email or password are wrong</span> : ''}
            </form>
            <button className={s.loginButton} onClick={logIn} disabled={!passwordIsValid || !emailIsValid}>Log in</button>
        </div>
    )
}

export default Login;