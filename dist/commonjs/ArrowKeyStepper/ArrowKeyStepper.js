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
const react_1 = __importStar(require("react"));
class ArrowKeyStepper extends react_1.PureComponent {
    static defaultProps = {
        disabled: false,
        isControlled: false,
        mode: "edges",
        scrollToColumn: 0,
        scrollToRow: 0,
    };
    state = {
        scrollToColumn: 0,
        scrollToRow: 0,
        instanceProps: {
            prevScrollToColumn: 0,
            prevScrollToRow: 0,
        },
    };
    _columnStartIndex = 0;
    _columnStopIndex = 0;
    _rowStartIndex = 0;
    _rowStopIndex = 0;
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isControlled) {
            return {
                scrollToColumn: 0,
                scrollToRow: 0,
                instanceProps: {
                    prevScrollToColumn: 0,
                    prevScrollToRow: 0,
                },
            };
        }
        if (nextProps.scrollToColumn !==
            prevState.instanceProps.prevScrollToColumn ||
            nextProps.scrollToRow !== prevState.instanceProps.prevScrollToRow) {
            return {
                ...prevState,
                scrollToColumn: nextProps.scrollToColumn,
                scrollToRow: nextProps.scrollToRow,
                instanceProps: {
                    prevScrollToColumn: nextProps.scrollToColumn,
                    prevScrollToRow: nextProps.scrollToRow,
                },
            };
        }
        return {
            scrollToColumn: 0,
            scrollToRow: 0,
            instanceProps: {
                prevScrollToColumn: 0,
                prevScrollToRow: 0,
            },
        };
    }
    setScrollIndexes({ scrollToColumn, scrollToRow }) {
        this.setState({
            scrollToRow,
            scrollToColumn,
        });
    }
    render() {
        const { className, children } = this.props;
        const { scrollToColumn, scrollToRow } = this._getScrollState();
        return (react_1.default.createElement("div", { className: className, onKeyDown: this._onKeyDown }, children({
            onSectionRendered: this._onSectionRendered,
            scrollToColumn,
            scrollToRow,
        })));
    }
    _onKeyDown = (event) => {
        const { columnCount, disabled, mode, rowCount } = this.props;
        if (disabled) {
            return;
        }
        const { scrollToColumn: scrollToColumnPrevious, scrollToRow: scrollToRowPrevious, } = this._getScrollState();
        let { scrollToColumn, scrollToRow } = this._getScrollState();
        // The above cases all prevent default event event behavior.
        // This is to keep the grid from scrolling after the snap-to update.
        switch (event.key) {
            case "ArrowDown":
                scrollToRow =
                    mode === "cells"
                        ? Math.min(scrollToRow + 1, rowCount - 1)
                        : Math.min(this._rowStopIndex + 1, rowCount - 1);
                break;
            case "ArrowLeft":
                scrollToColumn =
                    mode === "cells"
                        ? Math.max(scrollToColumn - 1, 0)
                        : Math.max(this._columnStartIndex - 1, 0);
                break;
            case "ArrowRight":
                scrollToColumn =
                    mode === "cells"
                        ? Math.min(scrollToColumn + 1, columnCount - 1)
                        : Math.min(this._columnStopIndex + 1, columnCount - 1);
                break;
            case "ArrowUp":
                scrollToRow =
                    mode === "cells"
                        ? Math.max(scrollToRow - 1, 0)
                        : Math.max(this._rowStartIndex - 1, 0);
                break;
        }
        if (scrollToColumn !== scrollToColumnPrevious ||
            scrollToRow !== scrollToRowPrevious) {
            event.preventDefault();
            this._updateScrollState({
                scrollToColumn,
                scrollToRow,
            });
        }
    };
    _onSectionRendered = ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex, }) => {
        this._columnStartIndex = columnStartIndex;
        this._columnStopIndex = columnStopIndex;
        this._rowStartIndex = rowStartIndex;
        this._rowStopIndex = rowStopIndex;
    };
    _getScrollState() {
        return this.props.isControlled ? this.props : this.state;
    }
    _updateScrollState({ scrollToColumn, scrollToRow }) {
        const { isControlled, onScrollToChange } = this.props;
        if (typeof onScrollToChange === "function") {
            onScrollToChange({
                scrollToColumn,
                scrollToRow,
            });
        }
        if (!isControlled) {
            this.setState({
                scrollToColumn,
                scrollToRow,
            });
        }
    }
}
exports.default = ArrowKeyStepper;
