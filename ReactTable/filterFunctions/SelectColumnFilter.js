// This is a custom filter UI for selecting
// a unique option from a list
import React from 'react';
import { MenuItem, Select } from '@mui/material';

function SelectColumnFilter({
  // eslint-disable-next-line react/prop-types
  column: {
    filterValue, setFilter, preFilteredRows, id
  },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const option = new Set();
    preFilteredRows.forEach(row => {
      option.add(row.values[id]);
    });
    return [...option.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <Select
      value={filterValue}
      displayEmpty
      variant="outlined"
      className="filter-selectfield"
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      {options.map((option, i) => (
        <MenuItem value={option} key={i}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
}

export default SelectColumnFilter;
