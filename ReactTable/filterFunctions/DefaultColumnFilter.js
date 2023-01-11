// Define a default UI for filtering
import React, { useCallback, useState } from 'react';
import { TextField } from '@mui/material';
import { debounce } from 'lodash';

function DefaultColumnFilter({
    // eslint-disable-next-line react/prop-types
    column: { filterValue, setFilter },
}) {
    const [value, setValue] = useState(filterValue || '');
    const debouncedFunction = useCallback(debounce((e) => {
        setFilter(e.target.value || undefined)
    }, 1200), []);

    return (
        <TextField
            name="name"
            InputProps={{
                disableUnderline: false
            }}
            size="small"
            variant="standard"
            className="filter-textfield"
            value={value || ''}
            autoComplete="off"
            onChange={e => {
                setValue(e.target.value) // Set undefined to remove the filter entirely
                debouncedFunction(e);
            }}
            // placeholder="Search..."
        />
    );
}
export default DefaultColumnFilter;
