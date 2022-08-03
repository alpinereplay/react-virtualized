"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCellMetadata = void 0;
const initCellMetadata_1 = __importDefault(require("./initCellMetadata"));
// Default cell sizes and offsets for use in below tests
function getCellMetadata() {
    const cellSizes = [
        10,
        20,
        15,
        10,
        15,
        30,
        20,
        10,
        30, //  8: 110..110 (max)
    ];
    return (0, initCellMetadata_1.default)({
        cellCount: cellSizes.length,
        size: ({ index }) => cellSizes[index],
    });
}
exports.getCellMetadata = getCellMetadata;
