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
const defaultHeaderRenderer_1 = __importDefault(require("./defaultHeaderRenderer"));
const defaultCellRenderer_1 = __importDefault(require("./defaultCellRenderer"));
const defaultCellDataGetter_1 = __importDefault(require("./defaultCellDataGetter"));
const SortDirection_1 = __importDefault(require("./SortDirection"));
/**
 * Describes the header and cell contents of a table column.
 */
class Column extends React.Component {
    static propTypes = {
        /** Optional aria-label value to set on the column header */
        'aria-label': prop_types_1.default.string,
        /**
         * Callback responsible for returning a cell's data, given its :dataKey
         * ({ columnData: any, dataKey: string, rowData: any }): any
         */
        cellDataGetter: prop_types_1.default.func,
        /**
         * Callback responsible for rendering a cell's contents.
         * ({ cellData: any, columnData: any, dataKey: string, rowData: any, rowIndex: number }): node
         */
        cellRenderer: prop_types_1.default.func,
        /** Optional CSS class to apply to cell */
        className: prop_types_1.default.string,
        /** Optional additional data passed to this column's :cellDataGetter */
        columnData: prop_types_1.default.object,
        /** Uniquely identifies the row-data attribute corresponding to this cell */
        dataKey: prop_types_1.default.any.isRequired,
        /** Optional direction to be used when clicked the first time */
        defaultSortDirection: prop_types_1.default.oneOf([SortDirection_1.default.ASC, SortDirection_1.default.DESC]),
        /** If sort is enabled for the table at large, disable it for this column */
        disableSort: prop_types_1.default.bool,
        /** Flex grow style; defaults to 0 */
        flexGrow: prop_types_1.default.number,
        /** Flex shrink style; defaults to 1 */
        flexShrink: prop_types_1.default.number,
        /** Optional CSS class to apply to this column's header */
        headerClassName: prop_types_1.default.string,
        /**
         * Optional callback responsible for rendering a column header contents.
         * ({ columnData: object, dataKey: string, disableSort: boolean, label: node, sortBy: string, sortDirection: string }): PropTypes.node
         */
        headerRenderer: prop_types_1.default.func.isRequired,
        /** Optional inline style to apply to this column's header */
        headerStyle: prop_types_1.default.object,
        /** Optional id to set on the column header */
        id: prop_types_1.default.string,
        /** Header label for this column */
        label: prop_types_1.default.node,
        /** Maximum width of column; this property will only be used if :flexGrow is > 0. */
        maxWidth: prop_types_1.default.number,
        /** Minimum width of column. */
        minWidth: prop_types_1.default.number,
        /** Optional inline style to apply to cell */
        style: prop_types_1.default.object,
        /** Flex basis (width) for this column; This value can grow or shrink based on :flexGrow and :flexShrink properties. */
        width: prop_types_1.default.number.isRequired
    };
    static defaultProps = {
        cellDataGetter: defaultCellDataGetter_1.default,
        cellRenderer: defaultCellRenderer_1.default,
        defaultSortDirection: SortDirection_1.default.ASC,
        flexGrow: 0,
        flexShrink: 1,
        headerRenderer: defaultHeaderRenderer_1.default,
        style: {}
    };
}
exports.default = Column;
