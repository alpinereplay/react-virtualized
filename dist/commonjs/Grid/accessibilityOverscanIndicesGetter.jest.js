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
const accessibilityOverscanIndicesGetter_1 = __importStar(require("./accessibilityOverscanIndicesGetter"));
describe("overscanIndicesGetter", () => {
    function testHelper({ cellCount, startIndex, stopIndex, overscanCellsCount, scrollDirection, }) {
        return (0, accessibilityOverscanIndicesGetter_1.default)({
            cellCount,
            overscanCellsCount,
            scrollDirection,
            startIndex,
            stopIndex,
            direction: "vertical",
        });
    }
    it("should still overscan by 1 (for keyboard accessibility) if :overscanCellsCount is 0", () => {
        expect(testHelper({
            cellCount: 100,
            startIndex: 10,
            stopIndex: 20,
            overscanCellsCount: 0,
            scrollDirection: accessibilityOverscanIndicesGetter_1.SCROLL_DIRECTION_BACKWARD,
        })).toEqual({
            overscanStartIndex: 9,
            overscanStopIndex: 21,
        });
        expect(testHelper({
            cellCount: 100,
            startIndex: 10,
            stopIndex: 20,
            overscanCellsCount: 0,
            scrollDirection: accessibilityOverscanIndicesGetter_1.SCROLL_DIRECTION_FORWARD,
        })).toEqual({
            overscanStartIndex: 9,
            overscanStopIndex: 21,
        });
    });
    it("should overscan forward", () => {
        expect(testHelper({
            cellCount: 100,
            startIndex: 20,
            stopIndex: 30,
            overscanCellsCount: 10,
            scrollDirection: accessibilityOverscanIndicesGetter_1.SCROLL_DIRECTION_FORWARD,
        })).toEqual({
            overscanStartIndex: 19,
            overscanStopIndex: 40,
        });
    });
    it("should overscan backward", () => {
        expect(testHelper({
            cellCount: 100,
            startIndex: 20,
            stopIndex: 30,
            overscanCellsCount: 10,
            scrollDirection: accessibilityOverscanIndicesGetter_1.SCROLL_DIRECTION_BACKWARD,
        })).toEqual({
            overscanStartIndex: 10,
            overscanStopIndex: 31,
        });
    });
    it("should not overscan beyond the start of the list", () => {
        expect(testHelper({
            cellCount: 100,
            startIndex: 5,
            stopIndex: 15,
            overscanCellsCount: 10,
            scrollDirection: accessibilityOverscanIndicesGetter_1.SCROLL_DIRECTION_BACKWARD,
        })).toEqual({
            overscanStartIndex: 0,
            overscanStopIndex: 16,
        });
    });
    it("should not overscan beyond the end of the list", () => {
        expect(testHelper({
            cellCount: 25,
            startIndex: 10,
            stopIndex: 20,
            overscanCellsCount: 10,
            scrollDirection: accessibilityOverscanIndicesGetter_1.SCROLL_DIRECTION_FORWARD,
        })).toEqual({
            overscanStartIndex: 9,
            overscanStopIndex: 24,
        });
    });
});
//# sourceMappingURL=accessibilityOverscanIndicesGetter.jest.js.map