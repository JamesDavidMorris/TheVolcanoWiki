import React from 'react';
import Navigation from "../common/NavigationTitleBar";

import '../../styles/GlobalStyle.css';
import '../../styles/LandingPage.css';

const LandingPage = () =>
{
    return(
        <div className = "landing-page">
            <div className = "title-navigation-container">
                <Navigation />
            </div>

            <div className = "center-container">
                <div className = "large-text">
                    THE VOLCANO WIKI
                </div>
                <div className = "small-text">
                    A GUIDE TO THE WORLD OF VOLCANOES
                </div>
            </div>

        </div>
    );
}

export default LandingPage;