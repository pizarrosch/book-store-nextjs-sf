import s from './Login.module.scss';

function Login() {
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
                    <input type='password' id='password' className={s.input}/>
                </div>
                <span className={s.errorText}>Your password must be at least 6 characters long</span>
            </form>
            <button className={s.loginButton}>Log in</button>
        </div>
    )
}

export default Login;