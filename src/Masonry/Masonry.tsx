import * as React from "react"
import PositionCache from "./PositionCache"
import {
    requestAnimationTimeout,
    cancelAnimationTimeout,
} from "../utils/requestAnimationTimeout"
import type { AnimationTimeoutId } from "../utils/requestAnimationTimeout"
type Props = {
    autoHeight: boolean
    cellCount: number
    cellMeasurerCache: CellMeasurerCache
    cellPositioner: Positioner
    cellRenderer: CellRenderer
    className: string | null | undefined
    height: number
    id: string | null | undefined
    keyMapper: KeyMapper
    onCellsRendered: OnCellsRenderedCallback | null | undefined
    onScroll: OnScrollCallback | null | undefined
    overscanByPixels: number
    role: string
    scrollingResetTimeInterval: number
    style: unknown
    tabIndex: number
    width: number
    rowDirection: string
    scrollTop?: number
}
type State = {
    isScrolling: boolean
    scrollTop: number
}
const emptyObject = {}

/**
 * Specifies the number of milliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export const DEFAULT_SCROLLING_RESET_TIME_INTERVAL = 150
/**
 * This component efficiently displays arbitrarily positioned cells using windowing techniques.
 * Cell position is determined by an injected `cellPositioner` property.
 * Windowing is vertical; this component does not support horizontal scrolling.
 *
 * Rendering occurs in two phases:
 * 1) First pass uses estimated cell sizes (provided by the cache) to determine how many cells to measure in a batch.
 *    Batch size is chosen using a fast, naive layout algorithm that stacks images in order until the viewport has been filled.
 *    After measurement is complete (componentDidMount or componentDidUpdate) this component evaluates positioned cells
 *    in order to determine if another measurement pass is required (eg if actual cell sizes were less than estimated sizes).
 *    All measurements are permanently cached (keyed by `keyMapper`) for performance purposes.
 * 2) Second pass uses the external `cellPositioner` to layout cells.
 *    At this time the positioner has access to cached size measurements for all cells.
 *    The positions it returns are cached by Masonry for fast access later.
 *    Phase one is repeated if the user scrolls beyond the current layout's bounds.
 *    If the layout is invalidated due to eg a resize, cached positions can be cleared using `recomputeCellPositions()`.
 *
 * Animation constraints:
 *   Simple animations are supported (eg translate/slide into place on initial reveal).
 *   More complex animations are not (eg flying from one position to another on resize).
 *
 * Layout constraints:
 *   This component supports multi-column layout.
 *   The height of each item may vary.
 *   The width of each item must not exceed the width of the column it is "in".
 *   The left position of all items within a column must align.
 *   (Items may not span multiple columns.)
 */

class Masonry extends React.PureComponent<Props, State> {
    static defaultProps = {
        autoHeight: false,
        keyMapper: identity,
        onCellsRendered: noop,
        onScroll: noop,
        overscanByPixels: 20,
        role: "grid",
        scrollingResetTimeInterval: DEFAULT_SCROLLING_RESET_TIME_INTERVAL,
        style: emptyObject,
        tabIndex: 0,
        rowDirection: "ltr",
    }
    state = {
        isScrolling: false,
        scrollTop: 0,
    }
    _debounceResetIsScrollingId: AnimationTimeoutId
    _invalidateOnUpdateStartIndex: number | null | undefined = null
    _invalidateOnUpdateStopIndex: number | null | undefined = null
    _positionCache: PositionCache = new PositionCache()
    _startIndex: number | null | undefined = null
    _startIndexMemoized: number | null | undefined = null
    _stopIndex: number | null | undefined = null
    _stopIndexMemoized: number | null | undefined = null
    private _onScrollMemoized: number
    private _scrollingContainer: any

    clearCellPositions() {
        this._positionCache = new PositionCache()
        this.forceUpdate()
    }

    // HACK This method signature was intended for Grid
    invalidateCellSizeAfterRender({ rowIndex: index }: any) {
        if (this._invalidateOnUpdateStartIndex === null) {
            this._invalidateOnUpdateStartIndex = index
            this._invalidateOnUpdateStopIndex = index
        } else {
            /// is index the correct default value?
            this._invalidateOnUpdateStartIndex = Math.min(
                this._invalidateOnUpdateStartIndex ?? index,
                index
            )
            this._invalidateOnUpdateStopIndex = Math.max(
                this._invalidateOnUpdateStopIndex ?? index,
                index
            )
        }
    }

