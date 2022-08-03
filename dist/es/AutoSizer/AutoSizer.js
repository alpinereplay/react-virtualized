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
const React = __importStar(require("react"));
const detectElementResize_1 = __importDefault(require("../vendor/detectElementResize"));
class AutoSizer extends React.Component {
    static defaultProps = {
        onResize: () => { },
        disableHeight: false,
        disableWidth: false,
        style: {},
    };
    state = {
        height: this.props.defaultHeight || 0,
        width: this.props.defaultWidth || 0,
    };
    _parentNode;
    _autoSizer;
    _window; // uses any instead of Window because Flow doesn't have window type
    _detectElementResize;
    componentDidMount() {
        const { nonce } = this.props;
        if (this._autoSizer &&
            this._autoSizer.parentNode &&
            this._autoSizer.parentNode.ownerDocument &&
            this._autoSizer.parentNode.ownerDocument.defaultView &&
            this._autoSizer.parentNode instanceof
                this._autoSizer.parentNode.ownerDocument.defaultView.HTMLElement) {
            // Delay access of parentNode until mount.
            // This handles edge-cases where the component has already been unmounted before its ref has been set,
            // As well as libraries like react-lite which have a slightly different lifecycle.
            this._parentNode = this._autoSizer.parentNode;
            this._window = this._autoSizer.parentNode.ownerDocument.defaultView;
            // Defer requiring resize handler in order to support server-side rendering.
            // See issue #41
            this._detectElementResize = (0, detectElementResize_1.default)(nonce, this._window);
            this._detectElementResize.addResizeListener(this._parentNode, this._onResize);
            this._onResize();
        }
    }
    componentWillUnmount() {
        if (this._detectElementResize && this._parentNode) {
            this._detectElementResize.removeResizeListener(this._parentNode, this._onResize);
        }
    }
    render() {
        const { children, className, disableHeight, disableWidth, style } = this.props;
        const { height, width } = this.state;
        // Outer div should not force width/height since that may prevent containers from shrinking.
        // Inner component should overflow and use calculated width/height.
        // See issue #68 for more information.
        const outerStyle = {
            overflow: "visible",
        };
        const childParams = {};
        if (!disableHeight) {
            outerStyle.height = 0;
            childParams.height = height;
        }
        if (!disableWidth) {
            outerStyle.width = 0;
            childParams.width = width;
        }
        /**
     * TODO: Avoid rendering children before the initial measurements have been collected.
     * At best this would just be wasting cycles.
     * Add this check into version 10 though as it could break too many ref callbacks in version 9.
     * Note that if default width/height props were provided this would still work with SSR.
    if (
      height !== 0 &&
      width !== 0
    ) {
      child = children({ height, width })
    }
    */
        return (React.createElement("div", { className: className, ref: this._setRef, style: { ...outerStyle, ...style } }, children(childParams)));
    }
    _onResize = () => {
        const { disableHeight, disableWidth, onResize } = this.props;
        if (this._parentNode) {
            // Guard against AutoSizer component being removed from the DOM immediately after being added.
            // This can result in invalid style values which can result in NaN values if we don't handle them.
            // See issue #150 for more context.
            const height = this._parentNode.offsetHeight || 0;
            const width = this._parentNode.offsetWidth || 0;
            const win = this._window || window;
            const style = win.getComputedStyle(this._parentNode) || {};
            const paddingLeft = parseInt(style.paddingLeft, 10) || 0;
            const paddingRight = parseInt(style.paddingRight, 10) || 0;
            const paddingTop = parseInt(style.paddingTop, 10) || 0;
            const paddingBottom = parseInt(style.paddingBottom, 10) || 0;
            const newHeight = height - paddingTop - paddingBottom;
            const newWidth = width - paddingLeft - paddingRight;
            if ((!disableHeight && this.state.height !== newHeight) ||
                (!disableWidth && this.state.width !== newWidth)) {
                this.setState({
                    height: height - paddingTop - paddingBottom,
                    width: width - paddingLeft - paddingRight,
                });
                onResize({
                    height,
                    width,
                });
            }
        }
    };
    _setRef = (autoSizer) => {
        this._autoSizer = autoSizer;
    };
}
exports.default = AutoSizer;
