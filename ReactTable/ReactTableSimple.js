import React from 'react';
import {
    useTable, usePagination, useRowSelect, useExpanded, useSortBy, useFilters
} from 'react-table';
import {
    CircularProgress, Paper, Table,
    TableFooter, TableRow, Typography
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import DefaultColumnFilter from './filterFunctions/DefaultColumnFilter';
import IndeterminateCheckbox from './filterFunctions/IndeterminateCheckbox';
import TablePaginationActions from './TablePaginationActions';
import './react-table.css';
import classNames from "classnames"

const ReactTableSimple = ({ hidePagination, hiddenColumns = [], style = { width: "100%" }, showFooter, rowsPerPageOptions, onRowClick, columns, data, loading, classes, title, onChangeSelection, resetSelection, expandView, hasFilter }) => {

    const filterTypes = React.useMemo(
        () => ({
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id];
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        []
    );

    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        visibleColumns,
        page,
        footerGroups,
        gotoPage,
        setPageSize,
        selectedFlatRows,
        getToggleAllRowsSelectedProps,
        toggleAllRowsSelected,
        state: { pageIndex, pageSize, selectedRowIds },
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            filterTypes,
            initialState: {
                filters: [],
                pageIndex: 0,
                hiddenColumns,
            },
            pageSize: hidePagination ? data?.length : 10,
            manualPagination: hidePagination, // Tell the usePagination
            // debug: true,
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination,
        useRowSelect
    );

    //Listen for changes in select checkboxes
    React.useEffect(() => {
        if (onChangeSelection) {
            onChangeSelection(selectedFlatRows);
        }
    }, [selectedRowIds]);

    React.useEffect(() => {
        toggleAllRowsSelected(false)
    }, [resetSelection]);

    // Render the UI for your table
    return (
        <div style={{ position: "relative", width: "100%" }}>
            <Paper className="react-table-main" style={style}>
                {title && (
                    <Typography
                        variant="h5"
                        className="title"
                        color="primary"
                    >
                        {title}
                    </Typography>
                )}
                <table {...getTableProps()} className={classNames("table", classes)}>
                    <thead>
                        {headerGroups.map((headerGroup, i) => (
                            <React.Fragment key={i}>
                                <tr {...headerGroup.getHeaderGroupProps()} key={i} className="header-row">
                                    {onChangeSelection && (<th>
                                        <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                                    </th>)}
                                    {headerGroup.headers.map((column, index) => {
                                        const width = column.width;
                                        const minWidth = column.minWidth || width;
                                        const maxWidth = column.maxWidth || width;
                                        const styles = column.styles ? { ...column.styles } : {};
                                        const headerStyle = column.headerStyle ? { ...column.headerStyle } : {};
                                        const columnSizeStyle = column.collapse ? {} : { width, minWidth, maxWidth };

                                        return (
                                            <th
                                                key={index}
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                className={classNames(column.canSort ? 'cursor-pointer' : '', column.collapse ? 'collapse' : '')}
                                                style={{ ...columnSizeStyle, ...styles, ...headerStyle }}
                                            >
                                                {column.render('Header')}
                                                {column.canSort && <span className='sort-arrow'>
                                                    {column.isSorted
                                                        ? column.isSortedDesc
                                                            ? <i className="fas fa-caret-down"></i>
                                                            : <i className="fas fa-caret-up"></i>
                                                        : <i className="fas fa-sort"></i>}
                                                </span>}
                                            </th>
                                        )
                                    })}
                                </tr>
                                {hasFilter && <tr className="header-filter-row">
                                    {/* Render the columns filter UI */}
                                    {headerGroup.headers.map((column, ind) => (
                                        <th {...column.getHeaderProps()} className={classNames(column.collapse ? 'collapse' : '')} key={ind}>
                                            <div>{column.canFilter ? column.render('Filter') : null}</div>
                                        </th>
                                    ))}
                                </tr>}
                            </React.Fragment>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row);
                            return (
                                <React.Fragment key={i}>
                                    <tr {...row.getRowProps()} className="data-row">
                                        {onChangeSelection && (<td>
                                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                                        </td>)}
                                        {row.cells.map((cell, index) => {
                                            return <td key={index} {...cell.getCellProps()} onClick={(e) => {
                                                if (!cell.column.isNotClickable && onRowClick) {
                                                    onRowClick(row, cell, e);
                                                }
                                            }} className={classNames(cell.column.collapse ? 'collapse' : '', cell.column.className ? cell.column.className : '', (!cell.column.isNotClickable && onRowClick) ? 'cursor-pointer' : '')} style={cell.column.styles ? cell.column.styles : {}}>{cell.render('Cell')}</td>
                                        })}
                                    </tr>
                                    {row.isExpanded ? (
                                        <tr>
                                            <td colSpan={visibleColumns.length}>
                                                {expandView(row)}
                                            </td>
                                        </tr>
                                    ) : null}
                                </React.Fragment>
                            )
                        })}
                        {page.length === 0 && !loading && (
                            <div className='no-data'>
                                <span className='align-center'>No Results Found</span>
                            </div>
                        )}

                    </tbody>
                    {showFooter && <tfoot>
                        {footerGroups.map(group => (
                            <tr key={group} {...group.getFooterGroupProps()} className="data-row">
                                {group.headers.map(column => {
                                    return (
                                        <td key={column} {...column.getFooterProps()}>{column.Footer ? column.render('Footer') : null}</td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tfoot>}
                </table>
                {!hidePagination && <Table style={{ position: 'sticky', left: 0, right: "100%" }}>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                className="table-pagination-footer"
                                colSpan={3}
                                count={data.length}
                                {...rowsPerPageOptions}
                                rowsPerPage={pageSize}
                                page={pageIndex}
                                onPageChange={(e, page) => {
                                    gotoPage(page)
                                }}
                                onRowsPerPageChange={e => {
                                    setPageSize(Number(e.target.value))
                                }}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>}
            </Paper>
            {loading && (
                // Use our custom loading state to show a loading indicator
                <div style={{ padding: 0 }}>
                    <div className="progress-overlay">
                        <span>Loading...</span>

                        {/* <CircularProgress
                            size={34}
                            className="button-progress"
                        /> */}
                    </div>
                </div>
            )}
        </div>
    )
};

export default ReactTableSimple;
