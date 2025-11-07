import React, {useState} from 'react';

import axios from 'axios';

// import LoaderComponent from '../components/LoaderComponent';

import styles from './RegisterComponent.module.css';
import {NavLink} from "react-router";

const RegisterComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/register/', {
                email,
                password,
            });

             NavLink('/login');
        } catch (err) {
            setErrorMsg('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className={styles.centerContainer}>
            <form
                onSubmit={handleSubmit}
                className={`auth ${styles.form}`}
            >
                <h2 className={styles.title}>Sign Up</h2>


                <div className={styles.inputGroup}>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className={styles.icon}>
                        <img
                            src="../../images/user.png"
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
                            src={showPassword ? '/public/eye.png' : '/publi/noEye.png'}
                            alt="toggle password"
                            width={24}
                            height={24}
                        />
                    </div>
                </div>

                {/* Confirm Password input */}
                <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        required
                        className={styles.input}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div
                        className={styles.icon}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <img
                            src={showConfirmPassword ? '/public/eye.png' : '/public/noEye.png'}
                            alt="toggle confirm password"
                            width={24}
                            height={24}
                        />
                    </div>
                </div>

                {/* Error message */}
                {errorMsg && <p className={styles.error}>{errorMsg}</p>}

                {/* Submit Button */}
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? (
                        <div className={styles.loaderWrapper}>
                            {/*<LoaderComponent fillColor="#000000" centerColor="#FFD700"/>*/}
                        </div>
                    ) : 'Sign Up'}
                </button>

                {/* Login Link */}
                <div className={styles.bottomContainer}>
                    <p className={styles.registerText}>
                        Already have an account?{' '}
                        <NavLink to="/login" className={styles.link}>
                            Sign in
                        </NavLink>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RegisterComponent;
