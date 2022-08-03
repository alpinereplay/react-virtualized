"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intervalTree_1 = require("../vendor/intervalTree");
//   O(log(n)) lookup of cells to render for a given viewport size
//   O(1) lookup of shortest measured column (so we know when to enter phase 1)
class PositionCache {
    // Tracks the height of each column
    _columnSizeMap = {};
    // Store tops and bottoms of each cell for fast intersection lookup.
    _intervalTree = (0, intervalTree_1.createIntervalTree)([]);
    // Maps cell index to x coordinates for quick lookup.
    _leftMap = {};
    estimateTotalHeight(cellCount, columnCount, defaultCellHeight) {
        const unmeasuredCellCount = cellCount - this.count;
        return (this.tallestColumnSize +
            Math.ceil(unmeasuredCellCount / columnCount) * defaultCellHeight);
    }
    // Render all cells visible within the viewport range defined.
    range(scrollTop, clientHeight, renderCallback) {
        if (this._intervalTree) {
            this._intervalTree.queryInterval(scrollTop, scrollTop + clientHeight, ([top, _, index]) => {
                return renderCallback(index, this._leftMap[index], top);
            });
        }
    }
    setPosition(index, left, top, height) {
        if (this._intervalTree) {
            this._intervalTree.insert([top, top + height, index]);
        }
        this._leftMap[index] = left;
        const columnSizeMap = this._columnSizeMap;
        const columnHeight = columnSizeMap[left];
        if (columnHeight === undefined) {
            columnSizeMap[left] = top + height;
        }
        else {
            columnSizeMap[left] = Math.max(columnHeight, top + height);
        }
    }
    get count() {
        if (this._intervalTree) {
            return this._intervalTree.count;
        }
        return 0;
    }
    get shortestColumnSize() {
        const columnSizeMap = this._columnSizeMap;
        let size = 0;
        for (let i in columnSizeMap) {
            let height = columnSizeMap[i];
            size = size === 0 ? height : Math.min(size, height);
        }
        return size;
    }
    get tallestColumnSize() {
        const columnSizeMap = this._columnSizeMap;
        let size = 0;
        for (let i in columnSizeMap) {
            let height = columnSizeMap[i];
            size = Math.max(size, height);
        }
        return size;
    }
}
exports.default = PositionCache;
