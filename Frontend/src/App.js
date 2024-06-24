import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Custom provider for handling authentication
import { AuthenticationProvider } from "./context/AuthenticationContext";

// Page components
import LandingPage from './components/pages/LandingPage';
import VolcanoListPage from './components/pages/VolcanoListPage';
import VolcanoPage from './components/pages/VolcanoPage';

// Custom fonts
import GlobalFonts from './components/common/Fonts';

function App() {
    return (
        <AuthenticationProvider>
             <Router>
                 <div className = "App">
                     <GlobalFonts />
                        <Routes>
                            {/* Home page */ }
                            <Route path = "/" element ={<LandingPage />} />

                            {/* Volcano List without a country selection */ }
                            <Route path = "/volcanoes-list" element ={<VolcanoListPage />} />

                            {/* Volcano List with a country selection */ }
                            <Route path = "/volcanoes-list/country/:country" element ={<VolcanoListPage />} />

                            {/* Detailed volcano page */ }
                            <Route path = "/volcanoes-list/country/:country/volcano/:volcanoName" element ={<VolcanoPage />} />
                        </Routes>
                 </div>
             </Router>
        </AuthenticationProvider>
    );
}

export default App;
