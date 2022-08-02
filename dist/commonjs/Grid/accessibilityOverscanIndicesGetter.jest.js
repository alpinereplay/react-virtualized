"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

var _accessibilityOverscanIndicesGetter = _interopRequireWildcard(require("./accessibilityOverscanIndicesGetter"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

describe('overscanIndicesGetter', function () {
  function testHelper(_ref) {
    var cellCount = _ref.cellCount,
        startIndex = _ref.startIndex,
        stopIndex = _ref.stopIndex,
        overscanCellsCount = _ref.overscanCellsCount,
        scrollDirection = _ref.scrollDirection;
    return (0, _accessibilityOverscanIndicesGetter["default"])({
      cellCount: cellCount,
      overscanCellsCount: overscanCellsCount,
      scrollDirection: scrollDirection,
      startIndex: startIndex,
      stopIndex: stopIndex
    });
  }

  it('should still overscan by 1 (for keyboard accessibility) if :overscanCellsCount is 0', function () {
    expect(testHelper({
      cellCount: 100,
      startIndex: 10,
      stopIndex: 20,
      overscanCellsCount: 0,
      scrollDirection: _accessibilityOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD
    })).toEqual({
      overscanStartIndex: 9,
      overscanStopIndex: 21
    });
    expect(testHelper({
      cellCount: 100,
      startIndex: 10,
      stopIndex: 20,
      overscanCellsCount: 0,
      scrollDirection: _accessibilityOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD
    })).toEqual({
      overscanStartIndex: 9,
      overscanStopIndex: 21
    });
  });
  it('should overscan forward', function () {
    expect(testHelper({
      cellCount: 100,
      startIndex: 20,
      stopIndex: 30,
      overscanCellsCount: 10,
      scrollDirection: _accessibilityOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD
    })).toEqual({
      overscanStartIndex: 19,
      overscanStopIndex: 40
    });
  });
  it('should overscan backward', function () {
    expect(testHelper({
      cellCount: 100,
      startIndex: 20,
      stopIndex: 30,
      overscanCellsCount: 10,
      scrollDirection: _accessibilityOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD
    })).toEqual({
      overscanStartIndex: 10,
      overscanStopIndex: 31
    });
  });
  it('should not overscan beyond the start of the list', function () {
    expect(testHelper({
      cellCount: 100,
      startIndex: 5,
      stopIndex: 15,
      overscanCellsCount: 10,
      scrollDirection: _accessibilityOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD
    })).toEqual({
      overscanStartIndex: 0,
      overscanStopIndex: 16
    });
  });
  it('should not overscan beyond the end of the list', function () {
    expect(testHelper({
      cellCount: 25,
      startIndex: 10,
      stopIndex: 20,
      overscanCellsCount: 10,
      scrollDirection: _accessibilityOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD
    })).toEqual({
      overscanStartIndex: 9,
      overscanStopIndex: 24
    });
  });
});