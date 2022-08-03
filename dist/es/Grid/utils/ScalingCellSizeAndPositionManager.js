"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CellSizeAndPositionManager_1 = __importDefault(require("./CellSizeAndPositionManager"));
const maxElementSize_1 = require("./maxElementSize");
/**
 * Extends CellSizeAndPositionManager and adds scaling behavior for lists that are too large to fit within a browser's native limits.
 */
class ScalingCellSizeAndPositionManager {
    _cellSizeAndPositionManager;
    _maxScrollSize;
    constructor({ maxScrollSize = (0, maxElementSize_1.getMaxElementSize)(), ...params }) {
        // Favor composition over inheritance to simplify IE10 support
        this._cellSizeAndPositionManager = new CellSizeAndPositionManager_1.default(params);
        this._maxScrollSize = maxScrollSize;
    }
    areOffsetsAdjusted() {
        return this._cellSizeAndPositionManager.getTotalSize() > this._maxScrollSize;
    }
    configure(params) {
        this._cellSizeAndPositionManager.configure(params);
    }
    getCellCount() {
        return this._cellSizeAndPositionManager.getCellCount();
    }
    getEstimatedCellSize() {
        return this._cellSizeAndPositionManager.getEstimatedCellSize();
    }
    getLastMeasuredIndex() {
        return this._cellSizeAndPositionManager.getLastMeasuredIndex();
    }
    /**
     * Number of pixels a cell at the given position (offset) should be shifted in order to fit within the scaled container.
     * The offset passed to this function is scaled (safe) as well.
     */
    getOffsetAdjustment({ containerSize, offset // safe
     }) {
        const totalSize = this._cellSizeAndPositionManager.getTotalSize();
        const safeTotalSize = this.getTotalSize();
        const offsetPercentage = this._getOffsetPercentage({
            containerSize,
            offset,
            totalSize: safeTotalSize
        });
        return Math.round(offsetPercentage * (safeTotalSize - totalSize));
    }
    getSizeAndPositionOfCell(index) {
        return this._cellSizeAndPositionManager.getSizeAndPositionOfCell(index);
    }
    getSizeAndPositionOfLastMeasuredCell() {
        return this._cellSizeAndPositionManager.getSizeAndPositionOfLastMeasuredCell();
    }
    /** See CellSizeAndPositionManager#getTotalSize */
    getTotalSize() {
        return Math.min(this._maxScrollSize, this._cellSizeAndPositionManager.getTotalSize());
    }
    /** See CellSizeAndPositionManager#getUpdatedOffsetForIndex */
    getUpdatedOffsetForIndex({ align = 'auto', containerSize, currentOffset, 
    // safe
    targetIndex }) {
        currentOffset = this._safeOffsetToOffset({
            containerSize,
            offset: currentOffset
        });
        const offset = this._cellSizeAndPositionManager.getUpdatedOffsetForIndex({
            align,
            containerSize,
            currentOffset,
            targetIndex
        });
        return this._offsetToSafeOffset({
            containerSize,
            offset
        });
    }
    /** See CellSizeAndPositionManager#getVisibleCellRange */
    getVisibleCellRange({ containerSize, offset // safe
     }) {
        offset = this._safeOffsetToOffset({
            containerSize,
            offset
        });
        return this._cellSizeAndPositionManager.getVisibleCellRange({
            containerSize,
            offset
        });
    }
    resetCell(index) {
        this._cellSizeAndPositionManager.resetCell(index);
    }
    _getOffsetPercentage({ containerSize, offset, 
    // safe
    totalSize }) {
        return totalSize <= containerSize ? 0 : offset / (totalSize - containerSize);
    }
    _offsetToSafeOffset({ containerSize, offset // unsafe
     }) {
        const totalSize = this._cellSizeAndPositionManager.getTotalSize();
        const safeTotalSize = this.getTotalSize();
        if (totalSize === safeTotalSize) {
            return offset;
        }
        else {
            const offsetPercentage = this._getOffsetPercentage({
                containerSize,
                offset,
                totalSize
            });
            return Math.round(offsetPercentage * (safeTotalSize - containerSize));
        }
    }
    _safeOffsetToOffset({ containerSize, offset // safe
     }) {
        const totalSize = this._cellSizeAndPositionManager.getTotalSize();
        const safeTotalSize = this.getTotalSize();
        if (totalSize === safeTotalSize) {
            return offset;
        }
        else {
            const offsetPercentage = this._getOffsetPercentage({
                containerSize,
                offset,
                totalSize: safeTotalSize
            });
            return Math.round(offsetPercentage * (totalSize - containerSize));
        }
    }
}
exports.default = ScalingCellSizeAndPositionManager;
//# sourceMappingURL=ScalingCellSizeAndPositionManager.js.map