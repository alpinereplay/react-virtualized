"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getUpdatedOffsetForIndex_1 = __importDefault(require("./getUpdatedOffsetForIndex"));
const TestHelper_1 = require("./TestHelper");
describe("getUpdatedOffsetForIndex", () => {
    function testHelper(targetIndex, currentOffset, cellMetadata = (0, TestHelper_1.getCellMetadata)()) {
        return (0, getUpdatedOffsetForIndex_1.default)({
            cellOffset: cellMetadata[targetIndex].offset,
            cellSize: cellMetadata[targetIndex].size,
            containerSize: 50,
            currentOffset,
        });
    }
    it("should scroll to the beginning", () => {
        expect(testHelper(0, 100)).toEqual(0);
    });
    it("should scroll forward to the middle", () => {
        expect(testHelper(4, 0)).toEqual(20);
    });
    it("should scroll backward to the middle", () => {
        expect(testHelper(2, 100)).toEqual(30);
    });
    it("should not scroll if an item is already visible", () => {
        expect(testHelper(2, 20)).toEqual(20);
    });
    it("should scroll to the end", () => {
        expect(testHelper(8, 0)).toEqual(110);
    });
    it("should honor specified :align values", () => {
        expect((0, getUpdatedOffsetForIndex_1.default)({
            align: "auto",
            cellOffset: 50,
            cellSize: 10,
            containerSize: 50,
            currentOffset: 0,
        })).toEqual(10);
        expect((0, getUpdatedOffsetForIndex_1.default)({
            align: "start",
            cellOffset: 50,
            cellSize: 10,
            containerSize: 50,
            currentOffset: 0,
        })).toEqual(50);
        expect((0, getUpdatedOffsetForIndex_1.default)({
            align: "auto",
            cellOffset: 50,
            cellSize: 10,
            containerSize: 50,
            currentOffset: 100,
        })).toEqual(50);
        expect((0, getUpdatedOffsetForIndex_1.default)({
            align: "end",
            cellOffset: 50,
            cellSize: 10,
            containerSize: 50,
            currentOffset: 100,
        })).toEqual(10);
        expect((0, getUpdatedOffsetForIndex_1.default)({
            align: "center",
            cellOffset: 50,
            cellSize: 10,
            containerSize: 50,
            currentOffset: 100,
        })).toEqual(30);
    });
});
