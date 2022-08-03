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
/**
 * High-order component that auto-calculates column-widths for `Grid` cells.
 */
class ColumnSizer extends React.PureComponent {
    static propTypes = {
        /**
         * Function responsible for rendering a virtualized Grid.
         * This function should implement the following signature:
         * ({ adjustedWidth, getColumnWidth, registerChild }) => PropTypes.element
         *
         * The specified :getColumnWidth function should be passed to the Grid's :columnWidth property.
         * The :registerChild should be passed to the Grid's :ref property.
         * The :adjustedWidth property is optional; it reflects the lesser of the overall width or the width of all columns.
         */
        children: prop_types_1.default.func.isRequired,
        /** Optional maximum allowed column width */
        columnMaxWidth: prop_types_1.default.number,
        /** Optional minimum allowed column width */
        columnMinWidth: prop_types_1.default.number,
        /** Number of columns in Grid or Table child */
        columnCount: prop_types_1.default.number.isRequired,
        /** Width of Grid or Table child */
        width: prop_types_1.default.number.isRequired,
    };
    _registeredChild;
    constructor(props, context) {
        super(props, context);
        this._registerChild = this._registerChild.bind(this);
    }
    componentDidUpdate(prevProps) {
        const { columnMaxWidth, columnMinWidth, columnCount, width } = this
            .props;
        if (columnMaxWidth !== prevProps.columnMaxWidth ||
            columnMinWidth !== prevProps.columnMinWidth ||
            columnCount !== prevProps.columnCount ||
            width !== prevProps.width) {
            if (this._registeredChild) {
                this._registeredChild.recomputeGridSize();
            }
        }
    }
    render() {
        const { children, columnMaxWidth, columnMinWidth, columnCount, width } = this.props;
        const safeColumnMinWidth = columnMinWidth || 1;
        const safeColumnMaxWidth = columnMaxWidth
            ? Math.min(columnMaxWidth, width)
            : width;
        let columnWidth = width / columnCount;
        columnWidth = Math.max(safeColumnMinWidth, columnWidth);
        columnWidth = Math.min(safeColumnMaxWidth, columnWidth);
        columnWidth = Math.floor(columnWidth);
        let adjustedWidth = Math.min(width, columnWidth * columnCount);
        return children({
            adjustedWidth,
            columnWidth,
            getColumnWidth: () => columnWidth,
            registerChild: this._registerChild,
        });
    }
    _registerChild(child) {
        if (child && typeof child.recomputeGridSize !== "function") {
            throw Error("Unexpected child type registered; only Grid/MultiGrid children are supported.");
        }
        this._registeredChild = child;
        if (this._registeredChild) {
            this._registeredChild.recomputeGridSize();
        }
    }
}
exports.default = ColumnSizer;
//# sourceMappingURL=ColumnSizer.js.map