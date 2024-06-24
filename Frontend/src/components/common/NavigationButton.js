import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/NavigationButton.css';

const NavigationButton = ({ to, label, onClick }) => {
    const handleClick = (event) => {
        if (onClick) {
            event.preventDefault();
            onClick();
        }
    };

    return (
        <Link to = {to} className = "navigation-button" onClick = {handleClick}>
            {label}
        </Link>
    );
}

export default NavigationButton;