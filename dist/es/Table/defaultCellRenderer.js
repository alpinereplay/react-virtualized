"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default cell renderer that displays an attribute as a simple string
 * You should override the column's cellRenderer if your data is some other type of object.
 */
function defaultCellRenderer({ cellData }) {
    if (cellData == null) {
        return '';
    }
    else {
        return String(cellData);
    }
}
exports.default = defaultCellRenderer;
//# sourceMappingURL=defaultCellRenderer.js.map