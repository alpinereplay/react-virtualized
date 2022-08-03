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
const CollectionView_1 = __importDefault(require("./CollectionView"));
const calculateSizeAndPositionData_1 = __importDefault(require("./utils/calculateSizeAndPositionData"));
const getUpdatedOffsetForIndex_1 = __importDefault(require("../utils/getUpdatedOffsetForIndex"));
/**
 * Renders scattered or non-linear data.
 * Unlike Grid, which renders checkerboard data, Collection can render arbitrarily positioned- even overlapping- data.
 */
class Collection extends React.PureComponent {
    static propTypes = {
        "aria-label": prop_types_1.default.string,
        /**
         * Number of cells in Collection.
         */
        cellCount: prop_types_1.default.number.isRequired,
        /**
         * Responsible for rendering a group of cells given their indices.
         * Should implement the following interface: ({
         *   cellSizeAndPositionGetter:Function,
         *   indices: Array<number>,
         *   cellRenderer: Function
         * }): Array<PropTypes.node>
         */
        cellGroupRenderer: prop_types_1.default.func.isRequired,
        /**
         * Responsible for rendering a cell given an row and column index.
         * Should implement the following interface: ({ index: number, key: string, style: object }): PropTypes.element
         */
        cellRenderer: prop_types_1.default.func.isRequired,
        /**
         * Callback responsible for returning size and offset/position information for a given cell (index).
         * ({ index: number }): { height: number, width: number, x: number, y: number }
         */
        cellSizeAndPositionGetter: prop_types_1.default.func.isRequired,
        /**
         * Optionally override the size of the sections a Collection's cells are split into.
         */
        sectionSize: prop_types_1.default.number,
    };
    static defaultProps = {
        "aria-label": "grid",
        cellGroupRenderer: defaultCellGroupRenderer,
    };
    _cellMetadata = [];
    _lastRenderedCellIndices = [];
    _cellCache = [];
    _collectionView;
    _sectionManager;
    _width;
    _height;
    constructor(props, context) {
        super(props, context);
        this._cellMetadata = [];
        this._lastRenderedCellIndices = [];
        // Cell cache during scroll (for performance)
        this._cellCache = [];
        this._isScrollingChange = this._isScrollingChange.bind(this);
        this._setCollectionViewRef = this._setCollectionViewRef.bind(this);
    }
    forceUpdate() {
        if (this._collectionView !== undefined) {
            this._collectionView.forceUpdate();
        }
    }
    /** See Collection#recomputeCellSizesAndPositions */
    recomputeCellSizesAndPositions() {
        this._cellCache = [];
        this._collectionView.recomputeCellSizesAndPositions();
    }
    /** React lifecycle methods */
    render() {
        const { ...props } = this.props;
        return (React.createElement(CollectionView_1.default, { cellCount: props.cellCount, height: props.height, width: props.width, cellLayoutManager: this, isScrollingChange: this._isScrollingChange, ref: this._setCollectionViewRef, ...props }));
    }
    /** CellLayoutManager interface */
    calculateSizeAndPositionData() {
        const { cellCount, cellSizeAndPositionGetter, sectionSize } = this
            .props;
        const data = (0, calculateSizeAndPositionData_1.default)({
            cellCount,
            cellSizeAndPositionGetter,
            sectionSize,
        });
        this._cellMetadata = data.cellMetadata;
        this._sectionManager = data.sectionManager;
        this._height = data.height;
        this._width = data.width;
    }
    /**
     * Returns the most recently rendered set of cell indices.
     */
    getLastRenderedIndices() {
        return this._lastRenderedCellIndices;
    }
    /**
     * Calculates the minimum amount of change from the current scroll position to ensure the specified cell is (fully) visible.
     */
    getScrollPositionForCell({ align, cellIndex, height, scrollLeft, scrollTop, width, }) {
        const { cellCount } = this.props;
        if (cellIndex >= 0 && cellIndex < cellCount) {
            const cellMetadata = this._cellMetadata[cellIndex];
            scrollLeft = (0, getUpdatedOffsetForIndex_1.default)({
                align,
                cellOffset: cellMetadata.x,
                cellSize: cellMetadata.width,
                containerSize: width,
                currentOffset: scrollLeft,
                targetIndex: cellIndex,
            });
            scrollTop = (0, getUpdatedOffsetForIndex_1.default)({
                align,
                cellOffset: cellMetadata.y,
                cellSize: cellMetadata.height,
                containerSize: height,
                currentOffset: scrollTop,
                targetIndex: cellIndex,
            });
        }
        return {
            scrollLeft,
            scrollTop,
        };
    }
    getTotalSize() {
        return {
            height: this._height,
            width: this._width,
        };
    }
    cellRenderers({ height, isScrolling, width, x, y }) {
        const { cellGroupRenderer, cellRenderer } = this.props;
        // Store for later calls to getLastRenderedIndices()
        this._lastRenderedCellIndices = this._sectionManager.getCellIndices({
            height,
            width,
            x,
            y,
        });
        return cellGroupRenderer({
            cellCache: this._cellCache,
            cellRenderer,
            cellSizeAndPositionGetter: ({ index }) => this._sectionManager.getCellMetadata({
                index,
            }),
            indices: this._lastRenderedCellIndices,
            isScrolling,
        });
    }
    _isScrollingChange(isScrolling) {
        if (!isScrolling) {
            this._cellCache = [];
        }
    }
    _setCollectionViewRef(ref) {
        this._collectionView = ref;
    }
}
exports.default = Collection;
function defaultCellGroupRenderer({ cellCache, cellRenderer, cellSizeAndPositionGetter, indices, isScrolling, }) {
    return indices
        .map((index) => {
        const cellMetadata = cellSizeAndPositionGetter({
            index,
        });
        let cellRendererProps = {
            index,
            isScrolling,
            key: index,
            style: {
                height: cellMetadata.height,
                left: cellMetadata.x,
                position: "absolute",
                top: cellMetadata.y,
                width: cellMetadata.width,
            },
        };
        // Avoid re-creating cells while scrolling.
        // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
        // If a scroll is in progress- cache and reuse cells.
        // This cache will be thrown away once scrolling complets.
        if (isScrolling) {
            if (!(index in cellCache)) {
                cellCache[index] = cellRenderer(cellRendererProps);
            }
            return cellCache[index];
        }
        else {
            return cellRenderer(cellRendererProps);
        }
    })
        .filter((renderedCell) => !!renderedCell);
}
