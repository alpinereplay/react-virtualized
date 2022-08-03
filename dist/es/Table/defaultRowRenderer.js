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
/**
 * Default row renderer for Table.
 */
function defaultRowRenderer({ className, columns, index, key, onRowClick, onRowDoubleClick, onRowMouseOut, onRowMouseOver, onRowRightClick, rowData, style, }) {
    const a11yProps = {
        "aria-rowindex": index + 1,
    };
    if (onRowClick ||
        onRowDoubleClick ||
        onRowMouseOut ||
        onRowMouseOver ||
        onRowRightClick) {
        a11yProps["aria-label"] = "row";
        a11yProps.tabIndex = 0;
        if (onRowClick) {
            a11yProps.onClick = (event) => onRowClick({
                event,
                index,
                rowData,
            });
        }
        if (onRowDoubleClick) {
            a11yProps.onDoubleClick = (event) => onRowDoubleClick({
                event,
                index,
                rowData,
            });
        }
        if (onRowMouseOut) {
            a11yProps.onMouseOut = (event) => onRowMouseOut({
                event,
                index,
                rowData,
            });
        }
        if (onRowMouseOver) {
            a11yProps.onMouseOver = (event) => onRowMouseOver({
                event,
                index,
                rowData,
            });
        }
        if (onRowRightClick) {
            a11yProps.onContextMenu = (event) => onRowRightClick({
                event,
                index,
                rowData,
            });
        }
    }
    return (React.createElement("div", { ...a11yProps, className: className, key: key, role: "row", style: style }, columns));
}
exports.default = defaultRowRenderer;
//# sourceMappingURL=defaultRowRenderer.js.map