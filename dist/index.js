'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs);

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/**
 * 日志标准化工具
 * @param log 日志内容
 * @param filter 日志过滤器
 */
var formatter = function formatter(log, filter) {
  if (!log) {
    return [];
  } else {
    log = log.replace(/\r\n/g, "\n");
  }

  if (!!filter) {
    return log.split("\n").filter(function (item) {
      return !filter.test(item) && !!item;
    });
  } else {
    return log.split("\n").filter(function (item) {
      return !!item;
    });
  }
};
/**
 * 从本地读取日志
 * @param path 本地路径
 */

var readFromPath = function readFromPath(path, mode) {
  if (!path) {
    return null;
  } // 过滤后缀.error.log .access.log .error.log.1


  var fileRegex = /\.?([error|access]+).log(.[0-9]+)?(.gz)?$/;

  if (!mode || mode === "nginx") {
    // 过滤获取文件信息
    var files = fs__namespace.readdirSync(path, {
      encoding: "utf-8"
    }).filter(function (item) {
      // 更改filter条件
      var res = fileRegex.exec(item);

      if (!!res && ["access", "error"].includes(res[1]) && !res[3]) {
        return true;
      } else {
        return false;
      }
    });

    if (files.length === 0) {
      return null;
    }

    var result = files.map(function (item) {
      var content = fs__namespace.readFileSync("".concat(path, "/").concat(item), {
        encoding: "utf-8"
      });
      return {
        from: item,
        content: content
      };
    }).filter(function (item) {
      return !!item.content;
    });
    return result;
  }
};

/**
 * 日志分拣器
 * @param log 日志文件
 * @param mode
 */
var sorter = function sorter(log, mode, fn) {
  if (!log) {
    return null;
  }

  if (!mode || mode === "nginx") {
    // nginx日志标准化处理
    var regex = /(([0-9]{1,3}.?)+)\s*-\s*-\s*\[([^[]+)\]\s*\"([^"]+)\"\s*([0-9]{3})\s*([0-9]+)\s*\"([^"]+)\"\s*\"([^"]+)\"/;
    var result = log.map(function (item) {
      var res = regex.exec(item); // 转化为数组输出

      if (!!res) {
        return _toConsumableArray(res.filter(function (val, index) {
          return !(index === 2);
        }));
      }
    });
    return {
      labels: ["raw", "ip", "time", "request", "status", "code", "url", "ua"],
      content: result
    };
  }

  if (mode === "custom") {
    if (!fn) {
      throw new Error("No custom sorter function found!");
    }

    var _fn = fn(log),
        labels = _fn.labels,
        content = _fn.content;

    if (labels.length > content[0].length) {
      throw new Error("Length of labels is more long than content");
    } else {
      return {
        labels: labels,
        content: content
      };
    }
  }
};

var LogMonitor = function LogMonitor(opts) {
  var _this = this;

  _classCallCheck(this, LogMonitor);

  _defineProperty(this, "log", void 0);

  _defineProperty(this, "path", void 0);

  _defineProperty(this, "mode", "nginx");

  _defineProperty(this, "filter", void 0);

  _defineProperty(this, "custom", void 0);

  _defineProperty(this, "export", function () {
    if (!!_this.path) {
      var logs = readFromPath(_this.path, _this.mode);

      if (!!logs && logs.length !== 0) {
        // 日志存在
        var result = [];
        logs.forEach(function (item) {
          var afterFormat = formatter(item.content, _this.filter);

          if (afterFormat.length === 0) {
            result.push({
              from: item.from,
              logs: {
                labels: [],
                content: []
              }
            });
          } else {
            var afterSorted = sorter(afterFormat);

            if (!!afterSorted) {
              result.push({
                from: item.from,
                logs: afterSorted
              });
            }
          }
        });
        return result;
      } else {
        return null;
      }
    } else if (!!_this.log) ;
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
