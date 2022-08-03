"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createMultiSort_1 = __importDefault(require("./createMultiSort"));
describe("createMultiSort", () => {
    function simulate(sort, dataKey, eventModifier = "", defaultSortDirection = "ASC") {
        sort({
            defaultSortDirection,
            event: {
                ctrlKey: eventModifier === "control",
                metaKey: eventModifier === "meta",
                shiftKey: eventModifier === "shift",
            },
            sortBy: dataKey,
        });
    }
    it("errors if the user did not specify a sort callback", () => {
        expect(createMultiSort_1.default).toThrow();
    });
    it("sets the correct default values", () => {
        const multiSort = (0, createMultiSort_1.default)(jest.fn(), {
            defaultSortBy: ["a", "b"],
            defaultSortDirection: {
                a: "ASC",
                b: "DESC",
            },
        });
        expect(multiSort.sortBy).toEqual(["a", "b"]);
        expect(multiSort.sortDirection.a).toBe("ASC");
        expect(multiSort.sortDirection.b).toBe("DESC");
    });
    it("sets the correct default sparse values", () => {
        const multiSort = (0, createMultiSort_1.default)(jest.fn(), {
            defaultSortBy: ["a", "b"],
            defaultSortDirection: {
                a: "ASC",
            },
        });
        expect(multiSort.sortBy).toEqual(["a", "b"]);
        expect(multiSort.sortDirection.a).toBe("ASC");
        expect(multiSort.sortDirection.b).toBe("ASC");
    });
    describe("on click", () => {
        it("sets the correct default value for a field", () => {
            const multiSort = (0, createMultiSort_1.default)(jest.fn());
            simulate(multiSort.sort, "a");
            expect(multiSort.sortBy).toEqual(["a"]);
            expect(multiSort.sortDirection.a).toBe("ASC");
            simulate(multiSort.sort, "b", "", "DESC");
            expect(multiSort.sortBy).toEqual(["b"]);
            expect(multiSort.sortDirection.b).toBe("DESC");
        });
        it("toggles a field value", () => {
            const multiSort = (0, createMultiSort_1.default)(jest.fn());
            simulate(multiSort.sort, "a");
            expect(multiSort.sortBy).toEqual(["a"]);
            expect(multiSort.sortDirection.a).toBe("ASC");
            simulate(multiSort.sort, "a");
            expect(multiSort.sortBy).toEqual(["a"]);
            expect(multiSort.sortDirection.a).toBe("DESC");
            simulate(multiSort.sort, "b", "", "DESC");
            expect(multiSort.sortBy).toEqual(["b"]);
            expect(multiSort.sortDirection.b).toBe("DESC");
            simulate(multiSort.sort, "b", "", "DESC");
            expect(multiSort.sortBy).toEqual(["b"]);
            expect(multiSort.sortDirection.b).toBe("ASC");
        });
        it("resets sort-by fields", () => {
            const multiSort = (0, createMultiSort_1.default)(jest.fn(), {
                defaultSortBy: ["a", "b"],
                defaultSortDirection: {
                    a: "ASC",
                },
            });
            expect(multiSort.sortBy).toEqual(["a", "b"]);
            simulate(multiSort.sort, "a");
            expect(multiSort.sortBy).toEqual(["a"]);
        });
        it("resets sort-direction fields", () => {
            const multiSort = (0, createMultiSort_1.default)(jest.fn(), {
                defaultSortBy: ["a", "b"],
                defaultSortDirection: {
                    a: "DESC",
                    b: "ASC",
                },
            });
            expect(multiSort.sortBy).toEqual(["a", "b"]);
            expect(multiSort.sortDirection.a).toEqual("DESC");
            expect(multiSort.sortDirection.b).toEqual("ASC");
            simulate(multiSort.sort, "a");
            expect(multiSort.sortBy).toEqual(["a"]);
            expect(multiSort.sortDirection.a).toEqual("ASC");
            expect(multiSort.sortDirection.b).toEqual(undefined);
            simulate(multiSort.sort, "b");
            expect(multiSort.sortBy).toEqual(["b"]);
            expect(multiSort.sortDirection.a).toEqual(undefined);
            expect(multiSort.sortDirection.b).toEqual("ASC");
        });
    });
    describe("on shift click", () => {
        it("appends a field to the sort by list", () => {
            const multiSort = (0, createMultiSort_1.default)(jest.fn());
            simulate(multiSort.sort, "a");
            expect(multiSort.sortBy).toEqual(["a"]);
            expect(multiSort.sortDirection.a).toBe("ASC");
            simulate(multiSort.sort, "b", "shift");
            expect(multiSort.sortBy).toEqual(["a", "b"]);
            expect(multiSort.sortDirection.a).toBe("ASC");
            expect(multiSort.sortDirection.b).toBe("ASC");
        });
        it("toggles an appended field value", () => {
            const multiSort = (0, createMultiSort_1.default)(jest.fn());
            simulate(multiSort.sort, "a");
            expect(multiSort.sortBy).toEqual(["a"]);
            expect(multiSort.sortDirection.a).toBe("ASC");
            simulate(multiSort.sort, "b", "shift");
            expect(multiSort.sortBy).toEqual(["a", "b"]);
            expect(multiSort.sortDirection.a).toBe("ASC");
            expect(multiSort.sortDirection.b).toBe("ASC");
            simulate(multiSort.sort, "a", "shift");
            expect(multiSort.sortBy).toEqual(["a", "b"]);
            expect(multiSort.sortDirection.a).toBe("DESC");
            expect(multiSort.sortDirection.b).toBe("ASC");
            simulate(multiSort.sort, "a", "shift");
            expect(multiSort.sortBy).toEqual(["a", "b"]);
            expect(multiSort.sortDirection.a).toBe("ASC");
            expect(multiSort.sortDirection.b).toBe("ASC");
        });
        it("able to shift+click more than once", () => {
            const multiSort = (0, createMultiSort_1.default)(jest.fn());
            simulate(multiSort.sort, "a");
            expect(multiSort.sortBy).toEqual(["a"]);
            expect(multiSort.sortDirection.a).toBe("ASC");
            simulate(multiSort.sort, "b", "shift");
            expect(multiSort.sortBy).toEqual(["a", "b"]);
            expect(multiSort.sortDirection.a).toBe("ASC");
            expect(multiSort.sortDirection.b).toBe("ASC");
            simulate(multiSort.sort, "b");
            expect(multiSort.sortBy).toEqual(["b"]);
            expect(multiSort.sortDirection.b).toBe("DESC");
            simulate(multiSort.sort, "a", "shift");
            expect(multiSort.sortBy).toEqual(["b", "a"]);
            expect(multiSort.sortDirection.a).toBe("ASC");
            expect(multiSort.sortDirection.b).toBe("DESC");
        });
    });
    ["control", "meta"].forEach((modifier) => {
        describe(`${modifier} click`, () => {
            it("removes a field from the sort by list", () => {
                const multiSort = (0, createMultiSort_1.default)(jest.fn(), {
                    defaultSortBy: ["a", "b"],
                    defaultSortDirection: {
                        a: "ASC",
                    },
                });
                expect(multiSort.sortBy).toEqual(["a", "b"]);
                simulate(multiSort.sort, "a", modifier);
                expect(multiSort.sortBy).toEqual(["b"]);
                simulate(multiSort.sort, "b", modifier);
                expect(multiSort.sortBy).toEqual([]);
            });
            it("ignores fields not in the list on control click", () => {
                const multiSort = (0, createMultiSort_1.default)(jest.fn(), {
                    defaultSortBy: ["a", "b"],
                    defaultSortDirection: {
                        a: "ASC",
                    },
                });
                expect(multiSort.sortBy).toEqual(["a", "b"]);
                simulate(multiSort.sort, "c", modifier);
                expect(multiSort.sortBy).toEqual(["a", "b"]);
            });
        });
    });
});
//# sourceMappingURL=createMultiSort.jest.js.map