import React, {useState, useEffect } from "react";
import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Import custom components
import {useAuthentication} from "../../context/AuthenticationContext";
import { URLS } from '../../utils/Config';

// Register required chart components
ChartJS.register( Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title );

// Predefine chart colours for consistency
const chartColors = {
    backgroundColors: [
        'rgba(75, 192, 192, 0.2)'
    ],
    borderColors: [
        'rgba(75, 192, 192, 1)'
    ]
};

// Display population density around a volcano using a bar chart
const PopulationChart = ({ volcanoId }) => {
    const { isLoggedIn } = useAuthentication();
    const [ chartData, setChartData ] = useState({});
    const [ loading, setLoading ] = useState(true);

    // Fetch population data based on the volcano ID
    useEffect(() => {
        if (!isLoggedIn) {
            setChartData({});
            setLoading(false);
            return;
        }

        const fetchPopulationData = async () => {
            setLoading(true);
            const url = URLS.fetchVolcanoDetails(volcanoId);
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Issue retrieving population data');
                }

                const data = await response.json();

                // Set up chart data
                setChartData({
                    labels: ['5 km', '10 km', '30 km', '100 km'],
                    datasets: [{
                        label: 'Population Density',
                        data: [data.population_5km, data.population_10km, data.population_30km, data.population_100km],
                        backgroundColor: chartColors.backgroundColors,
                        borderColor: chartColors.borderColors,
                        borderWidth: 1
                    }]
                });
            } catch (error) {
                console.error('Failed to fetch population data:', error);
            }

            setLoading(false);
        };

        fetchPopulationData();
    }, [volcanoId, isLoggedIn]);

    return (
        <div>
            {!loading && (
                <Bar
                    data = { chartData }
                    width= { 400 }
                    height= { 630 }
                    options = {{
                        maintainAspectRatio: false,
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: "#181d1f"
                                }
                            },
                            x: {
                                ticks: {
                                    color: "#181d1f"
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Population Density around the Volcano',
                                color: "#181d1f"
                            },
                            legend: {
                                display: true,
                                position: 'top',
                                labels: {
                                    color: "#181d1f"
                                }
                            },
                            tooltip: {
                                titleFontColor: "#181d1f",
                                bodyFontColor: "#181d1f"
                            }
                        }
                    }}
                />
            )}
        </div>
    );
};

export default PopulationChart;