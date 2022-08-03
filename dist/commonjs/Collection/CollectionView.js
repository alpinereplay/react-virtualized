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
const createCallbackMemoizer_1 = __importDefault(require("../utils/createCallbackMemoizer"));
const scrollbarSize_1 = __importDefault(require("dom-helpers/scrollbarSize"));
// @TODO Merge Collection and CollectionView
/**
 * Specifies the number of milliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
const IS_SCROLLING_TIMEOUT = 150;
/**
 * Controls whether the Grid updates the DOM element's scrollLeft/scrollTop based on the current state or just observes it.
 * This prevents Grid from interrupting mouse-wheel animations (see issue #2).
 */
const SCROLL_POSITION_CHANGE_REASONS = {
    OBSERVED: "observed",
    REQUESTED: "requested",
};
/**
 * Monitors changes in properties (eg. cellCount) and state (eg. scroll offsets) to determine when rendering needs to occur.
 * This component does not render any visible content itself; it defers to the specified :cellLayoutManager.
 */
class CollectionView extends React.PureComponent {
    static propTypes = {
        "aria-label": prop_types_1.default.string,
        /**
         * Removes fixed height from the scrollingContainer so that the total height
         * of rows can stretch the window. Intended for use with WindowScroller
         */
        autoHeight: prop_types_1.default.bool,
        /**
         * Number of cells in collection.
         */
        cellCount: prop_types_1.default.number.isRequired,
        /**
         * Calculates cell sizes and positions and manages rendering the appropriate cells given a specified window.
         */
        cellLayoutManager: prop_types_1.default.object.isRequired,
        /**
         * Optional custom CSS class name to attach to root Collection element.
         */
        className: prop_types_1.default.string,
        /**
         * Height of Collection; this property determines the number of visible (vs virtualized) rows.
         */
        height: prop_types_1.default.number.isRequired,
        /**
         * Optional custom id to attach to root Collection element.
         */
        id: prop_types_1.default.string,
        /**
         * Enables the `Collection` to horiontally "overscan" its content similar to how `Grid` does.
         * This can reduce flicker around the edges when a user scrolls quickly.
         */
        horizontalOverscanSize: prop_types_1.default.number.isRequired,
        isScrollingChange: prop_types_1.default.func,
        /**
         * Optional renderer to be used in place of rows when either :rowCount or :cellCount is 0.
         */
        noContentRenderer: prop_types_1.default.func.isRequired,
        /**
         * Callback invoked whenever the scroll offset changes within the inner scrollable region.
         * This callback can be used to sync scrolling between lists, tables, or grids.
         * ({ clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth }): void
         */
        onScroll: prop_types_1.default.func.isRequired,
        /**
         * Callback invoked with information about the section of the Collection that was just rendered.
         * This callback is passed a named :indices parameter which is an Array of the most recently rendered section indices.
         */
        onSectionRendered: prop_types_1.default.func.isRequired,
        /**
         * Horizontal offset.
         */
        scrollLeft: prop_types_1.default.number,
        /**
         * Controls scroll-to-cell behavior of the Grid.
         * The default ("auto") scrolls the least amount possible to ensure that the specified cell is fully visible.
         * Use "start" to align cells to the top/left of the Grid and "end" to align bottom/right.
         */
        scrollToAlignment: prop_types_1.default.oneOf(["auto", "end", "start", "center"])
            .isRequired,
        /**
         * Cell index to ensure visible (by forcefully scrolling if necessary).
         */
        scrollToCell: prop_types_1.default.number.isRequired,
        /**
         * Vertical offset.
         */
        scrollTop: prop_types_1.default.number,
        /**
         * Optional custom inline style to attach to root Collection element.
         */
        style: prop_types_1.default.object,
        /**
         * Enables the `Collection` to vertically "overscan" its content similar to how `Grid` does.
         * This can reduce flicker around the edges when a user scrolls quickly.
         */
        verticalOverscanSize: prop_types_1.default.number.isRequired,
        /**
         * Width of Collection; this property determines the number of visible (vs virtualized) columns.
         */
        width: prop_types_1.default.number.isRequired,
    };
    static defaultProps = {
        "aria-label": "grid",
        horizontalOverscanSize: 0,
        noContentRenderer: () => null,
        onScroll: () => null,
        onSectionRendered: () => null,
        scrollToAlignment: "auto",
        scrollToCell: -1,
        style: {},
        verticalOverscanSize: 0,
    };
    state = {
        isScrolling: false,
        scrollLeft: 0,
        scrollTop: 0,
    };
    _calculateSizeAndPositionDataOnNextUpdate = false;
    // Invokes callbacks only when their values have changed.
    _onSectionRenderedMemoizer = (0, createCallbackMemoizer_1.default)();
    _onScrollMemoizer = (0, createCallbackMemoizer_1.default)(false);
    _scrollbarSize;
    _scrollbarSizeMeasured;
    _scrollingContainer;
    _disablePointerEventsTimeoutId;
    _lastRenderedCellCount;
    _lastRenderedCellLayoutManager;
    constructor(...args) {
        super(args);
        // If this component is being rendered server-side, getScrollbarSize() will return undefined.
        // We handle this case in componentDidMount()
        this._scrollbarSize = (0, scrollbarSize_1.default)();
        if (this._scrollbarSize === undefined) {
            this._scrollbarSizeMeasured = false;
            this._scrollbarSize = 0;
        }
        else {
            this._scrollbarSizeMeasured = true;
        }
    }
    /**
     * Forced recompute of cell sizes and positions.
     * This function should be called if cell sizes have changed but nothing else has.
     * Since cell positions are calculated by callbacks, the collection view has no way of detecting when the underlying data has changed.
     */
    recomputeCellSizesAndPositions() {
        this._calculateSizeAndPositionDataOnNextUpdate = true;
        this.forceUpdate();
    }
    /* ---------------------------- Component lifecycle methods ---------------------------- */
    /**
     * @private
     * This method updates scrollLeft/scrollTop in state for the following conditions:
     * 1) Empty content (0 rows or columns)
     * 2) New scroll props overriding the current state
     * 3) Cells-count or cells-size has changed, making previous scroll offsets invalid
     */
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.cellCount === 0 &&
            (prevState.scrollLeft !== 0 || prevState.scrollTop !== 0)) {
            return {
                scrollLeft: 0,
                scrollTop: 0,
                scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.REQUESTED,
            };
        }
        else if (nextProps.scrollLeft !== prevState.scrollLeft ||
            nextProps.scrollTop !== prevState.scrollTop) {
            return {
                scrollLeft: nextProps.scrollLeft != null
                    ? nextProps.scrollLeft
                    : prevState.scrollLeft,
                scrollTop: nextProps.scrollTop != null
                    ? nextProps.scrollTop
                    : prevState.scrollTop,
                scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.REQUESTED,
            };
        }
        return null;
    }
    componentDidMount() {
        const { cellLayoutManager, scrollLeft, scrollToCell, scrollTop } = this
            .props;
        // If this component was first rendered server-side, scrollbar size will be undefined.
        // In that event we need to remeasure.
        if (!this._scrollbarSizeMeasured) {
            this._scrollbarSize = (0, scrollbarSize_1.default)();
            this._scrollbarSizeMeasured = true;
            this.setState({});
        }
        if (scrollToCell >= 0) {
            this._updateScrollPositionForScrollToCell();
        }
        else if (scrollLeft >= 0 || scrollTop >= 0) {
            this._setScrollPosition({
                scrollLeft,
                scrollTop,
            });
        }
        // Update onSectionRendered callback.
        this._invokeOnSectionRenderedHelper();
        const { height: totalHeight, width: totalWidth } = cellLayoutManager.getTotalSize();
        // Initialize onScroll callback.
        this._invokeOnScrollMemoizer({
            scrollLeft: scrollLeft || 0,
            scrollTop: scrollTop || 0,
            totalHeight,
            totalWidth,
        });
    }
    componentDidUpdate(prevProps, prevState) {
        const { height, scrollToAlignment, scrollToCell, width } = this
            .props;
        const { scrollLeft, scrollPositionChangeReason, scrollTop } = this
            .state;
        // Make sure requested changes to :scrollLeft or :scrollTop get applied.
        // Assigning to scrollLeft/scrollTop tells the browser to interrupt any running scroll animations,
        // And to discard any pending async changes to the scroll position that may have happened in the meantime (e.g. on a separate scrolling thread).
        // So we only set these when we require an adjustment of the scroll position.
        // See issue #2 for more information.
        if (scrollPositionChangeReason ===
            SCROLL_POSITION_CHANGE_REASONS.REQUESTED) {
            if (scrollLeft >= 0 &&
                scrollLeft !== prevState.scrollLeft &&
                scrollLeft !== this._scrollingContainer.scrollLeft) {
                this._scrollingContainer.scrollLeft = scrollLeft;
            }
            if (scrollTop >= 0 &&
                scrollTop !== prevState.scrollTop &&
                scrollTop !== this._scrollingContainer.scrollTop) {
                this._scrollingContainer.scrollTop = scrollTop;
            }
        }
        // Update scroll offsets if the current :scrollToCell values requires it
        if (height !== prevProps.height ||
            scrollToAlignment !== prevProps.scrollToAlignment ||
            scrollToCell !== prevProps.scrollToCell ||
            width !== prevProps.width) {
            this._updateScrollPositionForScrollToCell();
        }
        // Update onRowsRendered callback if start/stop indices have changed
        this._invokeOnSectionRenderedHelper();
    }
    componentWillUnmount() {
        if (this._disablePointerEventsTimeoutId) {
            clearTimeout(this._disablePointerEventsTimeoutId);
        }
    }
    render() {
        const { autoHeight, cellCount, cellLayoutManager, className, height, horizontalOverscanSize, id, noContentRenderer, style, verticalOverscanSize, width, } = this.props;
        const { isScrolling, scrollLeft, scrollTop } = this.state;
        // Memoization reset
        if (this._lastRenderedCellCount !== cellCount ||
            this._lastRenderedCellLayoutManager !== cellLayoutManager ||
            this._calculateSizeAndPositionDataOnNextUpdate) {
            this._lastRenderedCellCount = cellCount;
            this._lastRenderedCellLayoutManager = cellLayoutManager;
            this._calculateSizeAndPositionDataOnNextUpdate = false;
            cellLayoutManager.calculateSizeAndPositionData();
        }
        const { height: totalHeight, width: totalWidth } = cellLayoutManager.getTotalSize();
        // Safely expand the rendered area by the specified overscan amount
        const left = Math.max(0, scrollLeft - horizontalOverscanSize);
        const top = Math.max(0, scrollTop - verticalOverscanSize);
        const right = Math.min(totalWidth, scrollLeft + width + horizontalOverscanSize);
        const bottom = Math.min(totalHeight, scrollTop + height + verticalOverscanSize);
        const childrenToDisplay = height > 0 && width > 0
            ? cellLayoutManager.cellRenderers({
                height: bottom - top,
                isScrolling,
                width: right - left,
                x: left,
                y: top,
            })
            : [];
        const collectionStyle = {
            boxSizing: "border-box",
            direction: "ltr",
            height: autoHeight ? "auto" : height,
            position: "relative",
            WebkitOverflowScrolling: "touch",
            width,
            willChange: "transform",
        };
        // Force browser to hide scrollbars when we know they aren't necessary.
        // Otherwise once scrollbars appear they may not disappear again.
        // For more info see issue #116
        const verticalScrollBarSize = totalHeight > height ? this._scrollbarSize : 0;
        const horizontalScrollBarSize = totalWidth > width ? this._scrollbarSize : 0;
        // Also explicitly init styles to 'auto' if scrollbars are required.
        // This works around an obscure edge case where external CSS styles have not yet been loaded,
        // But an initial scroll index of offset is set as an external prop.
        // Without this style, Grid would render the correct range of cells but would NOT update its internal offset.
        // This was originally reported via clauderic/react-infinite-calendar/issues/23
        collectionStyle.overflowX =
            totalWidth + verticalScrollBarSize <= width ? "hidden" : "auto";
        collectionStyle.overflowY =
            totalHeight + horizontalScrollBarSize <= height ? "hidden" : "auto";
        let ariaLabel = this.props["aria-label"] ?? "";
        return (React.createElement("div", { ref: this._setScrollingContainerRef, "aria-label": ariaLabel, className: "ReactVirtualized__Collection", id: id, onScroll: this._onScroll, role: "grid", style: { ...collectionStyle, ...style }, tabIndex: 0 },
            React.createElement(React.Fragment, null,
                cellCount > 0 && (React.createElement("div", { className: "ReactVirtualized__Collection__innerScrollContainer", style: {
                        height: totalHeight,
                        maxHeight: totalHeight,
                        maxWidth: totalWidth,
                        overflow: "hidden",
                        pointerEvents: isScrolling ? "none" : "auto",
                        width: totalWidth,
                    } }, childrenToDisplay)),
                cellCount === 0 && noContentRenderer())));
    }
    /* ---------------------------- Helper methods ---------------------------- */
    /**
     * Sets an :isScrolling flag for a small window of time.
     * This flag is used to disable pointer events on the scrollable portion of the Collection.
     * This prevents jerky/stuttery mouse-wheel scrolling.
     */
    _enablePointerEventsAfterDelay() {
        if (this._disablePointerEventsTimeoutId) {
            clearTimeout(this._disablePointerEventsTimeoutId);
        }
        this._disablePointerEventsTimeoutId = setTimeout(() => {
            const { isScrollingChange } = this.props;
            isScrollingChange(false);
            this._disablePointerEventsTimeoutId = null;
            this.setState({
                isScrolling: false,
            });
        }, IS_SCROLLING_TIMEOUT);
    }
    _invokeOnSectionRenderedHelper = () => {
        const { cellLayoutManager, onSectionRendered } = this.props;
        this._onSectionRenderedMemoizer({
            callback: onSectionRendered,
            indices: {
                indices: cellLayoutManager.getLastRenderedIndices(),
            },
        });
    };
    _invokeOnScrollMemoizer({ scrollLeft, scrollTop, totalHeight, totalWidth, }) {
        this._onScrollMemoizer({
            callback: ({ scrollLeft, scrollTop }) => {
                const { height, onScroll, width } = this.props;
                onScroll({
                    clientHeight: height,
                    clientWidth: width,
                    scrollHeight: totalHeight,
                    scrollLeft,
                    scrollTop,
                    scrollWidth: totalWidth,
                });
            },
            indices: {
                scrollLeft,
                scrollTop,
            },
        });
    }
    _setScrollingContainerRef = (ref) => {
        this._scrollingContainer = ref;
    };
    _setScrollPosition({ scrollLeft, scrollTop }) {
        const newState = {
            scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.REQUESTED,
        };
        if (scrollLeft >= 0) {
            newState.scrollLeft = scrollLeft;
        }
        if (scrollTop >= 0) {
            newState.scrollTop = scrollTop;
        }
        if ((scrollLeft >= 0 && scrollLeft !== this.state.scrollLeft) ||
            (scrollTop >= 0 && scrollTop !== this.state.scrollTop)) {
            this.setState(newState);
        }
    }
    _updateScrollPositionForScrollToCell = () => {
        const { cellLayoutManager, height, scrollToAlignment, scrollToCell, width, } = this.props;
        const { scrollLeft, scrollTop } = this.state;
        if (scrollToCell >= 0) {
            const scrollPosition = cellLayoutManager.getScrollPositionForCell({
                align: scrollToAlignment,
                cellIndex: scrollToCell,
                height,
                scrollLeft,
                scrollTop,
                width,
            });
            if (scrollPosition.scrollLeft !== scrollLeft ||
                scrollPosition.scrollTop !== scrollTop) {
                this._setScrollPosition(scrollPosition);
            }
        }
    };
    _onScroll = (event) => {
        // In certain edge-cases React dispatches an onScroll event with an invalid target.scrollLeft / target.scrollTop.
        // This invalid event can be detected by comparing event.target to this component's scrollable DOM element.
        // See issue #404 for more information.
        if (event.target !== this._scrollingContainer) {
            return;
        }
        // Prevent pointer events from interrupting a smooth scroll
        this._enablePointerEventsAfterDelay();
        // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
        // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
        // This causes a series of rapid renders that is slow for long lists.
        // We can avoid that by doing some simple bounds checking to ensure that scrollTop never exceeds the total height.
        const { cellLayoutManager, height, isScrollingChange, width } = this
            .props;
        const scrollbarSize = this._scrollbarSize;
        const { height: totalHeight, width: totalWidth } = cellLayoutManager.getTotalSize();
        const scrollLeft = Math.max(0, Math.min(totalWidth - width + scrollbarSize, event.target.scrollLeft));
        const scrollTop = Math.max(0, Math.min(totalHeight - height + scrollbarSize, event.target.scrollTop));
        // Certain devices (like Apple touchpad) rapid-fire duplicate events.
        // Don't force a re-render if this is the case.
        // The mouse may move faster then the animation frame does.
        // Use requestAnimationFrame to avoid over-updating.
        if (this.state.scrollLeft !== scrollLeft ||
            this.state.scrollTop !== scrollTop) {
            // Browsers with cancelable scroll events (eg. Firefox) interrupt scrolling animations if scrollTop/scrollLeft is set.
            // Other browsers (eg. Safari) don't scroll as well without the help under certain conditions (DOM or style changes during scrolling).
            // All things considered, this seems to be the best current work around that I'm aware of.
            // For more information see https://github.com/bvaughn/react-virtualized/pull/124
            const scrollPositionChangeReason = event.cancelable
                ? SCROLL_POSITION_CHANGE_REASONS.OBSERVED
                : SCROLL_POSITION_CHANGE_REASONS.REQUESTED;
            // Synchronously set :isScrolling the first time (since _setNextState will reschedule its animation frame each time it's called)
            if (!this.state.isScrolling) {
                isScrollingChange(true);
            }
            this.setState({
                isScrolling: true,
                scrollLeft,
                scrollPositionChangeReason,
                scrollTop,
            });
        }
        this._invokeOnScrollMemoizer({
            scrollLeft,
            scrollTop,
            totalWidth,
            totalHeight,
        });
    };
}
exports.default = CollectionView;
//# sourceMappingURL=CollectionView.js.map