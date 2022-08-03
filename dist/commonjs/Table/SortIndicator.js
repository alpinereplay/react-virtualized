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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prop_types_1 = __importDefault(require("prop-types"));
const React = __importStar(require("react"));
const SortDirection_1 = __importDefault(require("./SortDirection"));
/**
 * Displayed beside a header to indicate that a Table is currently sorted by this column.
 */
function SortIndicator({ sortDirection }) {
    const classNames = ["ReactVirtualized__Table__sortableHeaderIcon"];
    if (sortDirection === SortDirection_1.default.ASC) {
        classNames.push("ReactVirtualized__Table__sortableHeaderIcon--ASC");
    }
    if (sortDirection === SortDirection_1.default.DESC) {
        classNames.push("ReactVirtualized__Table__sortableHeaderIcon--DESC");
    }
    return (React.createElement("svg", { className: classNames.join(" "), width: 18, height: 18, viewBox: "0 0 24 24" },
        sortDirection === SortDirection_1.default.ASC ? (React.createElement("path", { d: "M7 14l5-5 5 5z" })) : (React.createElement("path", { d: "M7 10l5 5 5-5z" })),
        React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" })));
}
exports.default = SortIndicator;
SortIndicator.propTypes = {
    sortDirection: prop_types_1.default.oneOf([SortDirection_1.default.ASC, SortDirection_1.default.DESC]),
};
