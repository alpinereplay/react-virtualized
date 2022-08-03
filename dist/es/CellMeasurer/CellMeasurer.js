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
const React = __importStar(require("react"));
const react_dom_1 = require("react-dom");
/**
 * Wraps a cell and measures its rendered content.
 * Measurements are stored in a per-cell cache.
 * Cached-content is not be re-measured.
 */
class CellMeasurer extends React.PureComponent {
    static __internalCellMeasurerFlag = false;
    _child;
    componentDidMount() {
        this._maybeMeasureCell();
    }
    componentDidUpdate() {
        this._maybeMeasureCell();
    }
    render() {
        const { children } = this.props;
        return typeof children === "function"
            ? children({
                measure: this._measure,
                registerChild: this._registerChild,
            })
            : children;
    }
    _getCellMeasurements() {
        const { cache } = this.props;
        const node = this._child || (0, react_dom_1.findDOMNode)(this);
        // TODO Check for a bad combination of fixedWidth and missing numeric width or vice versa with height
        if (node &&
            node.ownerDocument &&
            node.ownerDocument.defaultView &&
            node instanceof node.ownerDocument.defaultView.HTMLElement) {
            const styleWidth = node.style.width;
            const styleHeight = node.style.height;
            // If we are re-measuring a cell that has already been measured,
            // It will have a hard-coded width/height from the previous measurement.
            // The fact that we are measuring indicates this measurement is probably stale,
            // So explicitly clear it out (eg set to "auto") so we can recalculate.
            // See issue #593 for more info.
            // Even if we are measuring initially- if we're inside of a MultiGrid component,
            // Explicitly clear width/height before measuring to avoid being tainted by another Grid.
            // eg top/left Grid renders before bottom/right Grid
            // Since the CellMeasurerCache is shared between them this taints derived cell size values.
            if (!cache.hasFixedWidth()) {
                node.style.width = "auto";
            }
            if (!cache.hasFixedHeight()) {
                node.style.height = "auto";
            }
            const height = Math.ceil(node.offsetHeight);
            const width = Math.ceil(node.offsetWidth);
            // Reset after measuring to avoid breaking styles; see #660
            if (styleWidth) {
                node.style.width = styleWidth;
            }
            if (styleHeight) {
                node.style.height = styleHeight;
            }
            return {
                height,
                width,
            };
        }
        else {
            return {
                height: 0,
                width: 0,
            };
        }
    }
    _maybeMeasureCell() {
        const { cache, columnIndex = 0, parent, rowIndex = this.props.index || 0, } = this.props;
        if (!cache.has(rowIndex, columnIndex)) {
            const { height, width } = this._getCellMeasurements();
            cache.set(rowIndex, columnIndex, width, height);
            // If size has changed, let Grid know to re-render.
            if (parent &&
                typeof parent.invalidateCellSizeAfterRender === "function") {
                parent.invalidateCellSizeAfterRender({
                    columnIndex,
                    rowIndex,
                });
            }
        }
    }
    _measure = () => {
        const { cache, columnIndex = 0, parent, rowIndex = this.props.index || 0, } = this.props;
        const { height, width } = this._getCellMeasurements();
        if (height !== cache.getHeight(rowIndex, columnIndex) ||
            width !== cache.getWidth(rowIndex, columnIndex)) {
            cache.set(rowIndex, columnIndex, width, height);
            if (parent && typeof parent.recomputeGridSize === "function") {
                parent.recomputeGridSize({
                    columnIndex,
                    rowIndex,
                });
            }
        }
    };
    _registerChild = (element) => {
        if (element && !(element instanceof Element)) {
            console.warn("CellMeasurer registerChild expects to be passed Element or null");
        }
        this._child = element;
        if (element) {
            this._maybeMeasureCell();
        }
    };
} // Used for DEV mode warning check
exports.default = CellMeasurer;
if (process.env.NODE_ENV !== "production") {
    CellMeasurer.__internalCellMeasurerFlag = true;
}
