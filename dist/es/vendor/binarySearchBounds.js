"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EQ = exports.LE = exports.LT = exports.GT = exports.GE = void 0;
/**
 * Binary Search Bounds
 * https://github.com/mikolalysenko/binary-search-bounds
 * Mikola Lysenko
 *
 * Inlined because of Content Security Policy issue caused by the use of `new Function(...)` syntax.
 * Issue reported here: https://github.com/mikolalysenko/binary-search-bounds/issues/5
 **/
function _GEA(a, l, h, y) {
    var i = h + 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (x >= y) {
            i = m;
            h = m - 1;
        }
        else {
            l = m + 1;
        }
    }
    return i;
}
function _GEP(a, l, h, y, c) {
    var i = h + 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (c(x, y) >= 0) {
            i = m;
            h = m - 1;
        }
        else {
            l = m + 1;
        }
    }
    return i;
}
function GE(a, y, c, l = undefined, h = undefined) {
    if (typeof c === "function") {
        return _GEP(a, l === void 0 ? 0 : l | 0, h === void 0 ? a.length - 1 : h | 0, y, c);
    }
    else {
        return _GEA(a, c === void 0 ? 0 : c | 0, l === void 0 ? a.length - 1 : l | 0, y);
    }
}
exports.GE = GE;
function _GTA(a, l, h, y) {
    var i = h + 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (x > y) {
            i = m;
            h = m - 1;
        }
        else {
            l = m + 1;
        }
    }
    return i;
}
function _GTP(a, l, h, y, c) {
    var i = h + 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (c(x, y) > 0) {
            i = m;
            h = m - 1;
        }
        else {
            l = m + 1;
        }
    }
    return i;
}
function GT(a, y, c, l, h) {
    if (typeof c === "function") {
        return _GTP(a, l === void 0 ? 0 : l | 0, h === void 0 ? a.length - 1 : h | 0, y, c);
    }
    else {
        return _GTA(a, c === void 0 ? 0 : c | 0, l === void 0 ? a.length - 1 : l | 0, y);
    }
}
exports.GT = GT;
function _LTA(a, l, h, y) {
    var i = l - 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (x < y) {
            i = m;
            l = m + 1;
        }
        else {
            h = m - 1;
        }
    }
    return i;
}
function _LTP(a, l, h, y, c) {
    var i = l - 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (c(x, y) < 0) {
            i = m;
            l = m + 1;
        }
        else {
            h = m - 1;
        }
    }
    return i;
}
function LT(a, y, c, l, h) {
    if (typeof c === "function") {
        return _LTP(a, l === void 0 ? 0 : l | 0, h === void 0 ? a.length - 1 : h | 0, y, c);
    }
    else {
        return _LTA(a, c === void 0 ? 0 : c | 0, l === void 0 ? a.length - 1 : l | 0, y);
    }
}
exports.LT = LT;
function _LEA(a, l, h, y) {
    var i = l - 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (x <= y) {
            i = m;
            l = m + 1;
        }
        else {
            h = m - 1;
        }
    }
    return i;
}
function _LEP(a, l, h, y, c) {
    var i = l - 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (c(x, y) <= 0) {
            i = m;
            l = m + 1;
        }
        else {
            h = m - 1;
        }
    }
    return i;
}
function LE(a, y, c, l, h) {
    if (typeof c === "function") {
        return _LEP(a, l === void 0 ? 0 : l | 0, h === void 0 ? a.length - 1 : h | 0, y, c);
    }
    else {
        return _LEA(a, c === void 0 ? 0 : c | 0, l === void 0 ? a.length - 1 : l | 0, y);
    }
}
exports.LE = LE;
function _EQA(a, l, h, y) {
    l - 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (x === y) {
            return m;
        }
        else if (x <= y) {
            l = m + 1;
        }
        else {
            h = m - 1;
        }
    }
    return -1;
}
function _EQP(a, l, h, y, c) {
    l - 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        var p = c(x, y);
        if (p === 0) {
            return m;
        }
        else if (p <= 0) {
            l = m + 1;
        }
        else {
            h = m - 1;
        }
    }
    return -1;
}
function EQ(a, y, c, l, h) {
    if (typeof c === "function") {
        return _EQP(a, l === void 0 ? 0 : l | 0, h === void 0 ? a.length - 1 : h | 0, y, c);
    }
    else {
        return _EQA(a, c === void 0 ? 0 : c | 0, l === void 0 ? a.length - 1 : l | 0, y);
    }
}
exports.EQ = EQ;
// export default {
//     ge: dispatchBsearchGE,
//     gt: dispatchBsearchGT,
//     lt: dispatchBsearchLT,
//     le: dispatchBsearchLE,
//     eq: dispatchBsearchEQ,
// }
