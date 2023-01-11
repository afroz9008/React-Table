// This is a custom filter UI for selecting
// a unique option from a list
import React from 'react';
import { AdapterMoment as MomentUtils } from '@mui/x-date-pickers/AdapterMoment';
import classNames from 'classnames';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { withStyles } from '@mui/styles';
import { TextField } from '@mui/material';
const styles = () => ({
  customClass: {
    '& > .MuiFormHelperText-root': {
      display: 'none'
    }
  }
});
function DatePickerComponents({
  // eslint-disable-next-line react/prop-types
  column: {
    filterValue, setFilter
  },
  // eslint-disable-next-line react/prop-types
  classes
}) {
  return (
    <LocalizationProvider dateAdapter={MomentUtils}>
      <DateTimePicker
        className={classNames(classes.customClass, 'filter-textfield')}
        inputFormat="DD-MM-YYYY"
        inputVariant="outlined"
        placeholder="Select Date"
        renderInput={props => <TextField {...props} variant="outlined" helperText="" />}
        size="small"
        value={filterValue ? moment(filterValue, 'YYYY-MM-DD') : null}
        onChange={newValue => {
          if (newValue) {
            setFilter(moment(newValue, 'YYYY-MM-DD').format('YYYY-MM-DD') || undefined);
          } else {
            setFilter(undefined);
          }
        }}
      />
    </LocalizationProvider>
  );
}

export default withStyles(styles)(DatePickerComponents);
