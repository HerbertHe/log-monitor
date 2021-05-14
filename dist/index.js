'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/**
 * 自定义解析日志类型
 * @param sorter 自定义分拣器函数
 */
var LogMonitor = function LogMonitor(opts) {
  var _this = this;

  _classCallCheck(this, LogMonitor);

  _defineProperty(this, "log", void 0);

  _defineProperty(this, "path", void 0);

  _defineProperty(this, "mode", "nginx");

  _defineProperty(this, "filter", void 0);

  _defineProperty(this, "custom", void 0);

  _defineProperty(this, "export", function () {
    if (!!_this.path) ; else if (!!_this.log) ;
  });

  var log = opts.log,
      path = opts.path,
      mode = opts.mode,
      filter = opts.filter,
      custom = opts.custom;
  this.log = log;
  this.path = path;
  this.mode = mode;
  this.filter = filter;
  this.custom = custom;
};

exports.LogMonitor = LogMonitor;
