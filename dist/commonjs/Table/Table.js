"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Column_1 = __importDefault(require("./Column"));
const prop_types_1 = __importDefault(require("prop-types"));
const React = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const Grid_1 = __importStar(require("../Grid"));
const defaultRowRenderer_1 = __importDefault(require("./defaultRowRenderer"));
const defaultHeaderRowRenderer_1 = __importDefault(require("./defaultHeaderRowRenderer"));
const SortDirection_1 = __importDefault(require("./SortDirection"));
/**
 * Table component with fixed headers and virtualized rows for improved performance with large data sets.
 * This component expects explicit width, height, and padding parameters.
 */
class Table extends React.PureComponent {
    static propTypes = {
        /** This is just set on the grid top element. */
        "aria-label": prop_types_1.default.string,
        /** This is just set on the grid top element. */
        "aria-labelledby": prop_types_1.default.string,
        /**
         * Removes fixed height from the scrollingContainer so that the total height
         * of rows can stretch the window. Intended for use with WindowScroller
         */
        autoHeight: prop_types_1.default.bool,
        /** One or more Columns describing the data displayed in this row */
        children: (props) => {
            const children = React.Children.toArray(props.children);
            for (let i = 0; i < children.length; i++) {
                const childType = children[i].type;
                if (childType !== Column_1.default &&
                    !(childType.prototype instanceof Column_1.default)) {
                    return new Error("Table only accepts children of type Column");
                }
            }
            return null;
        },
        /** Optional CSS class name */
        className: prop_types_1.default.string,
        /** Disable rendering the header at all */
        disableHeader: prop_types_1.default.bool,
        /**
         * Used to estimate the total height of a Table before all of its rows have actually been measured.
         * The estimated total height is adjusted as rows are rendered.
         */
        estimatedRowSize: prop_types_1.default.number.isRequired,
        /** Optional custom CSS class name to attach to inner Grid element. */
        gridClassName: prop_types_1.default.string,
        /** Optional inline style to attach to inner Grid element. */
        gridStyle: prop_types_1.default.object,
        /** Optional CSS class to apply to all column headers */
        headerClassName: prop_types_1.default.string,
        /** Fixed height of header row */
        headerHeight: prop_types_1.default.number.isRequired,
        /**
         * Responsible for rendering a table row given an array of columns:
         * Should implement the following interface: ({
         *   className: string,
         *   columns: any[],
         *   style: any
         * }): PropTypes.node
         */
        headerRowRenderer: prop_types_1.default.func,
        /** Optional custom inline style to attach to table header columns. */
        headerStyle: prop_types_1.default.object,
        /** Fixed/available height for out DOM element */
        height: prop_types_1.default.number.isRequired,
        /** Optional id */
        id: prop_types_1.default.string,
        /** Optional renderer to be used in place of table body rows when rowCount is 0 */
        noRowsRenderer: prop_types_1.default.func,
        /**
         * Optional callback when a column is clicked.
         * ({ columnData: any, dataKey: string }): void
         */
        onColumnClick: prop_types_1.default.func,
        /**
         * Optional callback when a column's header is clicked.
         * ({ columnData: any, dataKey: string }): void
         */
        onHeaderClick: prop_types_1.default.func,
        /**
         * Callback invoked when a user clicks on a table row.
         * ({ index: number }): void
         */
        onRowClick: prop_types_1.default.func,
        /**
         * Callback invoked when a user double-clicks on a table row.
         * ({ index: number }): void
         */
        onRowDoubleClick: prop_types_1.default.func,
        /**
         * Callback invoked when the mouse leaves a table row.
         * ({ index: number }): void
         */
        onRowMouseOut: prop_types_1.default.func,
        /**
         * Callback invoked when a user moves the mouse over a table row.
         * ({ index: number }): void
         */
        onRowMouseOver: prop_types_1.default.func,
        /**
         * Callback invoked when a user right-clicks on a table row.
         * ({ index: number }): void
         */
        onRowRightClick: prop_types_1.default.func,
        /**
         * Callback invoked with information about the slice of rows that were just rendered.
         * ({ startIndex, stopIndex }): void
         */
        onRowsRendered: prop_types_1.default.func,
        /**
         * Callback invoked whenever the scroll offset changes within the inner scrollable region.
         * This callback can be used to sync scrolling between lists, tables, or grids.
         * ({ clientHeight, scrollHeight, scrollTop }): void
         */
        onScroll: prop_types_1.default.func.isRequired,
        /** See Grid#overscanIndicesGetter */
        overscanIndicesGetter: prop_types_1.default.func.isRequired,
        /**
         * Number of rows to render above/below the visible bounds of the list.
         * These rows can help for smoother scrolling on touch devices.
         */
        overscanRowCount: prop_types_1.default.number.isRequired,
        /**
         * Optional CSS class to apply to all table rows (including the header row).
         * This property can be a CSS class name (string) or a function that returns a class name.
         * If a function is provided its signature should be: ({ index: number }): string
         */
        rowClassName: prop_types_1.default.oneOfType([prop_types_1.default.string, prop_types_1.default.func]),
        /**
         * Callback responsible for returning a data row given an index.
         * ({ index: number }): any
         */
        rowGetter: prop_types_1.default.func.isRequired,
        /**
         * Either a fixed row height (number) or a function that returns the height of a row given its index.
         * ({ index: number }): number
         */
        rowHeight: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.func])
            .isRequired,
        /** Number of rows in table. */
        rowCount: prop_types_1.default.number.isRequired,
        /**
         * Responsible for rendering a table row given an array of columns:
         * Should implement the following interface: ({
         *   className: string,
         *   columns: Array,
         *   index: number,
         *   isScrolling: boolean,
         *   onRowClick: ?Function,
         *   onRowDoubleClick: ?Function,
         *   onRowMouseOver: ?Function,
         *   onRowMouseOut: ?Function,
         *   rowData: any,
         *   style: any
         * }): PropTypes.node
         */
        rowRenderer: prop_types_1.default.func,
        /** Optional custom inline style to attach to table rows. */
        rowStyle: prop_types_1.default.oneOfType([prop_types_1.default.object, prop_types_1.default.func])
            .isRequired,
        /** See Grid#scrollToAlignment */
        scrollToAlignment: prop_types_1.default.oneOf(["auto", "end", "start", "center"])
            .isRequired,
        /** Row index to ensure visible (by forcefully scrolling if necessary) */
        scrollToIndex: prop_types_1.default.number.isRequired,
        /** Vertical offset. */
        scrollTop: prop_types_1.default.number,
        /**
         * Sort function to be called if a sortable header is clicked.
         * Should implement the following interface: ({
         *   defaultSortDirection: 'ASC' | 'DESC',
         *   event: MouseEvent,
         *   sortBy: string,
         *   sortDirection: SortDirection
         * }): void
         */
        sort: prop_types_1.default.func,
        /** Table data is currently sorted by this :dataKey (if it is sorted at all) */
        sortBy: prop_types_1.default.string,
        /** Table data is currently sorted in this direction (if it is sorted at all) */
        sortDirection: prop_types_1.default.oneOf([SortDirection_1.default.ASC, SortDirection_1.default.DESC]),
        /** Optional inline style */
        style: prop_types_1.default.object,
        /** Tab index for focus */
        tabIndex: prop_types_1.default.number,
        /** Width of list */
        width: prop_types_1.default.number.isRequired,
    };
    static defaultProps = {
        disableHeader: false,
        estimatedRowSize: 30,
        headerHeight: 0,
        headerStyle: {},
        noRowsRenderer: () => null,
        onRowsRendered: () => null,
        onScroll: () => null,
        overscanIndicesGetter: Grid_1.accessibilityOverscanIndicesGetter,
        overscanRowCount: 10,
        rowRenderer: defaultRowRenderer_1.default,
        headerRowRenderer: defaultHeaderRowRenderer_1.default,
        rowStyle: {},
        scrollToAlignment: "auto",
        scrollToIndex: -1,
        style: {},
    };
    Grid;
    _cachedColumnStyles;
    constructor(props) {
        super(props);
        this.state = {
            scrollbarWidth: 0,
        };
        this._createColumn = this._createColumn.bind(this);
        this._createRow = this._createRow.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this._onSectionRendered = this._onSectionRendered.bind(this);
        this._setRef = this._setRef.bind(this);
    }
    forceUpdateGrid() {
        if (this.Grid) {
            this.Grid.forceUpdate();
        }
    }
    /** See Grid#getOffsetForCell */
    getOffsetForRow({ alignment, index }) {
        if (this.Grid) {
            const { scrollTop } = this.Grid.getOffsetForCell({
                alignment,
                rowIndex: index,
            });
            return scrollTop;
        }
        return 0;
    }
    /** CellMeasurer compatibility */
    invalidateCellSizeAfterRender({ columnIndex, rowIndex }) {
        if (this.Grid) {
            this.Grid.invalidateCellSizeAfterRender({
                rowIndex,
                columnIndex,
            });
        }
    }
    /** See Grid#measureAllCells */
    measureAllRows() {
        if (this.Grid) {
            this.Grid.measureAllCells();
        }
    }
    /** CellMeasurer compatibility */
    recomputeGridSize({ columnIndex = 0, rowIndex = 0 } = {}) {
        if (this.Grid) {
            this.Grid.recomputeGridSize({
                rowIndex,
                columnIndex,
            });
        }
    }
    /** See Grid#recomputeGridSize */
    recomputeRowHeights(index = 0) {
        if (this.Grid) {
            this.Grid.recomputeGridSize({
                rowIndex: index,
            });
        }
    }
    /** See Grid#scrollToPosition */
    scrollToPosition(scrollTop = 0) {
        if (this.Grid) {
            this.Grid.scrollToPosition({
                scrollTop,
            });
        }
    }
    /** See Grid#scrollToCell */
    scrollToRow(index = 0) {
        if (this.Grid) {
            this.Grid.scrollToCell({
                columnIndex: 0,
                rowIndex: index,
            });
        }
    }
    getScrollbarWidth() {
        if (this.Grid) {
            const Grid = (0, react_dom_1.findDOMNode)(this.Grid);
            const clientWidth = Grid ? Grid.clientWidth : 0;
            const offsetWidth = Grid ? Grid.offsetWidth : 0;
            return offsetWidth - clientWidth;
        }
        return 0;
    }
    componentDidMount() {
        this._setScrollbarWidth();
    }
    componentDidUpdate() {
        this._setScrollbarWidth();
    }
    render() {
        const { children, className, disableHeader, gridClassName, gridStyle, headerHeight, headerRowRenderer, height, id, noRowsRenderer, rowClassName, rowStyle, scrollToIndex, style, width, } = this.props;
        const { scrollbarWidth } = this.state;
        const availableRowsHeight = disableHeader
            ? height
            : height - headerHeight;
        const rowClass = typeof rowClassName === "function"
            ? rowClassName({
                index: -1,
            })
            : rowClassName;
        const rowStyleObject = typeof rowStyle === "function"
            ? rowStyle({
                index: -1,
            })
            : rowStyle;
        // Precompute and cache column styles before rendering rows and columns to speed things up
        this._cachedColumnStyles = [];
        React.Children.toArray(children).forEach((column, index) => {
            let style = column.props.style;
            const flexStyles = this._getFlexStyleForColumn(column, style);
            this._cachedColumnStyles[index] = {
                overflow: "hidden",
                ...flexStyles,
            };
        });
        // Note that we specify :rowCount, :scrollbarWidth, :sortBy, and :sortDirection as properties on Grid even though these have nothing to do with Grid.
        // This is done because Grid is a pure component and won't update unless its properties or state has changed.
        // Any property that should trigger a re-render of Grid then is specified here to avoid a stale display.
        const ariaLabel = this.props.ariaLabel || "";
        const ariaLabeledBy = this.props.ariaLabeledBy || null;
        const rowCount = this.props.rowCount || 0;
        return (React.createElement("div", { "aria-label": ariaLabel, "aria-labelledby": ariaLabeledBy, "aria-colcount": React.Children.toArray(children).length, "aria-rowcount": rowCount, className: "ReactVirtualized__Table", id: id, role: "grid", style: style },
            !disableHeader &&
                headerRowRenderer({
                    className: "ReactVirtualized__Table__headerRow",
                    columns: this._getHeaderColumns(),
                    style: {
                        height: headerHeight,
                        overflow: "hidden",
                        paddingRight: scrollbarWidth,
                        width: width,
                        ...rowStyleObject,
                    },
                }),
            React.createElement(Grid_1.default, { width: 0, rowHeight: 0, rowCount: 0, ...this.props, autoContainerWidth: true, className: "ReactVirtualized__Table__Grid", cellRenderer: this._createRow, columnWidth: width, columnCount: 1, height: availableRowsHeight, id: undefined, noContentRenderer: noRowsRenderer, onScroll: this._onScroll, onSectionRendered: this._onSectionRendered, ref: this._setRef, role: "rowgroup", scrollbarWidth: scrollbarWidth, scrollToRow: scrollToIndex, style: { ...gridStyle, overflowX: "hidden" } })));
    }
    _createColumn({ column, columnIndex, isScrolling, parent, rowData, rowIndex, }) {
        const { onColumnClick } = this.props;
        const { cellDataGetter, cellRenderer, className, columnData, dataKey, id, } = column.props;
        const cellData = cellDataGetter({
            columnData,
            dataKey,
            rowData,
        });
        const renderedCell = cellRenderer({
            cellData,
            columnData,
            columnIndex,
            dataKey,
            isScrolling,
            parent,
            rowData,
            rowIndex,
        });
        const onClick = (event) => {
            onColumnClick &&
                onColumnClick({
                    columnData,
                    dataKey,
                    event,
                });
        };
        const style = this._cachedColumnStyles[columnIndex];
        const title = typeof renderedCell === "string" ? renderedCell : null;
        // Avoid using object-spread syntax with multiple objects here,
        // Since it results in an extra method call to 'babel-runtime/helpers/extends'
        // See PR https://github.com/bvaughn/react-virtualized/pull/942
        return (React.createElement("div", { "aria-colindex": columnIndex + 1, "aria-describedby": id, className: "ReactVirtualized__Table__rowColumn", key: "Row" + rowIndex + "-" + "Col" + columnIndex, onClick: onClick, role: "gridcell", style: style, title: title ?? undefined }, renderedCell));
    }
    _createHeader({ column, index }) {
        const { headerClassName, headerStyle, onHeaderClick, sort, sortBy, sortDirection, } = this.props;
        const { columnData, dataKey, defaultSortDirection, disableSort, headerRenderer, id, label, } = column.props;
        const sortEnabled = !disableSort && sort;
        let classNames = [
            "ReactVirtualized__Table__headerColumn",
            headerClassName,
            column.props.headerClassName,
        ];
        if (sortEnabled) {
            classNames.push("ReactVirtualized__Table__sortableHeaderColumn");
        }
        const style = this._getFlexStyleForColumn(column, {
            ...headerStyle,
            ...column.props.headerStyle,
        });
        const renderedHeader = headerRenderer({
            columnData,
            dataKey,
            disableSort,
            label,
            sortBy,
            sortDirection,
        });
        let headerOnClick, headerOnKeyDown, headerTabIndex, headerAriaSort, headerAriaLabel;
        if (sortEnabled || onHeaderClick) {
            // If this is a sortable header, clicking it should update the table data's sorting.
            const isFirstTimeSort = sortBy !== dataKey;
            // If this is the firstTime sort of this column, use the column default sort order.
            // Otherwise, invert the direction of the sort.
            const newSortDirection = isFirstTimeSort
                ? defaultSortDirection
                : sortDirection === SortDirection_1.default.DESC
                    ? SortDirection_1.default.ASC
                    : SortDirection_1.default.DESC;
            const onClick = (event) => {
                sortEnabled &&
                    sort({
                        defaultSortDirection,
                        event,
                        sortBy: dataKey,
                        sortDirection: newSortDirection,
                    });
                onHeaderClick &&
                    onHeaderClick({
                        columnData,
                        dataKey,
                        event,
                    });
            };
            const onKeyDown = (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    onClick(event);
                }
            };
            headerAriaLabel = column.props["aria-label"] || label || dataKey;
            headerAriaSort = "none";
            headerTabIndex = 0;
            headerOnClick = onClick;
            headerOnKeyDown = onKeyDown;
        }
        if (sortBy === dataKey) {
            headerAriaSort =
                sortDirection === SortDirection_1.default.ASC ? "ascending" : "descending";
        }
        // Avoid using object-spread syntax with multiple objects here,
        // Since it results in an extra method call to 'babel-runtime/helpers/extends'
        // See PR https://github.com/bvaughn/react-virtualized/pull/942
        return (React.createElement("div", { "aria-label": headerAriaLabel ?? "", className: classNames.join(" "), id: id, key: "Header-Col" + index, onClick: headerOnClick, onKeyDown: headerOnKeyDown, role: "columnheader", style: style, tabIndex: headerTabIndex }, renderedHeader));
    }
    _createRow({ rowIndex: index, isScrolling, key, parent, style }) {
        const { children, onRowClick, onRowDoubleClick, onRowRightClick, onRowMouseOver, onRowMouseOut, rowClassName, rowGetter, rowRenderer, rowStyle, } = this.props;
        const { scrollbarWidth } = this.state;
        const rowClass = typeof rowClassName === "function"
            ? rowClassName({
                index,
            })
            : rowClassName;
        const rowStyleObject = typeof rowStyle === "function"
            ? rowStyle({
                index,
            })
            : rowStyle;
        const rowData = rowGetter({
            index,
        });
        const columns = React.Children.toArray(children).map((column, columnIndex) => this._createColumn({
            column,
            columnIndex,
            isScrolling,
            parent,
            rowData,
            rowIndex: index,
            scrollbarWidth,
        }));
        const className = ["ReactVirtualized__Table__row", rowClass].join(" ");
        const flattenedStyle = {
            ...style,
            height: this._getRowHeight(index),
            overflow: "hidden",
            paddingRight: scrollbarWidth,
            ...rowStyleObject,
        };
        return rowRenderer({
            className,
            columns,
            index,
            isScrolling,
            key,
            onRowClick,
            onRowDoubleClick,
            onRowRightClick,
            onRowMouseOver,
            onRowMouseOut,
            rowData,
            style: flattenedStyle,
        });
    }
    /**
     * Determines the flex-shrink, flex-grow, and width values for a cell (header or column).
     */
    _getFlexStyleForColumn(column, customStyle = {}) {
        const flexValue = `${column.props.flexGrow} ${column.props.flexShrink} ${column.props.width}px`;
        const style = {
            ...customStyle,
            flex: flexValue,
            msFlex: flexValue,
            WebkitFlex: flexValue,
        };
        if (column.props.maxWidth) {
            style.maxWidth = column.props.maxWidth;
        }
        if (column.props.minWidth) {
            style.minWidth = column.props.minWidth;
        }
        return style;
    }
    _getHeaderColumns() {
        const { children, disableHeader } = this.props;
        const items = disableHeader ? [] : React.Children.toArray(children);
        return items.map((column, index) => this._createHeader({
            column,
            index,
        }));
    }
    _getRowHeight(rowIndex) {
        const { rowHeight } = this.props;
        return typeof rowHeight === "function"
            ? rowHeight({
                index: rowIndex,
            })
            : rowHeight;
    }
    _onScroll({ clientHeight, scrollHeight, scrollTop }) {
        const { onScroll } = this.props;
        onScroll({
            clientHeight,
            scrollHeight,
            scrollTop,
        });
    }
    _onSectionRendered({ rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex, }) {
        const { onRowsRendered } = this.props;
        onRowsRendered({
            overscanStartIndex: rowOverscanStartIndex,
            overscanStopIndex: rowOverscanStopIndex,
            startIndex: rowStartIndex,
            stopIndex: rowStopIndex,
        });
    }
    _setRef(ref) {
        this.Grid = ref;
    }
    _setScrollbarWidth() {
        const scrollbarWidth = this.getScrollbarWidth();
        this.setState({
            scrollbarWidth,
        });
    }
}
exports.default = Table;
//# sourceMappingURL=Table.js.map