"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A section of the Window.
 * Window Sections are used to group nearby cells.
 * This enables us to more quickly determine which cells to display in a given region of the Window.
 * Sections have a fixed size and contain 0 to many cells (tracked by their indices).
 */
class Section {
    height;
    width;
    x;
    y;
    _indexMap;
    _indices;
    constructor({ height, width, x, y }) {
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this._indexMap = {};
        this._indices = [];
    }
    /** Add a cell to this section. */
    addCellIndex({ index }) {
        if (!this._indexMap[index]) {
            this._indexMap[index] = true;
            this._indices.push(index);
        }
    }
    /** Get all cell indices that have been added to this section. */
    getCellIndices() {
        return this._indices;
    }
    /** Intended for debugger/test purposes only */
    toString() {
        return `${this.x},${this.y} ${this.width}x${this.height}`;
    }
}
exports.default = Section;
//# sourceMappingURL=Section.js.map