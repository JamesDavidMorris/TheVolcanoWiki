import React, {useEffect, useState} from 'react';

// Import custom component
import Portal from './Portal';
import { URLS } from '../../utils/Config';

// Import individual style sheet
import '../../styles/AuthenticationForm.css';

const AuthenticationForm = ({ onOpen, onClose, onLogin }) => {
    const [ isLogin, setIsLogin ] = useState(true); // True for login, false for registration
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState('');
    const [ message, setMessage ] = useState('');

    // Reset fields for when the overlay is opened
    useEffect(() => {
        if (!onOpen) {
            setEmail('');
            setPassword('');
            setError('');
            setMessage('');
        }
    }, [onOpen, isLogin]);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        const url = isLogin ? URLS.loginUrl : URLS.registerUrl;
        const successMessage = isLogin ? "Login successful" : "Registration successful";
        const failedMessage = isLogin ? "Login failed" : "Registration failed";

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || failedMessage);
            }

            setMessage(successMessage);

            // Perform actions based on form type
            if (isLogin)
            {
                // Store token in session storage on successful login
                sessionStorage.setItem('authToken', data.token);

                setTimeout(() => {
                    onLogin(data.token);
                    onClose();
                }, 1000);
            }
            else
            {
                setTimeout(() => {
                    onClose();
                }, 1000);
            }
        }
        catch (error) {
            setError(error.message);
        }
    };

    // Render nothing if the form should not be open
    if (!onOpen) {
        return null;
    }

    // Toggle between login and registration modes
    const toggleForm = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setError('');
        setMessage('');
    };

    return (
        <Portal>
            <div className = "auth-overlay">
                <div className = "auth-form">
                    <button className = "close-button" onClick = {onClose}>X</button>
                    <h2>{isLogin ? 'Login' : 'Register'}</h2>
                    <form onSubmit = {handleSubmit}>
                        <input type = "email" placeholder = "Email" value = {email} onChange={(e) => setEmail(e.target.value)} required />
                        <input type = "password" placeholder = "Password" value = {password} onChange={(e) => setPassword(e.target.value)} required />
                        <div className = "auth-button-container">
                            <button type = "submit">{isLogin ? 'Sign In' : 'Create Account'}</button>
                        </div>
                        <hr className = "auth-divider" />
                        <div className = "auth-account-text">
                            <span className = "auth-clickable-text" onClick = {toggleForm}>
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                            </span>
                        </div>
                        {message && <div className = "auth-success"> {message}</div>}
                        {error && <div className = "auth-error"> {error}</div>}
                    </form>
                </div>
            </div>
        </Portal>
    );
}

export default AuthenticationForm;