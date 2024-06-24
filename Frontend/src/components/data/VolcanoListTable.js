import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';

// Import custom component
import {URLS} from "../../utils/Config";

// Import global style sheet and individual style sheets
import 'ag-grid-community/styles/ag-grid.css';
import '../../styles/ag-grid-volcano-wiki-theme.css';
import '../../styles/GlobalStyle.css';

const VolcanoesListTable = ({ volcanoes }) => {
    const navigate = useNavigate();

    // Define columns for AG Grid
    const columnDefs = [
        { headerName: 'ID', field: 'id', hide: true },
        {headerName: 'Name', field: 'name'},
        {headerName: 'Region', field: 'region'},
        {headerName: 'Subregion', field: 'subregion'},
    ];

    // Define column properties
    const defaultColDef = {
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 100,
    }

    // Event handler for row click
    const onRowClicked = (event) => {
        const url = URLS.navigateToVolcano(event.data.country, event.data.name, event.data.id);
        navigate(url); // Navigate to the volcano details page
    }

    return (
        <div className="ag-theme-volcano volcano-list-grid">
            <AgGridReact
                rowData = {volcanoes}
                columnDefs = {columnDefs}
                defaultColDef = {defaultColDef}
                pagination = {true}
                paginationPageSize = {20}
                onRowClicked = {onRowClicked}
            />
        </div>
    );
};

export default VolcanoesListTable;