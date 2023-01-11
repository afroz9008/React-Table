import React, { forwardRef, useImperativeHandle } from 'react';
import {
    useTable, usePagination, useGlobalFilter, useFilters, useExpanded, useSortBy
} from 'react-table';
import classNames from 'classnames';
import {
    CircularProgress, Paper, Table,
    TableFooter, TableRow, Typography
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import DefaultColumnFilter from './filterFunctions/DefaultColumnFilter';
import TablePaginationActions from './TablePaginationActions';
import './react-table.css';

// import GlobalFilter from './filterFunctions/GlobalFilter';
/* eslint-disable */

const ReactTableCustom = forwardRef(({ style = { width: "100%" }, classes, hiddenColumns = [], hasFilter = true, rowsPerPageOptions = {}, columns, data, fetchData, loading, pageCount: controlledPageCount, defaultFilter, defaultSort, currentPage, defaultPageSize, title, onRowClick, expandView }, ref) => {
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
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        footerGroups,
        visibleColumns,
        page,
        pageOptions,
        gotoPage,
        setPageSize,
        preGlobalFilteredRows,
        setGlobalFilter,
        setAllFilters,
        state: { pageIndex, pageSize, globalFilter, filters, sortBy },
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            filterTypes,
            initialState: { pageIndex: 0 },
            manualPagination: true, // Tell the usePagination
            manualGlobalFilter: true,
            manualFilters: true,
            autoResetFilters: false,
            // autoResetGlobalFilter: false,
            // debug: true,
            pageCount: controlledPageCount,
            initialState: {
                filters: defaultFilter || [],
                sortBy: defaultSort || [],
                pageSize: defaultPageSize || 10,
                pageIndex: currentPage || 0,
                hiddenColumns
            }
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        useExpanded,
        usePagination,
    );
    // Listen for changes in pagination and use the state to fetch our new data
    React.useEffect(() => {
        fetchData({ pageIndex, pageSize, globalFilter, filters, sortBy })
    }, [pageIndex, pageSize, JSON.stringify(globalFilter), JSON.stringify(filters), JSON.stringify(sortBy)]);
    // const firstPageRows = rows.slice(0, 10);

    //Reload data
    useImperativeHandle(ref, () => ({
        reloadData() {
            fetchData({ pageIndex, pageSize, globalFilter, filters, sortBy });
        }
    }));
    // Render the UI for your table
    return (
        <div style={{position:"relative",width:"100%"}}>
            <Paper className="react-table-main" style={style}>
                {/*<GlobalFilter*/}
                {/*  preGlobalFilteredRows={preGlobalFilteredRows}*/}
                {/*  globalFilter={globalFilter}*/}
                {/*  setGlobalFilter={setGlobalFilter}*/}
                {/*/>*/}
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
                                    {headerGroup.headers.map((column, ind) => {
                                        const width = column.width;
                                        const minWidth = column.minWidth || width;
                                        const maxWidth = column.maxWidth;
                                        const styles = column.styles? { ...column.styles } : {};
                                        const headerStyle = column.headerStyle ? { ...column.headerStyle } : {};
                                        const columnSizeStyle = column.collapse ? {} : { width, minWidth, maxWidth };

                                        return (
                                            <th
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                title=""
                                                className={classNames(column.canSort ? 'cursor-pointer' : '',column.collapse ? 'collapse' : '',)}
                                                style={{ ...columnSizeStyle, ...styles, ...headerStyle }}
                                                key={ind}>
                                                {column.Header && column.render('Header')}
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
                                {/* Render the columns filter UI */}
                                {hasFilter && <tr className="header-filter-row">
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
                                        {row.cells.map((cell, index) => {
                                            return (
                                                <td
                                                    key={index}
                                                    onClick={(e) => {
                                                        if (!cell.column.isNotClickable && onRowClick) {
                                                            onRowClick(row, cell, e);
                                                        }
                                                    }}
                                                    className={classNames(cell.column.collapse ? 'collapse' : '',cell.column.className ? cell.column.className : '', (!cell.column.isNotClickable && onRowClick) ? 'cursor-pointer' : '')}
                                                    style={cell.column.style ? cell.column.style : {}}>{cell.render('Cell')}
                                                </td>
                                            )
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

                </table>
                <Table style={{ position: 'sticky', left: 0, right: "100%" }}>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                {...rowsPerPageOptions}
                                className="table-pagination-footer"
                                colSpan={1000}
                                count={pageOptions.length}
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
                </Table>
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
});

export default ReactTableCustom;
