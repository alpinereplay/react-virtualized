"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

var React = _interopRequireWildcard(require("react"));

var ReactDOMServer = _interopRequireWildcard(require("react-dom/server"));

var _Grid = _interopRequireDefault(require("./Grid"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * 
 * @jest-environment node
 */
test('should render Grid with dom server', function () {
  var rendered = ReactDOMServer.renderToString( /*#__PURE__*/React.createElement(_Grid["default"], {
    cellRenderer: function cellRenderer(_ref) {
      var style = _ref.style,
          key = _ref.key,
          rowIndex = _ref.rowIndex,
          columnIndex = _ref.columnIndex;
      return /*#__PURE__*/React.createElement("div", {
        style: style,
        key: key
      }, rowIndex + ':' + columnIndex);
    },
    columnCount: 1000,
    columnWidth: 20,
    height: 500,
    rowCount: 1000,
    rowHeight: 20,
    width: 500
  }));
  expect(rendered).toContain('0:0');
  expect(rendered).toContain('24:24');
  expect(rendered).not.toContain('25:25');
});
test('should support :scrollToColumn and :scrollToRow in server render', function () {
  var rendered = ReactDOMServer.renderToString( /*#__PURE__*/React.createElement(_Grid["default"], {
    cellRenderer: function cellRenderer(_ref2) {
      var style = _ref2.style,
          key = _ref2.key,
          rowIndex = _ref2.rowIndex,
          columnIndex = _ref2.columnIndex;
      return /*#__PURE__*/React.createElement("div", {
        style: style,
        key: key
      }, rowIndex + ':' + columnIndex);
    },
    columnCount: 1000,
    columnWidth: 20,
    scrollToColumn: 250,
    height: 500,
    rowCount: 1000,
    rowHeight: 20,
    scrollToRow: 250,
    width: 500
  }));
  expect(rendered).toContain('250:250');
  expect(rendered).not.toContain('0:0');
});