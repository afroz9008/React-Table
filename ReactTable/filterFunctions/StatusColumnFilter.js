// This is a custom filter UI for selecting
// a unique option from a list
import React from 'react';
import {
  InputBase, Select, withStyles, MenuItem
} from '@mui/material';


const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    border: '1px solid #ced4da',
    padding: '10px 26px 10px 12px',
  },
}))(InputBase);

export const StatusColumnFilter = (filterList = [
  { id: '1', name: 'Active' },
  { id: '0', name: 'Inactive' }
]) => ({
  // eslint-disable-next-line react/prop-types
  column
}) => {
  const {
    filterValue, setFilter
  } = column;
  return (
    <Select
      value={filterValue || ''}
      variant="outlined"
      displayEmpty
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
      input={<BootstrapInput />}
      className="filter-selectfield"
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      {filterList.map(n => (
        <MenuItem value={n.id} key={n.id}>
          {n.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default StatusColumnFilter;
