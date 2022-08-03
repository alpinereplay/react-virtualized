"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const calculateSizeAndPositionData_1 = __importDefault(require("./calculateSizeAndPositionData"));
describe("calculateSizeAndPositionData", () => {
    it("should query for size and position of each cell", () => {
        const cellSizeAndPositionGetterCalls = [];
        function cellSizeAndPositionGetter({ index }) {
            cellSizeAndPositionGetterCalls.push(index);
            return {
                x: index * 50,
                y: 0,
                width: 50,
                height: 50,
            };
        }
        const { sectionManager } = (0, calculateSizeAndPositionData_1.default)({
            cellCount: 3,
            cellSizeAndPositionGetter,
        });
        expect(cellSizeAndPositionGetterCalls).toEqual([0, 1, 2]);
        expect(sectionManager.getTotalSectionCount()).toEqual(2);
    });
    it("should throw an error if invalid metadata is returned for a cell", () => {
        expect(() => (0, calculateSizeAndPositionData_1.default)({
            cellCount: 3,
            cellSizeAndPositionGetter: () => { },
        })).toThrow();
    });
});
//# sourceMappingURL=calculateSizeAndPositionData.jest.js.map