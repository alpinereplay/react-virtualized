"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCROLL_DIRECTION_VERTICAL = exports.SCROLL_DIRECTION_HORIZONTAL = exports.SCROLL_DIRECTION_FORWARD = exports.SCROLL_DIRECTION_BACKWARD = void 0;
exports.SCROLL_DIRECTION_BACKWARD = -1;
exports.SCROLL_DIRECTION_FORWARD = 1;
exports.SCROLL_DIRECTION_HORIZONTAL = 'horizontal';
exports.SCROLL_DIRECTION_VERTICAL = 'vertical';
/**
 * Calculates the number of cells to overscan before and after a specified range.
 * This function ensures that overscanning doesn't exceed the available cells.
 */
function defaultOverscanIndicesGetter({ cellCount, overscanCellsCount, scrollDirection, startIndex, stopIndex }) {
    if (scrollDirection === exports.SCROLL_DIRECTION_FORWARD) {
        return {
            overscanStartIndex: Math.max(0, startIndex),
            overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
        };
    }
    else {
        return {
            overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
            overscanStopIndex: Math.min(cellCount - 1, stopIndex)
        };
    }
}
exports.default = defaultOverscanIndicesGetter;
