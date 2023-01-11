// Define a default UI for filtering
import { TextField } from '@mui/material';
import React from 'react';

function GlobalFilter({
  // eslint-disable-next-line react/prop-types
  globalFilter,
  // eslint-disable-next-line react/prop-types
  setGlobalFilter,
}) {
  return (
    <span>
      <TextField
        name="name"
        size="small"
        variant="outlined"
        value={globalFilter || ''}
        autoComplete="off"
        onChange={e => {
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder="Search..."
        style={{
          width: '100%',
          padding: '1.5em 1.5em 0em 1.5em'
        }}
      />
    </span>
  );
}
export default GlobalFilter;
