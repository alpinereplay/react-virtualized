"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SectionManager_1 = __importDefault(require("../SectionManager"));
function calculateSizeAndPositionData({ cellCount, cellSizeAndPositionGetter, sectionSize, }) {
    const cellMetadata = [];
    const sectionManager = new SectionManager_1.default(sectionSize);
    let height = 0;
    let width = 0;
    for (let index = 0; index < cellCount; index++) {
        const cellMetadatum = cellSizeAndPositionGetter({
            index,
        });
        if (cellMetadatum.height == null ||
            isNaN(cellMetadatum.height) ||
            cellMetadatum.width == null ||
            isNaN(cellMetadatum.width) ||
            cellMetadatum.x == null ||
            isNaN(cellMetadatum.x) ||
            cellMetadatum.y == null ||
            isNaN(cellMetadatum.y)) {
            throw Error(`Invalid metadata returned for cell ${index}:
        x:${cellMetadatum.x}, y:${cellMetadatum.y}, width:${cellMetadatum.width}, height:${cellMetadatum.height}`);
        }
        height = Math.max(height, cellMetadatum.y + cellMetadatum.height);
        width = Math.max(width, cellMetadatum.x + cellMetadatum.width);
        cellMetadata[index] = cellMetadatum;
        sectionManager.registerCell({
            cellMetadatum,
            index,
        });
    }
    return {
        cellMetadata,
        height,
        sectionManager,
        width,
    };
}
exports.default = calculateSizeAndPositionData;
