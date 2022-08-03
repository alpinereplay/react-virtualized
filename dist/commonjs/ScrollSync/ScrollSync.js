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
/**
 * HOC that simplifies the process of synchronizing scrolling between two or more virtualized components.
 */
class ScrollSync extends React.PureComponent {
    static propTypes = {
        /**
         * Function responsible for rendering 2 or more virtualized components.
         * This function should implement the following signature:
         * ({ onScroll, scrollLeft, scrollTop }) => PropTypes.element
         */
        children: prop_types_1.default.func.isRequired,
    };
    constructor(props, context) {
        super(props, context);
        this.state = {
            clientHeight: 0,
            clientWidth: 0,
            scrollHeight: 0,
            scrollLeft: 0,
            scrollTop: 0,
            scrollWidth: 0,
        };
        this._onScroll = this._onScroll.bind(this);
    }
    render() {
        const { children } = this.props;
        const { clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth, } = this.state;
        return children({
            clientHeight,
            clientWidth,
            onScroll: this._onScroll,
            scrollHeight,
            scrollLeft,
            scrollTop,
            scrollWidth,
        });
    }
    _onScroll({ clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth, }) {
        this.setState({
            clientHeight,
            clientWidth,
            scrollHeight,
            scrollLeft,
            scrollTop,
            scrollWidth,
        });
    }
}
exports.default = ScrollSync;
//# sourceMappingURL=ScrollSync.js.map