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
exports.IntervalTree = exports.createIntervalTree = exports.IntervalTreeNode = void 0;
/**
 * Binary Search Bounds
 * https://github.com/mikolalysenko/interval-tree-1d
 * Mikola Lysenko
 *
 * Inlined because of Content Security Policy issue caused by the use of `new Function(...)` syntax in an upstream dependency.
 * Issue reported here: https://github.com/mikolalysenko/binary-search-bounds/issues/5
 **/
const bounds = __importStar(require("./binarySearchBounds"));
var NOT_FOUND = 0;
var SUCCESS = 1;
var EMPTY = 2;
class IntervalTreeNode {
    mid;
    left;
    right;
    leftPoints;
    rightPoints;
    count;
    constructor(mid, left, right, leftPoints, rightPoints) {
        this.mid = mid;
        this.left = left;
        this.right = right;
        this.leftPoints = leftPoints;
        this.rightPoints = rightPoints;
        this.count =
            (left ? left.count : 0) +
                (right ? right.count : 0) +
                leftPoints.length;
    }
    static copy(a, b) {
        a.mid = b.mid;
        a.left = b.left;
        a.right = b.right;
        a.leftPoints = b.leftPoints;
        a.rightPoints = b.rightPoints;
        a.count = b.count;
    }
    static rebuild(node, intervals) {
        var ntree = createIntervalTree(intervals);
        if (ntree) {
            node.mid = ntree.mid;
            node.left = ntree.left;
            node.right = ntree.right;
            node.leftPoints = ntree.leftPoints;
            node.rightPoints = ntree.rightPoints;
            node.count = ntree.count;
        }
    }
    static rebuildWithInterval(node, interval) {
        var intervals = node.intervals([]);
        intervals.push(interval);
        this.rebuild(node, intervals);
    }
    static rebuildWithoutInterval(node, interval) {
        var intervals = node.intervals([]);
        var idx = intervals.indexOf(interval);
        if (idx < 0) {
            return NOT_FOUND;
        }
        intervals.splice(idx, 1);
        this.rebuild(node, intervals);
        return SUCCESS;
    }
    intervals(result) {
        result.push.apply(result, this.leftPoints);
        if (this.left) {
            this.left.intervals(result);
        }
        if (this.right) {
            this.right.intervals(result);
        }
        return result;
    }
    insert(interval) {
        var weight = this.count - this.leftPoints.length;
        this.count += 1;
        if (interval[1] < this.mid) {
            if (this.left) {
                if (4 * (this.left.count + 1) > 3 * (weight + 1)) {
                    IntervalTreeNode.rebuildWithInterval(this, interval);
                }
                else {
                    this.left.insert(interval);
                }
            }
            else {
                this.left = createIntervalTree([interval]);
            }
        }
        else if (interval[0] > this.mid) {
            if (this.right) {
                if (4 * (this.right.count + 1) > 3 * (weight + 1)) {
                    IntervalTreeNode.rebuildWithInterval(this, interval);
                }
                else {
                    this.right.insert(interval);
                }
            }
            else {
                this.right = createIntervalTree([interval]);
            }
        }
        else {
            var l = bounds.GE(this.leftPoints, interval, compareBegin);
            var r = bounds.GE(this.rightPoints, interval, compareEnd);
            this.leftPoints.splice(l, 0, interval);
            this.rightPoints.splice(r, 0, interval);
        }
    }
    remove(interval) {
        var weight = this.count - this.leftPoints.length;
        if (interval[1] < this.mid) {
            if (!this.left) {
                return NOT_FOUND;
            }
            var rw = this.right ? this.right.count : 0;
            if (4 * rw > 3 * (weight - 1)) {
                return IntervalTreeNode.rebuildWithoutInterval(this, interval);
            }
            var r = this.left.remove(interval);
            if (r === EMPTY) {
                this.left = null;
                this.count -= 1;
                return SUCCESS;
            }
            else if (r === SUCCESS) {
                this.count -= 1;
            }
            return r;
        }
        else if (interval[0] > this.mid) {
            if (!this.right) {
                return NOT_FOUND;
            }
            var lw = this.left ? this.left.count : 0;
            if (4 * lw > 3 * (weight - 1)) {
                return IntervalTreeNode.rebuildWithoutInterval(this, interval);
            }
            var r = this.right.remove(interval);
            if (r === EMPTY) {
                this.right = null;
                this.count -= 1;
                return SUCCESS;
            }
            else if (r === SUCCESS) {
                this.count -= 1;
            }
            return r;
        }
        else {
            if (this.count === 1) {
                if (this.leftPoints[0] === interval) {
                    return EMPTY;
                }
                else {
                    return NOT_FOUND;
                }
            }
            if (this.leftPoints.length === 1 &&
                this.leftPoints[0] === interval) {
                if (this.left && this.right) {
                    var p = this;
                    var n = this.left;
                    while (n.right) {
                        p = n;
                        n = n.right;
                    }
                    if (p === this) {
                        n.right = this.right;
                    }
                    else {
                        var ll = this.left;
                        var rr = this.right;
                        p.count -= n.count;
                        p.right = n.left;
                        n.left = ll;
                        n.right = rr;
                    }
                    IntervalTreeNode.copy(this, n);
                    this.count =
                        (this.left ? this.left.count : 0) +
                            (this.right ? this.right.count : 0) +
                            this.leftPoints.length;
                }
                else if (this.left) {
                    IntervalTreeNode.copy(this, this.left);
                }
                else if (this.right) {
                    IntervalTreeNode.copy(this, this.right);
                }
                return SUCCESS;
            }
            for (var lll = bounds.GE(this.leftPoints, interval, compareBegin); lll < this.leftPoints.length; ++lll) {
                if (this.leftPoints[lll][0] !== interval[0]) {
                    break;
                }
                if (this.leftPoints[lll] === interval) {
                    this.count -= 1;
                    this.leftPoints.splice(lll, 1);
                    for (var rrr = bounds.GE(this.rightPoints, interval, compareEnd); rrr < this.rightPoints.length; ++rrr) {
                        if (this.rightPoints[rrr][1] !== interval[1]) {
                            break;
                        }
                        else if (this.rightPoints[rrr] === interval) {
                            this.rightPoints.splice(rrr, 1);
                            return SUCCESS;
                        }
                    }
                }
            }
            return NOT_FOUND;
        }
    }
    reportLeftRange(arr, hi, cb) {
        for (var i = 0; i < arr.length && arr[i][0] <= hi; ++i) {
            var r = cb(arr[i]);
            if (r) {
                return r;
            }
        }
    }
    reportRightRange(arr, lo, cb) {
        for (var i = arr.length - 1; i >= 0 && arr[i][1] >= lo; --i) {
            var r = cb(arr[i]);
            if (r) {
                return r;
            }
        }
    }
    reportRange(arr, cb) {
        for (var i = 0; i < arr.length; ++i) {
            var r = cb(arr[i]);
            if (r) {
                return r;
            }
        }
    }
    queryPoint(x, cb) {
        if (x < this.mid) {
            if (this.left) {
                var r = this.left.queryPoint(x, cb);
                if (r) {
                    return r;
                }
            }
            return this.reportLeftRange(this.leftPoints, x, cb);
        }
        else if (x > this.mid) {
            if (this.right) {
                var r = this.right.queryPoint(x, cb);
                if (r) {
                    return r;
                }
            }
            return this.reportRightRange(this.rightPoints, x, cb);
        }
        else {
            return this.reportRange(this.leftPoints, cb);
        }
    }
    queryInterval(lo, hi, cb) {
        if (lo < this.mid && this.left) {
            var r = this.left.queryInterval(lo, hi, cb);
            if (r) {
                return r;
            }
        }
        if (hi > this.mid && this.right) {
            var r = this.right.queryInterval(lo, hi, cb);
            if (r) {
                return r;
            }
        }
        if (hi < this.mid) {
            return this.reportLeftRange(this.leftPoints, hi, cb);
        }
        else if (lo > this.mid) {
            return this.reportRightRange(this.rightPoints, lo, cb);
        }
        else {
            return this.reportRange(this.leftPoints, cb);
        }
    }
}
exports.IntervalTreeNode = IntervalTreeNode;
function compareNumbers(a, b) {
    return a - b;
}
function compareBegin(a, b) {
    var d = a[0] - b[0];
    if (d) {
        return d;
    }
    return a[1] - b[1];
}
function compareEnd(a, b) {
    var d = a[1] - b[1];
    if (d) {
        return d;
    }
    return a[0] - b[0];
}
function createIntervalTree(intervals) {
    if (intervals.length === 0) {
        return null;
    }
    var pts = [];
    for (var i = 0; i < intervals.length; ++i) {
        pts.push(intervals[i][0], intervals[i][1]);
    }
    pts.sort(compareNumbers);
    var mid = pts[pts.length >> 1];
    var leftIntervals = [];
    var rightIntervals = [];
    var centerIntervals = [];
    for (var i = 0; i < intervals.length; ++i) {
        var s = intervals[i];
        if (s[1] < mid) {
            leftIntervals.push(s);
        }
        else if (mid < s[0]) {
            rightIntervals.push(s);
        }
        else {
            centerIntervals.push(s);
        }
    }
    //Split center intervals
    var leftPoints = centerIntervals;
    var rightPoints = centerIntervals.slice();
    leftPoints.sort(compareBegin);
    rightPoints.sort(compareEnd);
    return new IntervalTreeNode(mid, createIntervalTree(leftIntervals), createIntervalTree(rightIntervals), leftPoints, rightPoints);
}
exports.createIntervalTree = createIntervalTree;
//User friendly wrapper that makes it possible to support empty trees
class IntervalTree {
    root = null;
    constructor(root) {
        this.root = root;
    }
    insert(interval) {
        if (this.root) {
            this.root.insert(interval);
        }
        else {
            this.root = new IntervalTreeNode(interval[0], null, null, [interval], [interval]);
        }
    }
    remove(interval) {
        if (this.root) {
            var r = this.root.remove(interval);
            if (r === EMPTY) {
                this.root = null;
            }
            return r !== NOT_FOUND;
        }
        return false;
    }
    queryPoint(p, cb) {
        if (this.root) {
            return this.root.queryPoint(p, cb);
        }
    }
    queryInterval(lo, hi, cb) {
        if (lo <= hi && this.root) {
            return this.root.queryInterval(lo, hi, cb);
        }
    }
    get count() {
        if (this.root) {
            return this.root.count;
        }
        return 0;
    }
    get intervals() {
        if (this.root) {
            return this.root.intervals([]);
        }
        return [];
    }
}
exports.IntervalTree = IntervalTree;
//# sourceMappingURL=intervalTree.js.map