    recomputeCellPositions() {
        const stopIndex = this._positionCache.count - 1
        this._positionCache = new PositionCache()

        this._populatePositionCache(0, stopIndex)

        this.forceUpdate()
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State): any {
        if (
            nextProps.scrollTop !== undefined &&
            prevState.scrollTop !== nextProps.scrollTop
        ) {
            return {
                isScrolling: true,
                scrollTop: nextProps.scrollTop,
            }
        }

        return null
    }

    componentDidMount() {
        this._checkInvalidateOnUpdate()

        this._invokeOnScrollCallback()

        this._invokeOnCellsRenderedCallback()
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        this._checkInvalidateOnUpdate()

        this._invokeOnScrollCallback()

        this._invokeOnCellsRenderedCallback()

        if (this.props.scrollTop !== prevProps.scrollTop) {
            this._debounceResetIsScrolling()
        }
    }

    componentWillUnmount() {
        if (this._debounceResetIsScrollingId) {
            cancelAnimationTimeout(this._debounceResetIsScrollingId)
        }
    }

    render() {
        const {
            autoHeight,
            cellCount,
            cellMeasurerCache,
            cellRenderer,
            className,
            height,
            id,
            keyMapper,
            overscanByPixels,
            role,
            style,
            tabIndex,
            width,
            rowDirection,
        } = this.props as any
        const { isScrolling, scrollTop } = this.state
        const children = []

        const estimateTotalHeight = this._getEstimatedTotalHeight()

        const shortestColumnSize = this._positionCache.shortestColumnSize
        const measuredCellCount = this._positionCache.count
        let startIndex = 0
        let stopIndex: number | null | undefined

        this._positionCache.range(
            Math.max(0, scrollTop - overscanByPixels),
            height + overscanByPixels * 2,
            (index: number, left: number, top: number) => {
                if (typeof stopIndex === "undefined") {
                    startIndex = index
                    stopIndex = index
                } else {
                    startIndex = Math.min(startIndex, index)
                    stopIndex = Math.max(stopIndex ?? index, index)
                }

                children.push(
                    cellRenderer({
                        index,
                        isScrolling,
                        key: keyMapper(index),
                        parent: this,
                        style: {
                            height: cellMeasurerCache.getHeight(index),
                            [rowDirection === "ltr" ? "left" : "right"]: left,
                            position: "absolute",
                            top,
                            width: cellMeasurerCache.getWidth(index),
                        },
                    })
                )
            }
        )

        // We need to measure additional cells for this layout
        if (
            shortestColumnSize < scrollTop + height + overscanByPixels &&
            measuredCellCount < cellCount
        ) {
            const batchSize = Math.min(
                cellCount - measuredCellCount,
                Math.ceil(
                    (((scrollTop +
                        height +
                        overscanByPixels -
                        shortestColumnSize) /
                        cellMeasurerCache.defaultHeight) *
                        width) /
                        cellMeasurerCache.defaultWidth
                )
            )

            for (
                let index = measuredCellCount;
                index < measuredCellCount + batchSize;
                index++
            ) {
                stopIndex = index
                children.push(
                    cellRenderer({
                        index: index,
                        isScrolling,
                        key: keyMapper(index),
                        parent: this,
                        style: {
                            width: cellMeasurerCache.getWidth(index),
                        },
                    })
                )
            }
        }

        this._startIndex = startIndex
        this._stopIndex = stopIndex
        let ariaLabel = (this.props as any)["aria-label"]
        return (
            <div
                ref={this._setScrollingContainerRef}
                aria-label={ariaLabel}
                className="ReactVirtualized__Masonry"
                id={id ?? ""}
                onScroll={this._onScroll}
                role={role}
                style={{
                    boxSizing: "border-box",
                    direction: "ltr",
                    height: autoHeight ? "auto" : height,
                    overflowX: "hidden",
                    overflowY: estimateTotalHeight < height ? "hidden" : "auto",
                    position: "relative",
                    width,
                    WebkitOverflowScrolling: "touch",
                    willChange: "transform",
                    ...style,
                }}
                tabIndex={tabIndex}
            >
                <div
                    className="ReactVirtualized__Masonry__innerScrollContainer"
                    style={{
                        width: "100%",
                        height: estimateTotalHeight,
                        maxWidth: "100%",
                        maxHeight: estimateTotalHeight,
                        overflow: "hidden",
                        pointerEvents: isScrolling ? "none" : "auto",
                        position: "relative",
                    }}
                >
                    {children}
                </div>
            </div>
        )
    }

