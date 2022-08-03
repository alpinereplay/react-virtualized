// @flow
"no babel-plugin-flow-react-proptypes";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unregisterScrollListener = exports.registerScrollListener = void 0;
const requestAnimationTimeout_1 = require("../../utils/requestAnimationTimeout");
let mountedInstances = [];
let originalBodyPointerEvents = null;
let disablePointerEventsTimeoutId = null;
function enablePointerEventsIfDisabled() {
    if (disablePointerEventsTimeoutId) {
        disablePointerEventsTimeoutId = null;
        if (document.body && originalBodyPointerEvents != null) {
            document.body.style.pointerEvents = originalBodyPointerEvents;
        }
        originalBodyPointerEvents = null;
    }
}
function enablePointerEventsAfterDelayCallback() {
    enablePointerEventsIfDisabled();
    mountedInstances.forEach((instance) => instance.__resetIsScrolling());
}
function enablePointerEventsAfterDelay() {
    if (disablePointerEventsTimeoutId) {
        (0, requestAnimationTimeout_1.cancelAnimationTimeout)(disablePointerEventsTimeoutId);
    }
    var maximumTimeout = 0;
    mountedInstances.forEach((instance) => {
        maximumTimeout = Math.max(maximumTimeout, instance.props.scrollingResetTimeInterval);
    });
    disablePointerEventsTimeoutId = (0, requestAnimationTimeout_1.requestAnimationTimeout)(enablePointerEventsAfterDelayCallback, maximumTimeout);
}
function onScrollWindow(event) {
    if (event.currentTarget === window &&
        originalBodyPointerEvents == null &&
        document.body) {
        originalBodyPointerEvents = document.body.style.pointerEvents;
        document.body.style.pointerEvents = "none";
    }
    enablePointerEventsAfterDelay();
    mountedInstances.forEach((instance) => {
        if (instance.props.scrollElement === event.currentTarget) {
            instance.__handleWindowScrollEvent();
        }
    });
}
function registerScrollListener(component, element) {
    if (!mountedInstances.some((instance) => instance.props.scrollElement === element)) {
        element.addEventListener("scroll", onScrollWindow);
    }
    mountedInstances.push(component);
}
exports.registerScrollListener = registerScrollListener;
function unregisterScrollListener(component, element) {
    mountedInstances = mountedInstances.filter((instance) => instance !== component);
    if (!mountedInstances.length) {
        element.removeEventListener("scroll", onScrollWindow);
        if (disablePointerEventsTimeoutId) {
            (0, requestAnimationTimeout_1.cancelAnimationTimeout)(disablePointerEventsTimeoutId);
            enablePointerEventsIfDisabled();
        }
    }
}
exports.unregisterScrollListener = unregisterScrollListener;
//# sourceMappingURL=onScroll.js.map