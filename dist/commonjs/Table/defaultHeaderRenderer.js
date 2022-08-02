"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = defaultHeaderRenderer;

var React = _interopRequireWildcard(require("react"));

var _SortIndicator = _interopRequireDefault(require("./SortIndicator"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Default table header renderer.
 */
function defaultHeaderRenderer(_ref
/*:: */
) {
  var dataKey = _ref
  /*:: */
  .dataKey,
      label = _ref
  /*:: */
  .label,
      sortBy = _ref
  /*:: */
  .sortBy,
      sortDirection = _ref
  /*:: */
  .sortDirection;
  var showSortIndicator = sortBy === dataKey;
  var children = [/*#__PURE__*/React.createElement("span", {
    className: "ReactVirtualized__Table__headerTruncatedText",
    key: "label",
    title: typeof label === 'string' ? label : null
  }, label)];

  if (showSortIndicator) {
    children.push( /*#__PURE__*/React.createElement(_SortIndicator["default"], {
      key: "SortIndicator",
      sortDirection: sortDirection
    }));
  }

  return children;
}