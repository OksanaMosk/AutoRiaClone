import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './LoginComponent.module.css';
import userImage from '../../images/user.png';
import eyeIcon from '../../images/eye.png';
import noEyeIcon from '../../images/noEye.png';
import { authService } from '../../services/authService';  // Імпортуємо authService

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Включаємо лоадер на час запиту
        try {
            await authService.login({ username, password });  // Викликаємо login з authService
            navigate('/dashboard');  // Переходимо на сторінку dashboard
        } catch (err) {
            setError('Invalid credentials.');
            setErrorMsg(err.response?.data?.detail || 'An error occurred'); // Показуємо повідомлення про помилку, якщо є
        } finally {
            setLoading(false);  // Відключаємо лоадер після завершення
        }
    };

    return (
        <div className={styles.centerContainer}>
            <form onSubmit={handleSubmit} className={`auth ${styles.form}`}>
                <h2 className={styles.title}>Sign In</h2>

                {/* Username input */}
                <div className={styles.inputGroup}>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                        id="email"
                        type="text"
                        name="username"
                        placeholder="Username"
                        required
                        className={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className={styles.icon}>
                        <img
                            src={userImage}
                            alt="user icon"
                            width={24}
                            height={24}
                        />
                    </div>
                </div>

                {/* Password input */}
                <div className={styles.inputGroup}>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        required
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div
                        className={styles.icon}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <img
                            src={showPassword ? eyeIcon : noEyeIcon}
                            alt="password"
                            width={24}
                            height={24}
                        />
                    </div>
                </div>

                {/* Error message */}
                {errorMsg && <p className={styles.error}>{errorMsg}</p>}

                {/* Submit Button */}
                <button type="submit" className={`${styles.button}`} disabled={loading}>
                    {loading ? (
                        <div className={`authbutton ${styles.loaderWrapper}`}>
                            {/* Можна додати спінер або індикатор завантаження */}
                        </div>
                    ) : (
                        'Sign In'
                    )}
                </button>

                <div className={styles.bottomContainer}>
                    <p className={styles.registerText}>
                        Don't have an account?{' '}
                        <NavLink to="/register" className={styles.link}>
                            Sign up
                        </NavLink>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginComponent;
