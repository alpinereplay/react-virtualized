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
Object.defineProperty(exports, "__esModule", { value: true });
const Grid_1 = __importStar(require("../Grid"));
const React = __importStar(require("react"));
class List extends React.PureComponent {
    static defaultProps = {
        autoHeight: false,
        estimatedRowSize: 30,
        onScroll: () => { },
        noRowsRenderer: () => null,
        onRowsRendered: () => { },
        overscanIndicesGetter: Grid_1.accessibilityOverscanIndicesGetter,
        overscanRowCount: 10,
        scrollToAlignment: "auto",
        scrollToIndex: -1,
        style: {},
    };
    Grid;
    forceUpdateGrid() {
        if (this.Grid) {
            this.Grid.forceUpdate();
        }
    }
    /** See Grid#getOffsetForCell */
    getOffsetForRow({ alignment, index, }) {
        if (this.Grid) {
            const { scrollTop } = this.Grid.getOffsetForCell({
                alignment,
                rowIndex: index,
                columnIndex: 0,
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
                columnIndex: 0,
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
    render() {
        const { className, noRowsRenderer, scrollToIndex, width } = this.props;
        let classNames = "ReactVirtualized__List";
        if (className) {
            classNames += ` ${className}`;
        }
        return (React.createElement(Grid_1.default, { ...this.props, autoContainerWidth: true, cellRenderer: this._cellRenderer, className: classNames, columnWidth: width, columnCount: 1, noContentRenderer: noRowsRenderer, onScroll: this._onScroll, onSectionRendered: this._onSectionRendered, ref: this._setRef, scrollToRow: scrollToIndex }));
    }
    _cellRenderer = ({ parent, rowIndex, style, isScrolling, isVisible, key, }) => {
        const { rowRenderer } = this.props;
        // TRICKY The style object is sometimes cached by Grid.
        // This prevents new style objects from bypassing shallowCompare().
        // However as of React 16, style props are auto-frozen (at least in dev mode)
        // Check to make sure we can still modify the style before proceeding.
        // https://github.com/facebook/react/commit/977357765b44af8ff0cfea327866861073095c12#commitcomment-20648713
        const widthDescriptor = Object.getOwnPropertyDescriptor(style, "width");
        if (widthDescriptor && widthDescriptor.writable) {
            // By default, List cells should be 100% width.
            // This prevents them from flowing under a scrollbar (if present).
            style.width = "100%";
        }
        return rowRenderer({
            index: rowIndex,
            style,
            isScrolling,
            isVisible,
            key,
            parent,
        });
    };
    _setRef = (ref) => {
        this.Grid = ref;
    };
    _onScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
        const { onScroll } = this.props;
        onScroll({
            clientHeight,
            scrollHeight,
            scrollTop,
        });
    };
    _onSectionRendered = ({ rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex, }) => {
        const { onRowsRendered } = this.props;
        onRowsRendered({
            overscanStartIndex: rowOverscanStartIndex,
            overscanStopIndex: rowOverscanStopIndex,
            startIndex: rowStartIndex,
            stopIndex: rowStopIndex,
        });
    };
}
exports.default = List;
