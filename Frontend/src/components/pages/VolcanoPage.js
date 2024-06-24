import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useLocation } from 'react-router-dom';

// Import custom components
import Navigation from "../common/NavigationTitleBar";
import { Map, Marker } from 'pigeon-maps';
import PopulationChart from '../data/PopulationChart';
import { useAuthentication } from "../../context/AuthenticationContext";
import { URLS } from '../../utils/Config';

// Import global style sheet and individual style sheets
import 'ag-grid-community/styles/ag-grid.css';
import '../../styles/ag-grid-volcano-wiki-theme.css';
import '../../styles/GlobalStyle.css';
import '../../styles/VolcanoPage.css';

const VolcanoPage = () => {
    const [ volcano, setVolcano ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);
    const { isLoggedIn } = useAuthentication();

    // URL ID query parameter
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const volcanoId = query.get('id');

    // Fetch volcano details from the server
    useEffect(() => {
        setLoading(true);
        const url = URLS.fetchVolcanoDetails(volcanoId);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network connection issue: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                setVolcano(data)
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching volcano details:', error)
                setError(error.toString());
                setLoading(false);
            });
    }, [volcanoId]);

    // Define columns for AG Grid
    const columnDefs = [
        { headerName: 'Name', field: 'name', flex: 1, sortable: false },
        { headerName: 'Country', field: 'country', flex: 1, sortable: false},
        { headerName: 'Region', field: 'region', flex: 1, sortable: false},
        { headerName: 'Subregion', field: 'subregion', flex: 2, sortable: false},
        { headerName: 'Last Eruption', field: 'last_eruption', flex: 1, sortable: false},
        { headerName: 'Summit (m)', field: 'summit', flex: 1, sortable: false},
        { headerName: 'Elevation (ft)', field: 'elevation', flex: 1, sortable: false},
    ];

    // Different map zoom levels for when chart component is active or inactive
    const defaultZoomLevel = 2.875;
    const loggedInZoomLevel = 2.5;

    return (
        <div className = "volcano-page">
            <div className = "title-navigation-container">
                <div className = "logo">
                    <h0>The Volcano Wiki</h0>
                </div>
                <Navigation />
            </div>

            {/* Only render elements if data loaded and no errors occurred */}
            {!loading && !error && volcano && (
                <div className = "grid-chart-and-map-container">
                    <div className = "ag-theme-volcano ag-grid-container ag-grid-top-rounded">
                        <AgGridReact
                            columnDefs = { columnDefs }
                            rowData = { [volcano] }>
                        </AgGridReact>
                    </div>

                    <div className = "chart-and-map-container">
                        {isLoggedIn && (
                            <div className = "chart-container">
                                <PopulationChart volcanoId = { volcanoId } />
                            </div>
                        )}

                        <div className = "map-container">
                            <Map center = { [parseFloat(volcano.latitude), 0] } zoom = { isLoggedIn ? loggedInZoomLevel : defaultZoomLevel }>
                                <Marker width = { 50 } anchor = { [parseFloat(volcano.latitude), parseFloat(volcano.longitude)] } color = "red" />
                            </Map>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolcanoPage;