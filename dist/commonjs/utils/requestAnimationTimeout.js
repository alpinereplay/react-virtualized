"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestAnimationTimeout = exports.cancelAnimationTimeout = void 0;
const animationFrame_1 = require("./animationFrame");
const cancelAnimationTimeout = (frame) => (0, animationFrame_1.caf)(frame.id);
exports.cancelAnimationTimeout = cancelAnimationTimeout;
/**
 * Recursively calls requestAnimationFrame until a specified delay has been met or exceeded.
 * When the delay time has been reached the function you're timing out will be called.
 *
 * Credit: Joe Lambert (https://gist.github.com/joelambert/1002116#file-requesttimeout-js)
 */
const requestAnimationTimeout = (callback, delay) => {
    let start;
    // wait for end of processing current event handler, because event handler may be long
    Promise.resolve().then(() => {
        start = Date.now();
    });
    const timeout = () => {
        if (Date.now() - start >= delay) {
            callback.call("timeout");
        }
        else {
            frame.id = (0, animationFrame_1.raf)(timeout);
        }
    };
    const frame = {
        id: (0, animationFrame_1.raf)(timeout),
    };
    return frame;
};
exports.requestAnimationTimeout = requestAnimationTimeout;
