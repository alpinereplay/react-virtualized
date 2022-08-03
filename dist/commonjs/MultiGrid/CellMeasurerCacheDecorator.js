"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Caches measurements for a given cell.
 */
class CellMeasurerCacheDecorator {
    _cellMeasurerCache;
    _columnIndexOffset;
    _rowIndexOffset;
    constructor(params = {
        cellMeasurerCache: undefined,
        columnIndexOffset: 0,
        rowIndexOffset: 0,
    }) {
        const { cellMeasurerCache, columnIndexOffset = 0, rowIndexOffset = 0, } = params;
        this._cellMeasurerCache = cellMeasurerCache;
        this._columnIndexOffset = columnIndexOffset;
        this._rowIndexOffset = rowIndexOffset;
    }
    clear(rowIndex, columnIndex) {
        this._cellMeasurerCache?.clear(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset);
    }
    clearAll() {
        this._cellMeasurerCache?.clearAll();
    }
    columnWidth = ({ index }) => {
        this._cellMeasurerCache?.columnWidth({
            index: index + this._columnIndexOffset,
        });
    };
    get defaultHeight() {
        return this._cellMeasurerCache?.defaultHeight ?? 0;
    }
    get defaultWidth() {
        return this._cellMeasurerCache?.defaultWidth ?? 0;
    }
    hasFixedHeight() {
        return this._cellMeasurerCache?.hasFixedHeight() ?? false;
    }
    hasFixedWidth() {
        return this._cellMeasurerCache?.hasFixedWidth() ?? false;
    }
    getHeight(rowIndex, columnIndex = 0) {
        let cio = this._columnIndexOffset ?? 0;
        let ci = columnIndex ?? 0;
        return this._cellMeasurerCache?.getHeight(rowIndex + this._rowIndexOffset, ci + cio);
    }
    getWidth(rowIndex, columnIndex = 0) {
        let cio = this._columnIndexOffset ?? 0;
        let ci = columnIndex ?? 0;
        return this._cellMeasurerCache?.getWidth(rowIndex + this._rowIndexOffset, ci + cio);
    }
    has(rowIndex, columnIndex = 0) {
        let cio = this._columnIndexOffset ?? 0;
        let ci = columnIndex ?? 0;
        return (this._cellMeasurerCache?.has(rowIndex + this._rowIndexOffset, ci + cio) ?? false);
    }
    rowHeight = ({ index }) => {
        this._cellMeasurerCache?.rowHeight({
            index: index + this._rowIndexOffset,
        });
    };
    set(rowIndex, columnIndex, width, height) {
        this._cellMeasurerCache?.set(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset, width, height);
    }
}
exports.default = CellMeasurerCacheDecorator;
//# sourceMappingURL=CellMeasurerCacheDecorator.js.map