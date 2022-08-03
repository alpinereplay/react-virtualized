import PropTypes from "prop-types"
import * as React from "react"
import CellMeasurerCacheDecorator from "./CellMeasurerCacheDecorator"
import Grid from "../Grid"
const SCROLLBAR_SIZE_BUFFER = 20
/**
 * Renders 1, 2, or 4 Grids depending on configuration.
 * A main (body) Grid will always be rendered.
 * Optionally, 1-2 Grids for sticky header rows will also be rendered.
 * If no sticky columns, only 1 sticky header Grid will be rendered.
 * If sticky columns, 2 sticky header Grids will be rendered.
 */

class MultiGrid extends React.PureComponent {
    static propTypes = {
        classNameBottomLeftGrid: PropTypes.string.isRequired,
        classNameBottomRightGrid: PropTypes.string.isRequired,
        classNameTopLeftGrid: PropTypes.string.isRequired,
        classNameTopRightGrid: PropTypes.string.isRequired,
        enableFixedColumnScroll: PropTypes.bool.isRequired,
        enableFixedRowScroll: PropTypes.bool.isRequired,
        fixedColumnCount: PropTypes.number.isRequired,
        fixedRowCount: PropTypes.number.isRequired,
        onScrollbarPresenceChange: PropTypes.func,
        style: PropTypes.object.isRequired,
        styleBottomLeftGrid: PropTypes.object.isRequired,
        styleBottomRightGrid: PropTypes.object.isRequired,
        styleTopLeftGrid: PropTypes.object.isRequired,
        styleTopRightGrid: PropTypes.object.isRequired,
        hideTopRightGridScrollbar: PropTypes.bool,
        hideBottomLeftGridScrollbar: PropTypes.bool,
    }
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
    }
    state = {
        scrollLeft: 0,
        scrollTop: 0,
        scrollbarSize: 0,
        showHorizontalScrollbar: false,
        showVerticalScrollbar: false,
    }
    _deferredInvalidateColumnIndex: number | null = 0
    _deferredInvalidateRowIndex: number | null = 0
    _deferredMeasurementCacheBottomLeftGrid: any
    _deferredMeasurementCacheBottomRightGrid: any
    _deferredMeasurementCacheTopRightGrid: any
    _bottomLeftGrid: any
    _bottomRightGrid: any
    _topLeftGrid: any
    _topRightGrid: any
    _leftGridWidth: number | null
    _topGridHeight: number | null
    _containerOuterStyle: React.CSSProperties | undefined
    _containerTopStyle: React.CSSProperties | undefined
    _containerBottomStyle: React.CSSProperties | undefined
    _lastRenderedHeight: any
    _lastRenderedWidth: any
    _lastRenderedColumnWidth: any
    _lastRenderedFixedColumnCount: any
    _lastRenderedFixedRowCount: any
    _lastRenderedRowHeight: any
    _lastRenderedStyle: any
    _lastRenderedStyleBottomLeftGrid: any
    _bottomLeftGridStyle: any
    _lastRenderedStyleBottomRightGrid: any
    _bottomRightGridStyle: any
    _lastRenderedStyleTopLeftGrid: any
    _topLeftGridStyle: any
    _lastRenderedStyleTopRightGrid: any
    _topRightGridStyle: any

    constructor(props: any, context: any) {
        super(props, context)
        const { deferredMeasurementCache, fixedColumnCount, fixedRowCount } =
            props

        this._maybeCalculateCachedStyles(true)

        if (deferredMeasurementCache) {
            this._deferredMeasurementCacheBottomLeftGrid =
                fixedRowCount > 0
                    ? new CellMeasurerCacheDecorator({
                          cellMeasurerCache: deferredMeasurementCache,
                          columnIndexOffset: 0,
                          rowIndexOffset: fixedRowCount,
                      })
                    : deferredMeasurementCache
            this._deferredMeasurementCacheBottomRightGrid =
                fixedColumnCount > 0 || fixedRowCount > 0
                    ? new CellMeasurerCacheDecorator({
                          cellMeasurerCache: deferredMeasurementCache,
                          columnIndexOffset: fixedColumnCount,
                          rowIndexOffset: fixedRowCount,
                      })
                    : deferredMeasurementCache
            this._deferredMeasurementCacheTopRightGrid =
                fixedColumnCount > 0
                    ? new CellMeasurerCacheDecorator({
                          cellMeasurerCache: deferredMeasurementCache,
                          columnIndexOffset: fixedColumnCount,
                          rowIndexOffset: 0,
                      })
                    : deferredMeasurementCache
        }
    }

    forceUpdateGrids() {
        this._bottomLeftGrid && this._bottomLeftGrid.forceUpdate()
        this._bottomRightGrid && this._bottomRightGrid.forceUpdate()
        this._topLeftGrid && this._topLeftGrid.forceUpdate()
        this._topRightGrid && this._topRightGrid.forceUpdate()
    }

    /** See Grid#invalidateCellSizeAfterRender */
    invalidateCellSizeAfterRender({ columnIndex = 0, rowIndex = 0 } = {}) {
        this._deferredInvalidateColumnIndex =
            typeof this._deferredInvalidateColumnIndex === "number"
                ? Math.min(this._deferredInvalidateColumnIndex, columnIndex)
                : columnIndex
        this._deferredInvalidateRowIndex =
            typeof this._deferredInvalidateRowIndex === "number"
                ? Math.min(this._deferredInvalidateRowIndex, rowIndex)
                : rowIndex
    }

    /** See Grid#measureAllCells */
    measureAllCells() {
        this._bottomLeftGrid && this._bottomLeftGrid.measureAllCells()
        this._bottomRightGrid && this._bottomRightGrid.measureAllCells()
        this._topLeftGrid && this._topLeftGrid.measureAllCells()
        this._topRightGrid && this._topRightGrid.measureAllCells()
    }

    /** See Grid#recomputeGridSize */
    recomputeGridSize({ columnIndex = 0, rowIndex = 0 }: any = {}) {
        const { fixedColumnCount, fixedRowCount } = this.props as any
        const adjustedColumnIndex = Math.max(0, columnIndex - fixedColumnCount)
        const adjustedRowIndex = Math.max(0, rowIndex - fixedRowCount)
        this._bottomLeftGrid &&
            this._bottomLeftGrid.recomputeGridSize({
                columnIndex,
                rowIndex: adjustedRowIndex,
            })
        this._bottomRightGrid &&
            this._bottomRightGrid.recomputeGridSize({
                columnIndex: adjustedColumnIndex,
                rowIndex: adjustedRowIndex,
            })
        this._topLeftGrid &&
            this._topLeftGrid.recomputeGridSize({
                columnIndex,
                rowIndex,
            })
        this._topRightGrid &&
            this._topRightGrid.recomputeGridSize({
                columnIndex: adjustedColumnIndex,
                rowIndex,
            })
        this._leftGridWidth = null
        this._topGridHeight = null

        this._maybeCalculateCachedStyles(true)
    }

    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        if (
            nextProps.scrollLeft !== prevState.scrollLeft ||
            nextProps.scrollTop !== prevState.scrollTop
        ) {
            return {
                scrollLeft:
                    nextProps.scrollLeft != null && nextProps.scrollLeft >= 0
                        ? nextProps.scrollLeft
                        : prevState.scrollLeft,
                scrollTop:
                    nextProps.scrollTop != null && nextProps.scrollTop >= 0
                        ? nextProps.scrollTop
                        : prevState.scrollTop,
            }
        }

        return null
    }

    componentDidMount() {
        const { scrollLeft, scrollTop } = this.props as any

        if (scrollLeft > 0 || scrollTop > 0) {
            const newState: any = {}

            if (scrollLeft > 0) {
                newState.scrollLeft = scrollLeft
            }

            if (scrollTop > 0) {
                newState.scrollTop = scrollTop
            }

            this.setState(newState)
        }

        this._handleInvalidatedGridSize()
    }

    componentDidUpdate() {
        this._handleInvalidatedGridSize()
    }

    render() {
        const {
            width,
            height,
            onScroll,
            onSectionRendered,
            onScrollbarPresenceChange,
            // eslint-disable-line no-unused-vars
            scrollLeft: scrollLeftProp,
            // eslint-disable-line no-unused-vars
            scrollToColumn,
            scrollTop: scrollTopProp,
            // eslint-disable-line no-unused-vars
            scrollToRow,
            ...rest
        } = this.props as any

        this._prepareForRender()

        // Don't render any of our Grids if there are no cells.
        // This mirrors what Grid does,
        // And prevents us from recording inaccurage measurements when used with CellMeasurer.
        if (width === 0 || height === 0) {
            return null
        }

        // scrollTop and scrollLeft props are explicitly filtered out and ignored
        const { scrollLeft, scrollTop } = this.state
        return (
            <div style={this._containerOuterStyle}>
                <div style={this._containerTopStyle}>
                    {this._renderTopLeftGrid(rest)}
                    {this._renderTopRightGrid({
                        ...rest,
                        onScroll,
                        scrollLeft,
                    })}
                </div>
                <div style={this._containerBottomStyle}>
                    {this._renderBottomLeftGrid({
                        ...rest,
                        onScroll,
                        scrollTop,
                    })}
                    {this._renderBottomRightGrid({
                        ...rest,
                        onScroll,
                        onSectionRendered,
                        scrollLeft,
                        scrollToColumn,
                        scrollToRow,
                        scrollTop,
                    })}
                </div>
            </div>
        )
    }

    _bottomLeftGridRef = (ref: any) => {
        this._bottomLeftGrid = ref
    }
    _bottomRightGridRef = (ref: any) => {
        this._bottomRightGrid = ref
    }
    _cellRendererBottomLeftGrid = ({ rowIndex, ...rest }: any) => {
        const { cellRenderer, fixedRowCount, rowCount } = this.props as any

        if (rowIndex === rowCount - fixedRowCount) {
            return (
                <div
                    key={rest.key}
                    style={{ ...rest.style, height: SCROLLBAR_SIZE_BUFFER }}
                />
            )
        } else {
            return cellRenderer({
                ...rest,
                parent: this,
                rowIndex: rowIndex + fixedRowCount,
            })
        }
    }
    _cellRendererBottomRightGrid = ({
        columnIndex,
        rowIndex,
        ...rest
    }: any) => {
        const { cellRenderer, fixedColumnCount, fixedRowCount } = this
            .props as any
        return cellRenderer({
            ...rest,
            columnIndex: columnIndex + fixedColumnCount,
            parent: this,
            rowIndex: rowIndex + fixedRowCount,
        })
    }
    _cellRendererTopRightGrid = ({ columnIndex, ...rest }: any) => {
        const { cellRenderer, columnCount, fixedColumnCount } = this
            .props as any

        if (columnIndex === columnCount - fixedColumnCount) {
            return (
                <div
                    key={rest.key}
                    style={{ ...rest.style, width: SCROLLBAR_SIZE_BUFFER }}
                />
            )
        } else {
            return cellRenderer({
                ...rest,
                columnIndex: columnIndex + fixedColumnCount,
                parent: this,
            })
        }
    }
    _columnWidthRightGrid = ({ index }: any) => {
        const { columnCount, fixedColumnCount, columnWidth } = this.props as any
        const { scrollbarSize, showHorizontalScrollbar } = this.state

        // An extra cell is added to the count
        // This gives the smaller Grid extra room for offset,
        // In case the main (bottom right) Grid has a scrollbar
        // If no scrollbar, the extra space is overflow:hidden anyway
        if (
            showHorizontalScrollbar &&
            index === columnCount - fixedColumnCount
        ) {
            return scrollbarSize
        }

        return typeof columnWidth === "function"
            ? columnWidth({
                  index: index + fixedColumnCount,
              })
            : columnWidth
    }

    _getBottomGridHeight(props: any) {
        const { height } = props

        let topGridHeight: number = this._getTopGridHeight(props)

        return height - topGridHeight
    }

    _getLeftGridWidth(props: any) {
        const { fixedColumnCount, columnWidth } = props

        if (this._leftGridWidth == null) {
            if (typeof columnWidth === "function") {
                let leftGridWidth = 0

                for (let index = 0; index < fixedColumnCount; index++) {
                    leftGridWidth += columnWidth({
                        index,
                    })
                }

                this._leftGridWidth = leftGridWidth
            } else {
                this._leftGridWidth = columnWidth * fixedColumnCount
            }
        }

        return this._leftGridWidth
    }

    _getRightGridWidth(props: any) {
        const { width } = props

        let leftGridWidth = this._getLeftGridWidth(props)

        return width - leftGridWidth
    }

    _getTopGridHeight(props: any): number {
        const { fixedRowCount, rowHeight } = props

        if (this._topGridHeight == null) {
            if (typeof rowHeight === "function") {
                let topGridHeight = 0

                for (let index = 0; index < fixedRowCount; index++) {
                    topGridHeight += rowHeight({
                        index,
                    })
                }

                this._topGridHeight = topGridHeight
            } else {
                this._topGridHeight = rowHeight * fixedRowCount
            }
        }

        return this._topGridHeight
    }

    _handleInvalidatedGridSize() {
        if (typeof this._deferredInvalidateColumnIndex === "number") {
            const columnIndex = this._deferredInvalidateColumnIndex
            const rowIndex = this._deferredInvalidateRowIndex
            this._deferredInvalidateColumnIndex = null
            this._deferredInvalidateRowIndex = null
            this.recomputeGridSize({
                columnIndex,
                rowIndex,
            })
            this.forceUpdate()
        }
    }

    /**
     * Avoid recreating inline styles each render; this bypasses Grid's shallowCompare.
     * This method recalculates styles only when specific props change.
     */
    _maybeCalculateCachedStyles(resetAll: boolean = false) {
        const {
            columnWidth,
            enableFixedColumnScroll,
            enableFixedRowScroll,
            height,
            fixedColumnCount,
            fixedRowCount,
            rowHeight,
            style,
            styleBottomLeftGrid,
            styleBottomRightGrid,
            styleTopLeftGrid,
            styleTopRightGrid,
            width,
        } = this.props as any
        const sizeChange =
            resetAll ||
            height !== this._lastRenderedHeight ||
            width !== this._lastRenderedWidth
        const leftSizeChange =
            resetAll ||
            columnWidth !== this._lastRenderedColumnWidth ||
            fixedColumnCount !== this._lastRenderedFixedColumnCount
        const topSizeChange =
            resetAll ||
            fixedRowCount !== this._lastRenderedFixedRowCount ||
            rowHeight !== this._lastRenderedRowHeight

        if (resetAll || sizeChange || style !== this._lastRenderedStyle) {
            this._containerOuterStyle = {
                height,
                overflow: "visible",
                // Let :focus outline show through
                width,
                ...style,
            }
        }

        if (resetAll || sizeChange || topSizeChange) {
            this._containerTopStyle = {
                height: this._getTopGridHeight(this.props),
                position: "relative",
                width,
            }
            this._containerBottomStyle = {
                height: height - this._getTopGridHeight(this.props as any),
                overflow: "visible",
                // Let :focus outline show through
                position: "relative",
                width,
            }
        }

        if (
            resetAll ||
            styleBottomLeftGrid !== this._lastRenderedStyleBottomLeftGrid
        ) {
            this._bottomLeftGridStyle = {
                left: 0,
                overflowX: "hidden",
                overflowY: enableFixedColumnScroll ? "auto" : "hidden",
                position: "absolute",
                ...styleBottomLeftGrid,
            }
        }

        if (
            resetAll ||
            leftSizeChange ||
            styleBottomRightGrid !== this._lastRenderedStyleBottomRightGrid
        ) {
            this._bottomRightGridStyle = {
                left: this._getLeftGridWidth(this.props),
                position: "absolute",
                ...styleBottomRightGrid,
            }
        }

        if (
            resetAll ||
            styleTopLeftGrid !== this._lastRenderedStyleTopLeftGrid
        ) {
            this._topLeftGridStyle = {
                left: 0,
                overflowX: "hidden",
                overflowY: "hidden",
                position: "absolute",
                top: 0,
                ...styleTopLeftGrid,
            }
        }

        if (
            resetAll ||
            leftSizeChange ||
            styleTopRightGrid !== this._lastRenderedStyleTopRightGrid
        ) {
            this._topRightGridStyle = {
                left: this._getLeftGridWidth(this.props),
                overflowX: enableFixedRowScroll ? "auto" : "hidden",
                overflowY: "hidden",
                position: "absolute",
                top: 0,
                ...styleTopRightGrid,
            }
        }

        this._lastRenderedColumnWidth = columnWidth
        this._lastRenderedFixedColumnCount = fixedColumnCount
        this._lastRenderedFixedRowCount = fixedRowCount
        this._lastRenderedHeight = height
        this._lastRenderedRowHeight = rowHeight
        this._lastRenderedStyle = style
        this._lastRenderedStyleBottomLeftGrid = styleBottomLeftGrid
        this._lastRenderedStyleBottomRightGrid = styleBottomRightGrid
        this._lastRenderedStyleTopLeftGrid = styleTopLeftGrid
        this._lastRenderedStyleTopRightGrid = styleTopRightGrid
        this._lastRenderedWidth = width
    }

    _prepareForRender() {
        const { columnWidth, fixedColumnCount, fixedRowCount, rowHeight } = this
            .props as any
        if (
            this._lastRenderedColumnWidth !== columnWidth ||
            this._lastRenderedFixedColumnCount !== fixedColumnCount
        ) {
            this._leftGridWidth = null
        }

        if (
            this._lastRenderedFixedRowCount !== fixedRowCount ||
            this._lastRenderedRowHeight !== rowHeight
        ) {
            this._topGridHeight = null
        }

        this._maybeCalculateCachedStyles()

        this._lastRenderedColumnWidth = columnWidth
        this._lastRenderedFixedColumnCount = fixedColumnCount
        this._lastRenderedFixedRowCount = fixedRowCount
        this._lastRenderedRowHeight = rowHeight
    }

    _onScroll = (scrollInfo: any) => {
        const { scrollLeft, scrollTop } = scrollInfo
        this.setState({
            scrollLeft,
            scrollTop,
        })
        const { onScroll } = this.props as any

        if (onScroll) {
            onScroll(scrollInfo)
        }
    }
    _onScrollbarPresenceChange = ({ horizontal, size, vertical }: any) => {
        const { showHorizontalScrollbar, showVerticalScrollbar } = this.state

        if (
            horizontal !== showHorizontalScrollbar ||
            vertical !== showVerticalScrollbar
        ) {
            this.setState({
                scrollbarSize: size,
                showHorizontalScrollbar: horizontal,
                showVerticalScrollbar: vertical,
            })
            const { onScrollbarPresenceChange } = this.props as any

            if (typeof onScrollbarPresenceChange === "function") {
                onScrollbarPresenceChange({
                    horizontal,
                    size,
                    vertical,
                })
            }
        }
    }
    _onScrollLeft = (scrollInfo: any) => {
        const { scrollLeft } = scrollInfo

        this._onScroll({
            scrollLeft,
            scrollTop: this.state.scrollTop,
        })
    }
    _onScrollTop = (scrollInfo: any) => {
        const { scrollTop } = scrollInfo

        this._onScroll({
            scrollTop,
            scrollLeft: this.state.scrollLeft,
        })
    }

    _renderBottomLeftGrid(props: any) {
        const {
            enableFixedColumnScroll,
            fixedColumnCount,
            fixedRowCount,
            rowCount,
            hideBottomLeftGridScrollbar,
        } = props
        const { classNameBottomLeftGrid } = this.props as any
        const { showVerticalScrollbar } = this.state

        if (!fixedColumnCount) {
            return null
        }

        const additionalRowCount = showVerticalScrollbar ? 1 : 0,
            height = this._getBottomGridHeight(props),
            width = this._getLeftGridWidth(props),
            scrollbarSize = this.state.showVerticalScrollbar
                ? this.state.scrollbarSize
                : 0,
            gridWidth = hideBottomLeftGridScrollbar
                ? width + scrollbarSize
                : width

        const bottomLeftGrid = (
            <Grid
                {...props}
                cellRenderer={this._cellRendererBottomLeftGrid}
                className={classNameBottomLeftGrid}
                columnCount={fixedColumnCount}
                deferredMeasurementCache={
                    this._deferredMeasurementCacheBottomLeftGrid
                }
                height={height}
                onScroll={
                    enableFixedColumnScroll ? this._onScrollTop : undefined
                }
                ref={this._bottomLeftGridRef}
                rowCount={
                    Math.max(0, rowCount - fixedRowCount) + additionalRowCount
                }
                rowHeight={this._rowHeightBottomGrid}
                style={this._bottomLeftGridStyle}
                tabIndex={null}
                width={gridWidth}
            />
        )

        if (hideBottomLeftGridScrollbar) {
            return (
                <div
                    className="BottomLeftGrid_ScrollWrapper"
                    style={{
                        ...this._bottomLeftGridStyle,
                        height,
                        width,
                        overflowY: "hidden",
                    }}
                >
                    {bottomLeftGrid}
                </div>
            )
        }

        return bottomLeftGrid
    }

    _renderBottomRightGrid(props: any) {
        const {
            columnCount,
            fixedColumnCount,
            fixedRowCount,
            rowCount,
            scrollToColumn,
            scrollToRow,
        } = props
        const { classNameBottomRightGrid } = this.props as any
        return (
            <Grid
                {...props}
                cellRenderer={this._cellRendererBottomRightGrid}
                className={classNameBottomRightGrid}
                columnCount={Math.max(0, columnCount - fixedColumnCount)}
                columnWidth={this._columnWidthRightGrid}
                deferredMeasurementCache={
                    this._deferredMeasurementCacheBottomRightGrid
                }
                height={this._getBottomGridHeight(props)}
                onScroll={this._onScroll}
                onScrollbarPresenceChange={this._onScrollbarPresenceChange}
                ref={this._bottomRightGridRef}
                rowCount={Math.max(0, rowCount - fixedRowCount)}
                rowHeight={this._rowHeightBottomGrid}
                scrollToColumn={scrollToColumn - fixedColumnCount}
                scrollToRow={scrollToRow - fixedRowCount}
                style={this._bottomRightGridStyle}
                width={this._getRightGridWidth(props)}
            />
        )
    }

    _renderTopLeftGrid(props: any) {
        const { fixedColumnCount, fixedRowCount } = props
        const { classNameTopLeftGrid } = this.props as any

        if (!fixedColumnCount || !fixedRowCount) {
            return null
        }

        return (
            <Grid
                {...props}
                className={classNameTopLeftGrid}
                columnCount={fixedColumnCount}
                height={this._getTopGridHeight(props)}
                ref={this._topLeftGridRef}
                rowCount={fixedRowCount}
                style={this._topLeftGridStyle}
                tabIndex={null}
                width={this._getLeftGridWidth(props)}
            />
        )
    }

    _renderTopRightGrid(props: any) {
        const {
            columnCount,
            enableFixedRowScroll,
            fixedColumnCount,
            fixedRowCount,
            scrollLeft,
            hideTopRightGridScrollbar,
        } = props
        const { classNameTopRightGrid } = this.props as any
        const { showHorizontalScrollbar, scrollbarSize } = this.state

        if (!fixedRowCount) {
            return null
        }

        const additionalColumnCount = showHorizontalScrollbar ? 1 : 0,
            height = this._getTopGridHeight(props),
            width = this._getRightGridWidth(props),
            additionalHeight = showHorizontalScrollbar ? scrollbarSize : 0

        let gridHeight = height,
            style = this._topRightGridStyle

        if (hideTopRightGridScrollbar) {
            gridHeight = height + additionalHeight
            style = { ...this._topRightGridStyle, left: 0 }
        }

        const topRightGrid = (
            <Grid
                {...props}
                cellRenderer={this._cellRendererTopRightGrid}
                className={classNameTopRightGrid}
                columnCount={
                    Math.max(0, columnCount - fixedColumnCount) +
                    additionalColumnCount
                }
                columnWidth={this._columnWidthRightGrid}
                deferredMeasurementCache={
                    this._deferredMeasurementCacheTopRightGrid
                }
                height={gridHeight}
                onScroll={enableFixedRowScroll ? this._onScrollLeft : undefined}
                ref={this._topRightGridRef}
                rowCount={fixedRowCount}
                scrollLeft={scrollLeft}
                style={style}
                tabIndex={null}
                width={width}
            />
        )

        if (hideTopRightGridScrollbar) {
            return (
                <div
                    className="TopRightGrid_ScrollWrapper"
                    style={{
                        ...this._topRightGridStyle,
                        height,
                        width,
                        overflowX: "hidden",
                    }}
                >
                    {topRightGrid}
                </div>
            )
        }

        return topRightGrid
    }

    _rowHeightBottomGrid = ({ index }: any) => {
        const { fixedRowCount, rowCount, rowHeight } = this.props as any
        const { scrollbarSize, showVerticalScrollbar } = this.state

        // An extra cell is added to the count
        // This gives the smaller Grid extra room for offset,
        // In case the main (bottom right) Grid has a scrollbar
        // If no scrollbar, the extra space is overflow:hidden anyway
        if (showVerticalScrollbar && index === rowCount - fixedRowCount) {
            return scrollbarSize
        }

        return typeof rowHeight === "function"
            ? rowHeight({
                  index: index + fixedRowCount,
              })
            : rowHeight
    }
    _topLeftGridRef = (ref: any) => {
        this._topLeftGrid = ref
    }
    _topRightGridRef = (ref: any) => {
        this._topRightGrid = ref
    }
}

export default MultiGrid