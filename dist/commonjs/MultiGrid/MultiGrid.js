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
const prop_types_1 = __importDefault(require("prop-types"));
const React = __importStar(require("react"));
const CellMeasurerCacheDecorator_1 = __importDefault(require("./CellMeasurerCacheDecorator"));
const Grid_1 = __importDefault(require("../Grid"));
const SCROLLBAR_SIZE_BUFFER = 20;
/**
 * Renders 1, 2, or 4 Grids depending on configuration.
 * A main (body) Grid will always be rendered.
 * Optionally, 1-2 Grids for sticky header rows will also be rendered.
 * If no sticky columns, only 1 sticky header Grid will be rendered.
 * If sticky columns, 2 sticky header Grids will be rendered.
 */
class MultiGrid extends React.PureComponent {
    static propTypes = {
        classNameBottomLeftGrid: prop_types_1.default.string.isRequired,
        classNameBottomRightGrid: prop_types_1.default.string.isRequired,
        classNameTopLeftGrid: prop_types_1.default.string.isRequired,
        classNameTopRightGrid: prop_types_1.default.string.isRequired,
        enableFixedColumnScroll: prop_types_1.default.bool.isRequired,
        enableFixedRowScroll: prop_types_1.default.bool.isRequired,
        fixedColumnCount: prop_types_1.default.number.isRequired,
        fixedRowCount: prop_types_1.default.number.isRequired,
        onScrollbarPresenceChange: prop_types_1.default.func,
        style: prop_types_1.default.object.isRequired,
        styleBottomLeftGrid: prop_types_1.default.object.isRequired,
        styleBottomRightGrid: prop_types_1.default.object.isRequired,
        styleTopLeftGrid: prop_types_1.default.object.isRequired,
        styleTopRightGrid: prop_types_1.default.object.isRequired,
        hideTopRightGridScrollbar: prop_types_1.default.bool,
        hideBottomLeftGridScrollbar: prop_types_1.default.bool,
    };
    static defaultProps = {
        classNameBottomLeftGrid: "",
        classNameBottomRightGrid: "",
        classNameTopLeftGrid: "",
        classNameTopRightGrid: "",
        enableFixedColumnScroll: false,
        enableFixedRowScroll: false,
        fixedColumnCount: 0,
        fixedRowCount: 0,
        scrollToColumn: -1,
        scrollToRow: -1,
        style: {},
        styleBottomLeftGrid: {},
        styleBottomRightGrid: {},
        styleTopLeftGrid: {},
        styleTopRightGrid: {},
        hideTopRightGridScrollbar: false,
        hideBottomLeftGridScrollbar: false,
    };
    state = {
        scrollLeft: 0,
        scrollTop: 0,
        scrollbarSize: 0,
        showHorizontalScrollbar: false,
        showVerticalScrollbar: false,
    };
    _deferredInvalidateColumnIndex = 0;
    _deferredInvalidateRowIndex = 0;
    _deferredMeasurementCacheBottomLeftGrid;
    _deferredMeasurementCacheBottomRightGrid;
    _deferredMeasurementCacheTopRightGrid;
    _bottomLeftGrid;
    _bottomRightGrid;
    _topLeftGrid;
    _topRightGrid;
    _leftGridWidth;
    _topGridHeight;
    _containerOuterStyle;
    _containerTopStyle;
    _containerBottomStyle;
    _lastRenderedHeight;
    _lastRenderedWidth;
    _lastRenderedColumnWidth;
    _lastRenderedFixedColumnCount;
    _lastRenderedFixedRowCount;
    _lastRenderedRowHeight;
    _lastRenderedStyle;
    _lastRenderedStyleBottomLeftGrid;
    _bottomLeftGridStyle;
    _lastRenderedStyleBottomRightGrid;
    _bottomRightGridStyle;
    _lastRenderedStyleTopLeftGrid;
    _topLeftGridStyle;
    _lastRenderedStyleTopRightGrid;
    _topRightGridStyle;
    constructor(props, context) {
        super(props, context);
        const { deferredMeasurementCache, fixedColumnCount, fixedRowCount } = props;
        this._maybeCalculateCachedStyles(true);
        if (deferredMeasurementCache) {
            this._deferredMeasurementCacheBottomLeftGrid =
                fixedRowCount > 0
                    ? new CellMeasurerCacheDecorator_1.default({
                        cellMeasurerCache: deferredMeasurementCache,
                        columnIndexOffset: 0,
                        rowIndexOffset: fixedRowCount,
                    })
                    : deferredMeasurementCache;
            this._deferredMeasurementCacheBottomRightGrid =
                fixedColumnCount > 0 || fixedRowCount > 0
                    ? new CellMeasurerCacheDecorator_1.default({
                        cellMeasurerCache: deferredMeasurementCache,
                        columnIndexOffset: fixedColumnCount,
                        rowIndexOffset: fixedRowCount,
                    })
                    : deferredMeasurementCache;
            this._deferredMeasurementCacheTopRightGrid =
                fixedColumnCount > 0
                    ? new CellMeasurerCacheDecorator_1.default({
                        cellMeasurerCache: deferredMeasurementCache,
                        columnIndexOffset: fixedColumnCount,
                        rowIndexOffset: 0,
                    })
                    : deferredMeasurementCache;
        }
    }
    forceUpdateGrids() {
        this._bottomLeftGrid && this._bottomLeftGrid.forceUpdate();
        this._bottomRightGrid && this._bottomRightGrid.forceUpdate();
        this._topLeftGrid && this._topLeftGrid.forceUpdate();
        this._topRightGrid && this._topRightGrid.forceUpdate();
    }
    /** See Grid#invalidateCellSizeAfterRender */
    invalidateCellSizeAfterRender({ columnIndex = 0, rowIndex = 0 } = {}) {
        this._deferredInvalidateColumnIndex =
            typeof this._deferredInvalidateColumnIndex === "number"
                ? Math.min(this._deferredInvalidateColumnIndex, columnIndex)
                : columnIndex;
        this._deferredInvalidateRowIndex =
            typeof this._deferredInvalidateRowIndex === "number"
                ? Math.min(this._deferredInvalidateRowIndex, rowIndex)
                : rowIndex;
    }
    /** See Grid#measureAllCells */
    measureAllCells() {
        this._bottomLeftGrid && this._bottomLeftGrid.measureAllCells();
        this._bottomRightGrid && this._bottomRightGrid.measureAllCells();
        this._topLeftGrid && this._topLeftGrid.measureAllCells();
        this._topRightGrid && this._topRightGrid.measureAllCells();
    }
    /** See Grid#recomputeGridSize */
    recomputeGridSize({ columnIndex = 0, rowIndex = 0 } = {}) {
        const { fixedColumnCount, fixedRowCount } = this.props;
        const adjustedColumnIndex = Math.max(0, columnIndex - fixedColumnCount);
        const adjustedRowIndex = Math.max(0, rowIndex - fixedRowCount);
        this._bottomLeftGrid &&
            this._bottomLeftGrid.recomputeGridSize({
                columnIndex,
                rowIndex: adjustedRowIndex,
            });
        this._bottomRightGrid &&
            this._bottomRightGrid.recomputeGridSize({
                columnIndex: adjustedColumnIndex,
                rowIndex: adjustedRowIndex,
            });
        this._topLeftGrid &&
            this._topLeftGrid.recomputeGridSize({
                columnIndex,
                rowIndex,
            });
        this._topRightGrid &&
            this._topRightGrid.recomputeGridSize({
                columnIndex: adjustedColumnIndex,
                rowIndex,
            });
        this._leftGridWidth = null;
        this._topGridHeight = null;
        this._maybeCalculateCachedStyles(true);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.scrollLeft !== prevState.scrollLeft ||
            nextProps.scrollTop !== prevState.scrollTop) {
            return {
                scrollLeft: nextProps.scrollLeft != null && nextProps.scrollLeft >= 0
                    ? nextProps.scrollLeft
                    : prevState.scrollLeft,
                scrollTop: nextProps.scrollTop != null && nextProps.scrollTop >= 0
                    ? nextProps.scrollTop
                    : prevState.scrollTop,
            };
        }
        return null;
    }
    componentDidMount() {
        const { scrollLeft, scrollTop } = this.props;
        if (scrollLeft > 0 || scrollTop > 0) {
            const newState = {};
            if (scrollLeft > 0) {
                newState.scrollLeft = scrollLeft;
            }
            if (scrollTop > 0) {
                newState.scrollTop = scrollTop;
            }
            this.setState(newState);
        }
        this._handleInvalidatedGridSize();
    }
    componentDidUpdate() {
        this._handleInvalidatedGridSize();
    }
    render() {
        const { width, height, onScroll, onSectionRendered, onScrollbarPresenceChange, 
        // eslint-disable-line no-unused-vars
        scrollLeft: scrollLeftProp, 
        // eslint-disable-line no-unused-vars
        scrollToColumn, scrollTop: scrollTopProp, 
        // eslint-disable-line no-unused-vars
        scrollToRow, ...rest } = this.props;
        this._prepareForRender();
        // Don't render any of our Grids if there are no cells.
        // This mirrors what Grid does,
        // And prevents us from recording inaccurage measurements when used with CellMeasurer.
        if (width === 0 || height === 0) {
            return null;
        }
        // scrollTop and scrollLeft props are explicitly filtered out and ignored
        const { scrollLeft, scrollTop } = this.state;
        return (React.createElement("div", { style: this._containerOuterStyle },
            React.createElement("div", { style: this._containerTopStyle },
                this._renderTopLeftGrid(rest),
                this._renderTopRightGrid({
                    ...rest,
                    onScroll,
                    scrollLeft,
                })),
            React.createElement("div", { style: this._containerBottomStyle },
                this._renderBottomLeftGrid({
                    ...rest,
                    onScroll,
                    scrollTop,
                }),
                this._renderBottomRightGrid({
                    ...rest,
                    onScroll,
                    onSectionRendered,
                    scrollLeft,
                    scrollToColumn,
                    scrollToRow,
                    scrollTop,
                }))));
    }
    _bottomLeftGridRef = (ref) => {
        this._bottomLeftGrid = ref;
    };
    _bottomRightGridRef = (ref) => {
        this._bottomRightGrid = ref;
    };
    _cellRendererBottomLeftGrid = ({ rowIndex, ...rest }) => {
        const { cellRenderer, fixedRowCount, rowCount } = this.props;
        if (rowIndex === rowCount - fixedRowCount) {
            return (React.createElement("div", { key: rest.key, style: { ...rest.style, height: SCROLLBAR_SIZE_BUFFER } }));
        }
        else {
            return cellRenderer({
                ...rest,
                parent: this,
                rowIndex: rowIndex + fixedRowCount,
            });
        }
    };
    _cellRendererBottomRightGrid = ({ columnIndex, rowIndex, ...rest }) => {
        const { cellRenderer, fixedColumnCount, fixedRowCount } = this
            .props;
        return cellRenderer({
            ...rest,
            columnIndex: columnIndex + fixedColumnCount,
            parent: this,
            rowIndex: rowIndex + fixedRowCount,
        });
    };
    _cellRendererTopRightGrid = ({ columnIndex, ...rest }) => {
        const { cellRenderer, columnCount, fixedColumnCount } = this
            .props;
        if (columnIndex === columnCount - fixedColumnCount) {
            return (React.createElement("div", { key: rest.key, style: { ...rest.style, width: SCROLLBAR_SIZE_BUFFER } }));
        }
        else {
            return cellRenderer({
                ...rest,
                columnIndex: columnIndex + fixedColumnCount,
                parent: this,
            });
        }
    };
    _columnWidthRightGrid = ({ index }) => {
        const { columnCount, fixedColumnCount, columnWidth } = this.props;
        const { scrollbarSize, showHorizontalScrollbar } = this.state;
        // An extra cell is added to the count
        // This gives the smaller Grid extra room for offset,
        // In case the main (bottom right) Grid has a scrollbar
        // If no scrollbar, the extra space is overflow:hidden anyway
        if (showHorizontalScrollbar &&
            index === columnCount - fixedColumnCount) {
            return scrollbarSize;
        }
        return typeof columnWidth === "function"
            ? columnWidth({
                index: index + fixedColumnCount,
            })
            : columnWidth;
    };
    _getBottomGridHeight(props) {
        const { height } = props;
        let topGridHeight = this._getTopGridHeight(props);
        return height - topGridHeight;
    }
    _getLeftGridWidth(props) {
        const { fixedColumnCount, columnWidth } = props;
        if (this._leftGridWidth == null) {
            if (typeof columnWidth === "function") {
                let leftGridWidth = 0;
                for (let index = 0; index < fixedColumnCount; index++) {
                    leftGridWidth += columnWidth({
                        index,
                    });
                }
                this._leftGridWidth = leftGridWidth;
            }
            else {
                this._leftGridWidth = columnWidth * fixedColumnCount;
            }
        }
        return this._leftGridWidth;
    }
    _getRightGridWidth(props) {
        const { width } = props;
        let leftGridWidth = this._getLeftGridWidth(props);
        return width - leftGridWidth;
    }
    _getTopGridHeight(props) {
        const { fixedRowCount, rowHeight } = props;
        if (this._topGridHeight == null) {
            if (typeof rowHeight === "function") {
                let topGridHeight = 0;
                for (let index = 0; index < fixedRowCount; index++) {
                    topGridHeight += rowHeight({
                        index,
                    });
                }
                this._topGridHeight = topGridHeight;
            }
            else {
                this._topGridHeight = rowHeight * fixedRowCount;
            }
        }
        return this._topGridHeight;
    }
    _handleInvalidatedGridSize() {
        if (typeof this._deferredInvalidateColumnIndex === "number") {
            const columnIndex = this._deferredInvalidateColumnIndex;
            const rowIndex = this._deferredInvalidateRowIndex;
            this._deferredInvalidateColumnIndex = null;
            this._deferredInvalidateRowIndex = null;
            this.recomputeGridSize({
                columnIndex,
                rowIndex,
            });
            this.forceUpdate();
        }
    }
    /**
     * Avoid recreating inline styles each render; this bypasses Grid's shallowCompare.
     * This method recalculates styles only when specific props change.
     */
    _maybeCalculateCachedStyles(resetAll = false) {
        const { columnWidth, enableFixedColumnScroll, enableFixedRowScroll, height, fixedColumnCount, fixedRowCount, rowHeight, style, styleBottomLeftGrid, styleBottomRightGrid, styleTopLeftGrid, styleTopRightGrid, width, } = this.props;
        const sizeChange = resetAll ||
            height !== this._lastRenderedHeight ||
            width !== this._lastRenderedWidth;
        const leftSizeChange = resetAll ||
            columnWidth !== this._lastRenderedColumnWidth ||
            fixedColumnCount !== this._lastRenderedFixedColumnCount;
        const topSizeChange = resetAll ||
            fixedRowCount !== this._lastRenderedFixedRowCount ||
            rowHeight !== this._lastRenderedRowHeight;
        if (resetAll || sizeChange || style !== this._lastRenderedStyle) {
            this._containerOuterStyle = {
                height,
                overflow: "visible",
                // Let :focus outline show through
                width,
                ...style,
            };
        }
        if (resetAll || sizeChange || topSizeChange) {
            this._containerTopStyle = {
                height: this._getTopGridHeight(this.props),
                position: "relative",
                width,
            };
            this._containerBottomStyle = {
                height: height - this._getTopGridHeight(this.props),
                overflow: "visible",
                // Let :focus outline show through
                position: "relative",
                width,
            };
        }
        if (resetAll ||
            styleBottomLeftGrid !== this._lastRenderedStyleBottomLeftGrid) {
            this._bottomLeftGridStyle = {
                left: 0,
                overflowX: "hidden",
                overflowY: enableFixedColumnScroll ? "auto" : "hidden",
                position: "absolute",
                ...styleBottomLeftGrid,
            };
        }
        if (resetAll ||
            leftSizeChange ||
            styleBottomRightGrid !== this._lastRenderedStyleBottomRightGrid) {
            this._bottomRightGridStyle = {
                left: this._getLeftGridWidth(this.props),
                position: "absolute",
                ...styleBottomRightGrid,
            };
        }
        if (resetAll ||
            styleTopLeftGrid !== this._lastRenderedStyleTopLeftGrid) {
            this._topLeftGridStyle = {
                left: 0,
                overflowX: "hidden",
                overflowY: "hidden",
                position: "absolute",
                top: 0,
                ...styleTopLeftGrid,
            };
        }
        if (resetAll ||
            leftSizeChange ||
            styleTopRightGrid !== this._lastRenderedStyleTopRightGrid) {
            this._topRightGridStyle = {
                left: this._getLeftGridWidth(this.props),
                overflowX: enableFixedRowScroll ? "auto" : "hidden",
                overflowY: "hidden",
                position: "absolute",
                top: 0,
                ...styleTopRightGrid,
            };
        }
        this._lastRenderedColumnWidth = columnWidth;
        this._lastRenderedFixedColumnCount = fixedColumnCount;
        this._lastRenderedFixedRowCount = fixedRowCount;
        this._lastRenderedHeight = height;
        this._lastRenderedRowHeight = rowHeight;
        this._lastRenderedStyle = style;
        this._lastRenderedStyleBottomLeftGrid = styleBottomLeftGrid;
        this._lastRenderedStyleBottomRightGrid = styleBottomRightGrid;
        this._lastRenderedStyleTopLeftGrid = styleTopLeftGrid;
        this._lastRenderedStyleTopRightGrid = styleTopRightGrid;
        this._lastRenderedWidth = width;
    }
    _prepareForRender() {
        const { columnWidth, fixedColumnCount, fixedRowCount, rowHeight } = this
            .props;
        if (this._lastRenderedColumnWidth !== columnWidth ||
            this._lastRenderedFixedColumnCount !== fixedColumnCount) {
            this._leftGridWidth = null;
        }
        if (this._lastRenderedFixedRowCount !== fixedRowCount ||
            this._lastRenderedRowHeight !== rowHeight) {
            this._topGridHeight = null;
        }
        this._maybeCalculateCachedStyles();
        this._lastRenderedColumnWidth = columnWidth;
        this._lastRenderedFixedColumnCount = fixedColumnCount;
        this._lastRenderedFixedRowCount = fixedRowCount;
        this._lastRenderedRowHeight = rowHeight;
    }
    _onScroll = (scrollInfo) => {
        const { scrollLeft, scrollTop } = scrollInfo;
        this.setState({
            scrollLeft,
            scrollTop,
        });
        const { onScroll } = this.props;
        if (onScroll) {
            onScroll(scrollInfo);
        }
    };
    _onScrollbarPresenceChange = ({ horizontal, size, vertical }) => {
        const { showHorizontalScrollbar, showVerticalScrollbar } = this.state;
        if (horizontal !== showHorizontalScrollbar ||
            vertical !== showVerticalScrollbar) {
            this.setState({
                scrollbarSize: size,
                showHorizontalScrollbar: horizontal,
                showVerticalScrollbar: vertical,
            });
            const { onScrollbarPresenceChange } = this.props;
            if (typeof onScrollbarPresenceChange === "function") {
                onScrollbarPresenceChange({
                    horizontal,
                    size,
                    vertical,
                });
            }
        }
    };
    _onScrollLeft = (scrollInfo) => {
        const { scrollLeft } = scrollInfo;
        this._onScroll({
            scrollLeft,
            scrollTop: this.state.scrollTop,
        });
    };
    _onScrollTop = (scrollInfo) => {
        const { scrollTop } = scrollInfo;
        this._onScroll({
            scrollTop,
            scrollLeft: this.state.scrollLeft,
        });
    };
    _renderBottomLeftGrid(props) {
        const { enableFixedColumnScroll, fixedColumnCount, fixedRowCount, rowCount, hideBottomLeftGridScrollbar, } = props;
        const { classNameBottomLeftGrid } = this.props;
        const { showVerticalScrollbar } = this.state;
        if (!fixedColumnCount) {
            return null;
        }
        const additionalRowCount = showVerticalScrollbar ? 1 : 0, height = this._getBottomGridHeight(props), width = this._getLeftGridWidth(props), scrollbarSize = this.state.showVerticalScrollbar
            ? this.state.scrollbarSize
            : 0, gridWidth = hideBottomLeftGridScrollbar
            ? width + scrollbarSize
            : width;
        const bottomLeftGrid = (React.createElement(Grid_1.default, { ...props, cellRenderer: this._cellRendererBottomLeftGrid, className: classNameBottomLeftGrid, columnCount: fixedColumnCount, deferredMeasurementCache: this._deferredMeasurementCacheBottomLeftGrid, height: height, onScroll: enableFixedColumnScroll ? this._onScrollTop : undefined, ref: this._bottomLeftGridRef, rowCount: Math.max(0, rowCount - fixedRowCount) + additionalRowCount, rowHeight: this._rowHeightBottomGrid, style: this._bottomLeftGridStyle, tabIndex: null, width: gridWidth }));
        if (hideBottomLeftGridScrollbar) {
            return (React.createElement("div", { className: "BottomLeftGrid_ScrollWrapper", style: {
                    ...this._bottomLeftGridStyle,
                    height,
                    width,
                    overflowY: "hidden",
                } }, bottomLeftGrid));
        }
        return bottomLeftGrid;
    }
    _renderBottomRightGrid(props) {
        const { columnCount, fixedColumnCount, fixedRowCount, rowCount, scrollToColumn, scrollToRow, } = props;
        const { classNameBottomRightGrid } = this.props;
        return (React.createElement(Grid_1.default, { ...props, cellRenderer: this._cellRendererBottomRightGrid, className: classNameBottomRightGrid, columnCount: Math.max(0, columnCount - fixedColumnCount), columnWidth: this._columnWidthRightGrid, deferredMeasurementCache: this._deferredMeasurementCacheBottomRightGrid, height: this._getBottomGridHeight(props), onScroll: this._onScroll, onScrollbarPresenceChange: this._onScrollbarPresenceChange, ref: this._bottomRightGridRef, rowCount: Math.max(0, rowCount - fixedRowCount), rowHeight: this._rowHeightBottomGrid, scrollToColumn: scrollToColumn - fixedColumnCount, scrollToRow: scrollToRow - fixedRowCount, style: this._bottomRightGridStyle, width: this._getRightGridWidth(props) }));
    }
    _renderTopLeftGrid(props) {
        const { fixedColumnCount, fixedRowCount } = props;
        const { classNameTopLeftGrid } = this.props;
        if (!fixedColumnCount || !fixedRowCount) {
            return null;
        }
        return (React.createElement(Grid_1.default, { ...props, className: classNameTopLeftGrid, columnCount: fixedColumnCount, height: this._getTopGridHeight(props), ref: this._topLeftGridRef, rowCount: fixedRowCount, style: this._topLeftGridStyle, tabIndex: null, width: this._getLeftGridWidth(props) }));
    }
    _renderTopRightGrid(props) {
        const { columnCount, enableFixedRowScroll, fixedColumnCount, fixedRowCount, scrollLeft, hideTopRightGridScrollbar, } = props;
        const { classNameTopRightGrid } = this.props;
        const { showHorizontalScrollbar, scrollbarSize } = this.state;
        if (!fixedRowCount) {
            return null;
        }
        const additionalColumnCount = showHorizontalScrollbar ? 1 : 0, height = this._getTopGridHeight(props), width = this._getRightGridWidth(props), additionalHeight = showHorizontalScrollbar ? scrollbarSize : 0;
        let gridHeight = height, style = this._topRightGridStyle;
        if (hideTopRightGridScrollbar) {
            gridHeight = height + additionalHeight;
            style = { ...this._topRightGridStyle, left: 0 };
        }
        const topRightGrid = (React.createElement(Grid_1.default, { ...props, cellRenderer: this._cellRendererTopRightGrid, className: classNameTopRightGrid, columnCount: Math.max(0, columnCount - fixedColumnCount) +
                additionalColumnCount, columnWidth: this._columnWidthRightGrid, deferredMeasurementCache: this._deferredMeasurementCacheTopRightGrid, height: gridHeight, onScroll: enableFixedRowScroll ? this._onScrollLeft : undefined, ref: this._topRightGridRef, rowCount: fixedRowCount, scrollLeft: scrollLeft, style: style, tabIndex: null, width: width }));
        if (hideTopRightGridScrollbar) {
            return (React.createElement("div", { className: "TopRightGrid_ScrollWrapper", style: {
                    ...this._topRightGridStyle,
                    height,
                    width,
                    overflowX: "hidden",
                } }, topRightGrid));
        }
        return topRightGrid;
    }
    _rowHeightBottomGrid = ({ index }) => {
        const { fixedRowCount, rowCount, rowHeight } = this.props;
        const { scrollbarSize, showVerticalScrollbar } = this.state;
        // An extra cell is added to the count
        // This gives the smaller Grid extra room for offset,
        // In case the main (bottom right) Grid has a scrollbar
        // If no scrollbar, the extra space is overflow:hidden anyway
        if (showVerticalScrollbar && index === rowCount - fixedRowCount) {
            return scrollbarSize;
        }
        return typeof rowHeight === "function"
            ? rowHeight({
                index: index + fixedRowCount,
            })
            : rowHeight;
    };
    _topLeftGridRef = (ref) => {
        this._topLeftGrid = ref;
    };
    _topRightGridRef = (ref) => {
        this._topRightGrid = ref;
    };
}
exports.default = MultiGrid;
