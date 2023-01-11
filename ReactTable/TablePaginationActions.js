import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { withStyles } from '@mui/styles';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    const { onPageChange } = this.props;
    onPageChange(event, 0);
  };

  handleBackButtonClick = event => {
    const { onPageChange, page } = this.props;
    onPageChange(event, page - 1);
  };

  handleNextButtonClick = event => {
    const { onPageChange, page } = this.props;
    onPageChange(event, page + 1);
  };

  handleLastPageButtonClick = event => {
    const { onPageChange, count, rowsPerPage } = this.props;
    onPageChange(
      event,
      Math.max(0, Math.ceil(count / rowsPerPage) - 1),
    );
  };

  render() {
    const {
      classes,
      count,
      page,
      rowsPerPage,
      theme
    } = this.props;

    return (
      <div className={classes.root}>
        {/* <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
        </IconButton> */}
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
          >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
          >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        {/* <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
        </IconButton> */}
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);
