"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

var React = _interopRequireWildcard(require("react"));

var _immutable = _interopRequireDefault(require("immutable"));

var _defaultCellDataGetter = _interopRequireDefault(require("./defaultCellDataGetter"));

var _defaultCellRenderer = _interopRequireDefault(require("./defaultCellRenderer"));

var _defaultHeaderRenderer = _interopRequireDefault(require("./defaultHeaderRenderer"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

describe('Column', function () {
  var rowData = _immutable["default"].Map({
    foo: 'Foo',
    bar: 1
  });

  describe('defaultCellDataGetter', function () {
    it('should return a value for specified attributes', function () {
      expect((0, _defaultCellDataGetter["default"])({
        dataKey: 'foo',
        rowData: rowData
      })).toEqual('Foo');
      expect((0, _defaultCellDataGetter["default"])({
        dataKey: 'bar',
        rowData: rowData
      })).toEqual(1);
    });
    it('should return undefined for missing attributes', function () {
      expect((0, _defaultCellDataGetter["default"])({
        dataKey: 'baz',
        rowData: rowData
      })).toEqual(undefined);
    });
  });
  describe('defaultCellRenderer', function () {
    it('should render a value for specified attributes', function () {
      expect((0, _defaultCellRenderer["default"])({
        cellData: 'Foo',
        dataKey: 'foo',
        rowData: rowData,
        rowIndex: 0
      })).toEqual('Foo');
      expect((0, _defaultCellRenderer["default"])({
        cellData: 1,
        dataKey: 'bar',
        rowData: rowData,
        rowIndex: 0
      })).toEqual('1');
    });
    it('should render empty string for null or missing attributes', function () {
      expect((0, _defaultCellRenderer["default"])({
        cellData: null,
        dataKey: 'baz',
        rowData: rowData,
        rowIndex: 0
      })).toEqual('');
      expect((0, _defaultCellRenderer["default"])({
        cellData: undefined,
        dataKey: 'baz',
        rowData: rowData,
        rowIndex: 0
      })).toEqual('');
    });
  });
  describe('defaultHeaderRenderer', function () {
    it('should render a value for specified attributes', function () {
      expect((0, _defaultHeaderRenderer["default"])({
        dataKey: 'foo',
        label: 'squirrel'
      })[0].props.children).toEqual('squirrel');
      var label = /*#__PURE__*/React.createElement("div", {
        className: "rabbit"
      }, "Rabbit");
      expect((0, _defaultHeaderRenderer["default"])({
        dataKey: 'bar',
        label: label
      })[0].props.children).toEqual(label);
    });
    it('should render empty string for null or missing attributes', function () {
      expect((0, _defaultHeaderRenderer["default"])({
        dataKey: 'foo',
        label: null
      })[0].props.children).toBeNull();
      expect((0, _defaultHeaderRenderer["default"])({
        dataKey: 'bar',
        label: undefined
      })[0].props.children).toBeUndefined();
    });
  });
});