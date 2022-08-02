"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

var React = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _TestUtils = require("../TestUtils");

var _ScrollSync = _interopRequireDefault(require("./ScrollSync"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ChildComponent(_ref) {
  var clientHeight = _ref.clientHeight,
      clientWidth = _ref.clientWidth,
      scrollHeight = _ref.scrollHeight,
      scrollLeft = _ref.scrollLeft,
      scrollTop = _ref.scrollTop,
      scrollWidth = _ref.scrollWidth;
  return /*#__PURE__*/React.createElement("div", null, "clientHeight:".concat(clientHeight), "clientWidth:".concat(clientWidth), "scrollHeight:".concat(scrollHeight), "scrollLeft:".concat(scrollLeft), "scrollTop:".concat(scrollTop), "scrollWidth:".concat(scrollWidth));
}

describe('ScrollSync', function () {
  it('should pass through an initial value of 0 for :scrollLeft and :scrollTop', function () {
    var component = (0, _TestUtils.render)( /*#__PURE__*/React.createElement(_ScrollSync["default"], null, function (_ref2) {
      var clientHeight = _ref2.clientHeight,
          clientWidth = _ref2.clientWidth,
          scrollHeight = _ref2.scrollHeight,
          scrollLeft = _ref2.scrollLeft,
          scrollTop = _ref2.scrollTop,
          scrollWidth = _ref2.scrollWidth;
      return /*#__PURE__*/React.createElement(ChildComponent, {
        clientHeight: clientHeight,
        clientWidth: clientWidth,
        scrollHeight: scrollHeight,
        scrollLeft: scrollLeft,
        scrollTop: scrollTop,
        scrollWidth: scrollWidth
      });
    }));
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('clientHeight:0');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('clientWidth:0');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollHeight:0');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollLeft:0');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollTop:0');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollWidth:0');
  });
  it('should update :scrollLeft and :scrollTop when :onScroll is called', function () {
    var onScroll;
    var component = (0, _TestUtils.render)( /*#__PURE__*/React.createElement(_ScrollSync["default"], null, function (params) {
      onScroll = params.onScroll;
      return /*#__PURE__*/React.createElement(ChildComponent, params);
    }));
    onScroll({
      clientHeight: 400,
      clientWidth: 200,
      scrollHeight: 1000,
      scrollLeft: 50,
      scrollTop: 100,
      scrollWidth: 500
    });
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('clientHeight:400');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('clientWidth:200');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollHeight:1000');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollLeft:50');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollTop:100');
    expect((0, _reactDom.findDOMNode)(component).textContent).toContain('scrollWidth:500');
  });
});