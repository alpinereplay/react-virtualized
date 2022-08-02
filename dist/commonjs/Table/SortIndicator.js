"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = SortIndicator;

var _clsx = _interopRequireDefault(require("clsx"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _SortDirection = _interopRequireDefault(require("./SortDirection"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Displayed beside a header to indicate that a Table is currently sorted by this column.
 */
function SortIndicator(_ref) {
  var sortDirection = _ref.sortDirection;
  var classNames = (0, _clsx["default"])('ReactVirtualized__Table__sortableHeaderIcon', {
    'ReactVirtualized__Table__sortableHeaderIcon--ASC': sortDirection === _SortDirection["default"].ASC,
    'ReactVirtualized__Table__sortableHeaderIcon--DESC': sortDirection === _SortDirection["default"].DESC
  });
  return /*#__PURE__*/React.createElement("svg", {
    className: classNames,
    width: 18,
    height: 18,
    viewBox: "0 0 24 24"
  }, sortDirection === _SortDirection["default"].ASC ? /*#__PURE__*/React.createElement("path", {
    d: "M7 14l5-5 5 5z"
  }) : /*#__PURE__*/React.createElement("path", {
    d: "M7 10l5 5 5-5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }));
}

SortIndicator.propTypes = process.env.NODE_ENV !== "production" ? {
  sortDirection: _propTypes["default"].oneOf([_SortDirection["default"].ASC, _SortDirection["default"].DESC])
} : {};