/**
 * Binary Search Bounds
 * https://github.com/mikolalysenko/binary-search-bounds
 * Mikola Lysenko
 *
 * Inlined because of Content Security Policy issue caused by the use of `new Function(...)` syntax.
 * Issue reported here: https://github.com/mikolalysenko/binary-search-bounds/issues/5
 **/
function _GEA(a: any, l: any, h: any, y: any) {
    var i = h + 1

    while (l <= h) {
        var m = (l + h) >>> 1,
            x = a[m]

        if (x >= y) {
            i = m
            h = m - 1
        } else {
            l = m + 1
        }
    }

    return i
}

function _GEP(
    a: any,
    l: any,
    h: any,
    y: any,
    c: (arg0: any, arg1: any) => number
) {
    var i = h + 1

    while (l <= h) {
        var m = (l + h) >>> 1,
            x = a[m]

        if (c(x, y) >= 0) {
            i = m
            h = m - 1
        } else {
            l = m + 1
        }
    }

    return i
}

export function GE(
    a: any,
    y: any,
    c: any,
    l: any = undefined,
    h: any = undefined
): number {
    if (typeof c === "function") {
        return _GEP(
            a,
            l === void 0 ? 0 : l | 0,
            h === void 0 ? a.length - 1 : h | 0,
            y,
            c
        )
    } else {
        return _GEA(
            a,
            c === void 0 ? 0 : c | 0,
            l === void 0 ? a.length - 1 : l | 0,
            y
        )
    }
}

function _GTA(a: any, l: any, h: any, y: any) {
    var i = h + 1

    while (l <= h) {
        var m = (l + h) >>> 1,
            x = a[m]

        if (x > y) {
            i = m
            h = m - 1
        } else {
            l = m + 1
        }
    }

    return i
}

function _GTP(
    a: any,
    l: any,
    h: any,
    y: any,
    c: (arg0: any, arg1: any) => number
) {
    var i = h + 1

    while (l <= h) {
        var m = (l + h) >>> 1,
            x = a[m]

        if (c(x, y) > 0) {
            i = m
            h = m - 1
        } else {
            l = m + 1
        }
    }

    return i
}

export function GT(a: any, y: any, c: any, l: any, h: any) {
    if (typeof c === "function") {
        return _GTP(
            a,
            l === void 0 ? 0 : l | 0,
            h === void 0 ? a.length - 1 : h | 0,
            y,
            c
        )
    } else {
        return _GTA(
            a,
            c === void 0 ? 0 : c | 0,
            l === void 0 ? a.length - 1 : l | 0,
            y
        )
    }
}

function _LTA(a: any, l: any, h: any, y: any) {
    var i = l - 1

    while (l <= h) {
        var m = (l + h) >>> 1,
            x = a[m]

        if (x < y) {
            i = m
            l = m + 1
        } else {
            h = m - 1
        }
    }

    return i
}

function _LTP(
    a: any,
    l: any,
    h: any,
    y: any,
    c: (arg0: any, arg1: any) => any
) {
    var i = l - 1

    while (l <= h) {
        var m = (l + h) >>> 1,
            x = a[m]

        if (c(x, y) < 0) {
            i = m
            l = m + 1
        } else {
            h = m - 1
        }
    }

    return i
}

export function LT(a: any, y: any, c: any, l: any, h: any) {
    if (typeof c === "function") {
        return _LTP(
            a,
            l === void 0 ? 0 : l | 0,
            h === void 0 ? a.length - 1 : h | 0,
            y,
            c
        )
    } else {
        return _LTA(
            a,
            c === void 0 ? 0 : c | 0,
            l === void 0 ? a.length - 1 : l | 0,
            y
        )
    }
}

function _LEA(a: any, l: any, h: any, y: any) {
    var i = l - 1

    while (l <= h) {
        var m = (l + h) >>> 1,
            x = a[m]

        if (x <= y) {
            i = m
            l = m + 1
        } else {
            h = m - 1
        }
    }

    return i
}

function _LEP(
    a: any,
    l: any,
    h: any,
    y: any,
    c: (arg0: any, arg1: any) => any
) {
    var i = l - 1

    while (l <= h) {
        var m = (l + h) >>> 1,
            x = a[m]

        if (c(x, y) <= 0) {
            i = m
            l = m + 1
        } else {
            h = m - 1
        }
    }

    return i
}

export function LE(a: any, y: any, c: any, l: any, h: any) {
    if (typeof c === "function") {
        return _LEP(
            a,
            l === void 0 ? 0 : l | 0,
            h === void 0 ? a.length - 1 : h | 0,
            y,
            c
        )
    } else {
        return _LEA(
            a,
            c === void 0 ? 0 : c | 0,
            l === void 0 ? a.length - 1 : l | 0,
            y
        )
    }
}

function _EQA(a: any, l: any, h: any, y: any) {
    l - 1

    while (l <= h) {
        var m = (l + h) >>> 1,
            x = a[m]

        if (x === y) {
            return m
        } else if (x <= y) {
            l = m + 1
        } else {
            h = m - 1
        }
    }

    return -1
}

function _EQP(
    a: any,
    l: any,
    h: any,
    y: any,
    c: (arg0: any, arg1: any) => any
) {
    l - 1

    while (l <= h) {
        var m = (l + h) >>> 1,
            x = a[m]
        var p = c(x, y)

        if (p === 0) {
            return m
        } else if (p <= 0) {
            l = m + 1
        } else {
            h = m - 1
        }
    }

    return -1
}

export function EQ(a: any, y: any, c: any, l: any, h: any) {
    if (typeof c === "function") {
        return _EQP(
            a,
            l === void 0 ? 0 : l | 0,
            h === void 0 ? a.length - 1 : h | 0,
            y,
            c
        )
    } else {
        return _EQA(
            a,
            c === void 0 ? 0 : c | 0,
            l === void 0 ? a.length - 1 : l | 0,
            y
        )
    }
}

// export default {
//     ge: dispatchBsearchGE,
//     gt: dispatchBsearchGT,
//     lt: dispatchBsearchLT,
//     le: dispatchBsearchLE,
//     eq: dispatchBsearchEQ,
// }
