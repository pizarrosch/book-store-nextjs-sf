import s from './Login.module.scss';
import {useState} from "react";
import {useRouter} from "next/navigation";

function Login() {

    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(true);
    const router = useRouter();


    function handleInputChange(e: InputEvent) {
        const target = e.target as HTMLInputElement;
        setPassword(target.value);
        if (password.length + 1 < 6 ) {
            setIsValid(false)
        } if (password.length > 6) {
            setIsValid(true);
        }
        console.log(
            password.length
        )
    }
    function validatePassword() {
        if (password.length < 6 ) {
            setIsValid(false)
        } if (password.length > 6) {
            setIsValid(true);
        }
        router.push('/profile');
        console.log('I am clicked!')
    }

    return (
        <div className={s.root}>
            <h2 className={s.title}>Log in</h2>
            <form className={s.formContainer}>
                <div className={s.loginContainer}>
                    <label htmlFor='login' className={s.label}>Email</label>
                    <input type='email' id='login' className={s.input}/>
                </div>
                <div className={s.passwordContainer}>
                    <label htmlFor='password' className={s.label}>Password</label>
                    <input type='password' id='password' className={isValid ? s.input : s.invalid} onInput={handleInputChange}/>
                </div>
                { !isValid && <span className={s.errorText}>Your password must be at least 6 characters long</span>}
            </form>
            <button className={s.loginButton} onClick={validatePassword} disabled={!isValid}>Log in</button>
        </div>
    )
}

export default Login;