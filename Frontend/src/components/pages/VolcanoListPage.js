import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

// Import custom components
import VolcanoesListTable from "../data/VolcanoListTable";
import Navigation from "../common/NavigationTitleBar";
import { URLS } from '../../utils/Config';

// Import global style sheet and individual style sheet
import '../../styles/GlobalStyle.css';
import '../../styles/VolcanoListPage.css';

const VolcanoListPage = () => {
    const { country: urlCountry } = useParams();
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(urlCountry || '');
    const [selectedRadius, setSelectedRadius] = useState('');
    const [volcanoes, setVolcanoes] = useState([]);

    // Fetch list of countries from the server
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch(URLS.fetchCountries);

                if (!response.ok) {
                    throw new Error('Failed to fetch countries');
                }

                const data = await response.json();
                if (!Array.isArray(data)) {
                    throw new Error('Country data format is incorrect, expected an array');
                }
                setCountries(data);

            } catch (error) {
                console.error('Error fetching countries:', error);
                setCountries([]); // Empty array fallback on error
            }
        };
        fetchCountries();
    }, []);

    // Fetch list of volcanoes based on selected country and radius
    useEffect(() => {
        if (selectedCountry) {
            const fetchVolcanoes = async () => {
                const url = URLS.fetchVolcanoes(selectedCountry, selectedRadius);
                try {
                    const response = await fetch(url);

                    if (!response.ok) {
                        throw new Error('Failed to fetch volcanoes');
                    }

                    const data = await response.json();
                    setVolcanoes(data);
                } catch (error) {
                    console.error('Error fetching volcanoes:', error);
                }
            };
            fetchVolcanoes();
        }
    }, [selectedCountry, selectedRadius]);

    // Ensure URL and selected country match
    useEffect(() => {
        if (urlCountry !== selectedCountry) {
            setSelectedCountry(urlCountry);
        }
    }, [urlCountry, selectedCountry]);

    // Handle change in country selection
    const handleCountryChange = (event) => {
        const newcountry = event.target.value;
        setSelectedCountry(newcountry);
        navigate(URLS.volcanoListPage(newcountry), { replace: true });
    }

    // Handle change in radius selection
    const handleRadiusChange = (event) => {
        setSelectedRadius(event.target.value);
    }

    return(
        <div className = "volcanoes-list-page">
            <div className = "title-navigation-container">
                <div className = "logo">
                    <h0>The Volcano Wiki</h0>
                </div>
                <Navigation />
            </div>

            {/* Country selection dropdown */}
            <div className = "dropdown-container">
                <div>
                    <label htmlFor = "country-select"> Country:</label>
                    <select id = "country-select" value = {selectedCountry} onChange = {handleCountryChange} className = "dropdown">
                        <option value = "">Select a country</option>
                        {countries.map((country, index) => (
                            <option key = {index} value = {country.country}> {country.country} </option>
                        ))}
                    </select>
                </div>

                {/* Radius selection dropdown */}
                <div>
                    <label htmlFor = "radius-select"> Population within radius:</label>
                    <select id = "radius-select" value = {selectedRadius} onChange = {handleRadiusChange} className = "dropdown">
                        <option value = "">All</option>
                        <option value = "5km">5 km</option>
                        <option value = "10km">10 km</option>
                        <option value = "30km">30 km</option>
                        <option value = "100km">100 km</option>
                    </select>
                </div>

                <p>Select a volcano to view further information</p>
            </div>

            {/* Table of volcanoes */}
            <div className = "grid-table">
                <VolcanoesListTable key = 'ag-theme-volcano' volcanoes = { volcanoes }/>
            </div>
        </div>
    );
}

export default VolcanoListPage;