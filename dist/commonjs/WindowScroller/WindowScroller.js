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
exports.IS_SCROLLING_TIMEOUT = void 0;
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const onScroll_1 = require("./utils/onScroll");
const dimensions_1 = require("./utils/dimensions");
const detectElementResize_1 = __importDefault(require("../vendor/detectElementResize"));
/**
 * Specifies the number of milliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
exports.IS_SCROLLING_TIMEOUT = 150;
const getWindow = () => typeof window !== "undefined" ? window : undefined;
class WindowScroller extends React.PureComponent {
    static defaultProps = {
        onResize: () => { },
        onScroll: () => { },
        scrollingResetTimeInterval: exports.IS_SCROLLING_TIMEOUT,
        scrollElement: getWindow(),
        serverHeight: 0,
        serverWidth: 0,
    };
    _window = getWindow();
    _isMounted = false;
    _positionFromTop = 0;
    _positionFromLeft = 0;
    _detectElementResize;
    _child;
    state = {
        ...(0, dimensions_1.getDimensions)(this.props.scrollElement, this.props),
        isScrolling: false,
        scrollLeft: 0,
        scrollTop: 0,
    };
    updatePosition(scrollElement = this.props.scrollElement) {
        const { onResize } = this.props;
        const { height, width } = this.state;
        const thisNode = this._child || ReactDOM.findDOMNode(this);
        if (thisNode instanceof Element && scrollElement) {
            const offset = (0, dimensions_1.getPositionOffset)(thisNode, scrollElement);
            this._positionFromTop = offset.top;
            this._positionFromLeft = offset.left;
        }
        const dimensions = (0, dimensions_1.getDimensions)(scrollElement, this.props);
        if (height !== dimensions.height || width !== dimensions.width) {
            this.setState({
                height: dimensions.height,
                width: dimensions.width,
            });
            onResize({
                height: dimensions.height,
                width: dimensions.width,
            });
        }
        if (this.props.updateScrollTopOnUpdatePosition === true) {
            this.__handleWindowScrollEvent();
            this.__resetIsScrolling();
        }
    }
    componentDidMount() {
        const scrollElement = this.props.scrollElement;
        this._detectElementResize = (0, detectElementResize_1.default)(undefined, undefined);
        this.updatePosition(scrollElement);
        if (scrollElement) {
            (0, onScroll_1.registerScrollListener)(this, scrollElement);
            this._registerResizeListener(scrollElement);
        }
        this._isMounted = true;
    }
    componentDidUpdate(prevProps, prevState) {
        const { scrollElement } = this.props;
        const { scrollElement: prevScrollElement } = prevProps;
        if (prevScrollElement !== scrollElement &&
            prevScrollElement != null &&
            scrollElement != null) {
            this.updatePosition(scrollElement);
            (0, onScroll_1.unregisterScrollListener)(this, prevScrollElement);
            (0, onScroll_1.registerScrollListener)(this, scrollElement);
            this._unregisterResizeListener(prevScrollElement);
            this._registerResizeListener(scrollElement);
        }
    }
    componentWillUnmount() {
        const scrollElement = this.props.scrollElement;
        if (scrollElement) {
            (0, onScroll_1.unregisterScrollListener)(this, scrollElement);
            this._unregisterResizeListener(scrollElement);
        }
        this._isMounted = false;
    }
    render() {
        const { children } = this.props;
        const { isScrolling, scrollTop, scrollLeft, height, width } = this.state;
        return children({
            onChildScroll: this._onChildScroll,
            registerChild: this._registerChild,
            height,
            isScrolling,
            scrollLeft,
            scrollTop,
            width,
        });
    }
    _registerChild = (element) => {
        if (element && !(element instanceof Element)) {
            console.warn("WindowScroller registerChild expects to be passed Element or null");
        }
        this._child = element;
        this.updatePosition();
    };
    _onChildScroll = ({ scrollTop }) => {
        if (this.state.scrollTop === scrollTop) {
            return;
        }
        const { scrollElement } = this.props;
        if (scrollElement) {
            if (typeof scrollElement.scrollTo === "function") {
                scrollElement.scrollTo(0, scrollTop + this._positionFromTop);
            }
            else {
                scrollElement.scrollTop = scrollTop + this._positionFromTop;
            }
        }
    };
    _registerResizeListener = (element) => {
        if (element === window) {
            window.addEventListener("resize", this._onResize, false);
        }
        else {
            this._detectElementResize.addResizeListener(element, this._onResize);
        }
    };
    _unregisterResizeListener = (element) => {
        if (element === window) {
            window.removeEventListener("resize", this._onResize, false);
        }
        else if (element) {
            this._detectElementResize.removeResizeListener(element, this._onResize);
        }
    };
    _onResize = () => {
        this.updatePosition();
    };
    // Referenced by utils/onScroll
    __handleWindowScrollEvent = () => {
        if (!this._isMounted) {
            return;
        }
        const { onScroll } = this.props;
        const { scrollElement } = this.props;
        if (scrollElement) {
            const scrollOffset = (0, dimensions_1.getScrollOffset)(scrollElement);
            const scrollLeft = Math.max(0, scrollOffset.left - this._positionFromLeft);
            const scrollTop = Math.max(0, scrollOffset.top - this._positionFromTop);
            this.setState({
                isScrolling: true,
                scrollLeft,
                scrollTop,
            });
            onScroll({
                scrollLeft,
                scrollTop,
            });
        }
    };
    // Referenced by utils/onScroll
    __resetIsScrolling = () => {
        this.setState({
            isScrolling: false,
        });
    };
}
exports.default = WindowScroller;
