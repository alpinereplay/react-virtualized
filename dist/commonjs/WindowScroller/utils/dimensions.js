"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScrollOffset = exports.getPositionOffset = exports.getDimensions = void 0;
const isWindow = (element) => element === window;
const getBoundingBox = (element) => element.getBoundingClientRect();
function getDimensions(scrollElement, props) {
    if (!scrollElement) {
        return {
            height: props.serverHeight,
            width: props.serverWidth,
        };
    }
    else if (isWindow(scrollElement)) {
        const { innerHeight, innerWidth } = window;
        return {
            height: typeof innerHeight === "number" ? innerHeight : 0,
            width: typeof innerWidth === "number" ? innerWidth : 0,
        };
    }
    else {
        return getBoundingBox(scrollElement);
    }
}
exports.getDimensions = getDimensions;
/**
 * Gets the vertical and horizontal position of an element within its scroll container.
 * Elements that have been “scrolled past” return negative values.
 * Handles edge-case where a user is navigating back (history) from an already-scrolled page.
 * In this case the body’s top or left position will be a negative number and this element’s top or left will be increased (by that amount).
 */
function getPositionOffset(element, container) {
    if (isWindow(container) && document.documentElement) {
        const containerElement = document.documentElement;
        const elementRect = getBoundingBox(element);
        const containerRect = getBoundingBox(containerElement);
        return {
            top: elementRect.top - containerRect.top,
            left: elementRect.left - containerRect.left,
        };
    }
    else {
        const scrollOffset = getScrollOffset(container);
        const elementRect = getBoundingBox(element);
        const containerRect = getBoundingBox(container);
        return {
            top: elementRect.top + scrollOffset.top - containerRect.top,
            left: elementRect.left + scrollOffset.left - containerRect.left,
        };
    }
}
exports.getPositionOffset = getPositionOffset;
/**
 * Gets the vertical and horizontal scroll amount of the element, accounting for IE compatibility
 * and API differences between `window` and other DOM elements.
 */
function getScrollOffset(element) {
    if (isWindow(element) && document.documentElement) {
        return {
            top: "scrollY" in window
                ? window.scrollY
                : document.documentElement.scrollTop,
            left: "scrollX" in window
                ? window.scrollX
                : document.documentElement.scrollLeft,
        };
    }
    else {
        return {
            top: element.scrollTop,
            left: element.scrollLeft,
        };
    }
}
exports.getScrollOffset = getScrollOffset;
