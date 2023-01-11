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
import { Draggable, Droppable } from "react-beautiful-dnd";

const ReactTableDraggable = ({ style = {}, showFooter, defaultPageSize, currentPage, onRowClick, columns, data, loading, classes, title, onChangeSelection, resetSelection, expandView, hasFilter }) => {

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
            },
            manualPagination: true, // Tell the usePagination,
            pageSize: defaultPageSize || 10,
            pageIndex: currentPage || 0
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
        <>
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
                                        const maxWidth = column.maxWidth;
                                        const styles = column.styles ? { ...column.styles } : {};
                                        const headerStyle = column.headerStyle ? { ...column.headerStyle } : {};
                                        return (
                                            <th key={index} {...column.getHeaderProps(column.getSortByToggleProps())} className={column.canSort ? 'cursor-pointer' : ''} style={{ width, minWidth, maxWidth, ...styles, ...headerStyle }}>
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
                                        <th {...column.getHeaderProps()} key={ind}>
                                            <div>{column.canFilter ? column.render('Filter') : null}</div>
                                        </th>
                                    ))}
                                </tr>}
                            </React.Fragment>
                        ))}
                    </thead>
                    <Droppable droppableId="droppable">
                        {droppableProvided => {
                            return (
                                <tbody {...getTableBodyProps()} ref={droppableProvided.innerRef} >
                                    {page.map((row, i) => {
                                        prepareRow(row);
                                        return (
                                            <Draggable key={row.original.id} index={row.index} draggableId={row.original.question}>
                                                {draggableProvided => {
                                                    draggableProvided.draggableProps.style = {
                                                        ...draggableProvided.draggableProps.style,
                                                        backgroundColor: "#FFF",
                                                    };
                                                    if (draggableProvided.draggableProps.style.position === "fixed") {
                                                        draggableProvided.draggableProps.style = {
                                                            ...draggableProvided.draggableProps.style,
                                                            boxShadow:
                                                                "0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)",
                                                        };
                                                    }
                                                    return (
                                                        <React.Fragment key={i}>
                                                            <tr
                                                                ref={draggableProvided.innerRef}
                                                                {...draggableProvided.draggableProps}
                                                                {...draggableProvided.dragHandleProps}
                                                                {...row.getRowProps()} className="data-row">
                                                                {onChangeSelection && (<td>
                                                                    <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                                                                </td>)}
                                                                {row.cells.map((cell, index) => {
                                                                    return <td key={index} {...cell.getCellProps()} onClick={(e) => {
                                                                        if (!cell.column.isNotClickable && onRowClick) {
                                                                            onRowClick(row, cell, e);
                                                                        }
                                                                    }} className={classNames(cell.column.className ? cell.column.className : '', (!cell.column.isNotClickable && onRowClick) ? 'cursor-pointer' : '')} style={cell.column.styles ? cell.column.styles : {}}>{cell.render('Cell')}</td>
                                                                })}
                                                            </tr>
                                                            {
                                                                draggableProvided.draggableProps.style.position !== "fixed" && row.isExpanded ? (
                                                                    <tr>
                                                                        <td colSpan={visibleColumns.length}>
                                                                            {expandView(row)}
                                                                        </td>
                                                                    </tr>
                                                                ) : null
                                                            }
                                                        </React.Fragment>
                                                    );
                                                }}
                                            </Draggable>

                                        )
                                    })}
                                    {page.length === 0 && !loading && (
                                        <div className='no-data'>
                                            <span className='align-center'>No rows found</span>
                                        </div>
                                    )}
                                    {loading && (
                                        // Use our custom loading state to show a loading indicator
                                        <tr>
                                            <td style={{ padding: 0 }}>
                                                <div className={classNames("progress-overlay", classes?.progressOverlay)}>
                                                    <span>Loading...</span>

                                                    {/* <CircularProgress
                                                        size={34}
                                                        className={classNames("button-progress", classes?.buttonProgress)}
                                                    />*/}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            );
                        }}
                    </Droppable>

                    {showFooter && <tfoot>
                        {footerGroups.map(group => (
                            <tr key={group} {...group.getFooterGroupProps()}>
                                {group.headers.map(column => {
                                    return (
                                        <td key={column} {...column.getFooterProps()}>{column.Footer ? column.render('Footer') : null}</td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tfoot>}
                </table>

            </Paper>
        </>
    )
};

export default ReactTableDraggable;