    _checkInvalidateOnUpdate() {
        if (typeof this._invalidateOnUpdateStartIndex === "number") {
            const startIndex = this._invalidateOnUpdateStartIndex
            const stopIndex = this._invalidateOnUpdateStopIndex
            this._invalidateOnUpdateStartIndex = null
            this._invalidateOnUpdateStopIndex = null

            // Query external layout logic for position of newly-measured cells
            this._populatePositionCache(startIndex, stopIndex ?? startIndex)

            this.forceUpdate()
        }
    }

    _debounceResetIsScrolling() {
        const { scrollingResetTimeInterval } = this.props

        if (this._debounceResetIsScrollingId) {
            cancelAnimationTimeout(this._debounceResetIsScrollingId)
        }

        this._debounceResetIsScrollingId = requestAnimationTimeout(
            this._debounceResetIsScrollingCallback,
            scrollingResetTimeInterval
        )
    }

    _debounceResetIsScrollingCallback = () => {
        this.setState({
            isScrolling: false,
        })
    }

    _getEstimatedTotalHeight() {
        const { cellCount, cellMeasurerCache, width } = this.props
        const estimatedColumnCount = Math.max(
            1,
            Math.floor(width / cellMeasurerCache.defaultWidth)
        )
        return this._positionCache.estimateTotalHeight(
            cellCount,
            estimatedColumnCount,
            cellMeasurerCache.defaultHeight
        )
    }

    _invokeOnScrollCallback() {
        const { height, onScroll } = this.props as any
        const { scrollTop } = this.state

        if (this._onScrollMemoized !== scrollTop) {
            onScroll({
                clientHeight: height,
                scrollHeight: this._getEstimatedTotalHeight(),
                scrollTop,
            })
            this._onScrollMemoized = scrollTop
        }
    }

    _invokeOnCellsRenderedCallback() {
        if (
            this._startIndexMemoized !== this._startIndex ||
            this._stopIndexMemoized !== this._stopIndex
        ) {
            const { onCellsRendered } = this.props as any
            onCellsRendered({
                startIndex: this._startIndex,
                stopIndex: this._stopIndex,
            })
            this._startIndexMemoized = this._startIndex
            this._stopIndexMemoized = this._stopIndex
        }
    }

    _populatePositionCache(startIndex: number, stopIndex: number) {
        const { cellMeasurerCache, cellPositioner } = this.props

        for (let index = startIndex; index <= stopIndex; index++) {
            const { left, top } = cellPositioner(index)

            this._positionCache.setPosition(
                index,
                left,
                top,
                cellMeasurerCache.getHeight(index)
            )
        }
    }

    _setScrollingContainerRef = (ref: any) => {
        this._scrollingContainer = ref
    }
    _onScroll = (event: any) => {
        const { height } = this.props as any
        const eventScrollTop = event.currentTarget.scrollTop
        // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
        // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
        // This causes a series of rapid renders that is slow for long lists.
        // We can avoid that by doing some simple bounds checking to ensure that scroll offsets never exceed their bounds.
        const scrollTop = Math.min(
            Math.max(0, this._getEstimatedTotalHeight() - height),
            eventScrollTop
        )

        // On iOS, we can arrive at negative offsets by swiping past the start or end.
        // Avoid re-rendering in this case as it can cause problems; see #532 for more.
        if (eventScrollTop !== scrollTop) {
            return
        }

        // Prevent pointer events from interrupting a smooth scroll
        this._debounceResetIsScrolling()

        // Certain devices (like Apple touchpad) rapid-fire duplicate events.
        // Don't force a re-render if this is the case.
        // The mouse may move faster then the animation frame does.
        // Use requestAnimationFrame to avoid over-updating.
        if (this.state.scrollTop !== scrollTop) {
            this.setState({
                isScrolling: true,
                scrollTop,
            })
        }
    }
}

function identity(value: any) {
    return value
}

function noop() {}

type KeyMapper = (index: number) => unknown
export type CellMeasurerCache = {
    defaultHeight: number
    defaultWidth: number
    getHeight: (index: number) => number
    getWidth: (index: number) => number
}
type CellRenderer = (params: {
    index: number
    isScrolling: boolean
    key: unknown
    parent: unknown
    style: unknown
}) => unknown
type OnCellsRenderedCallback = (params: {
    startIndex: number
    stopIndex: number
}) => void
type OnScrollCallback = (params: {
    clientHeight: number
    scrollHeight: number
    scrollTop: number
}) => void
type Position = {
    left: number
    top: number
}
export default Masonry
export type Positioner = (index: number) => Position