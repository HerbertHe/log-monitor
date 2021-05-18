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
    });

    if (files.length === 0) {
      return null;
    }

    var result = [];

    for (var i = 0; i < files.length; i++) {
      var res = fileRegex.exec(files[i]);

      if (!!res && ["access", "error"].includes(res[1]) && !res[3]) {
        var content = fs__namespace.readFileSync("".concat(path, "/").concat(files[i]), {
          encoding: "utf-8"
        });
        result.push({
          from: files[i],
          type: res[1],
          content: content
        });
      }
    }

    return result.filter(function (item) {
      return !!item.content;
    });
  }
};

/**
 * 日志分拣器
 * @param log
 * @param type
 * @param mode
 * @param fn
 */
var sorter = function sorter(log, type, mode, fn) {
  if (!log) {
    return null;
  }

  if (!mode || mode === "nginx") {
    // nginx日志标准化处理
    if (type === "access") {
      var regex = /(([0-9]{1,3}.?)+)\s*-\s*-\s*\[([^[]+)\]\s*\"([^"]*)\"\s*([0-9]{3})\s*([0-9]+)\s*\"([^"]+)\"\s*\"([^"]+)\"/;
      var result = log.map(function (item) {
        var res = regex.exec(item); // 转化为数组输出

        if (!!res) {
          return _toConsumableArray(res.filter(function (val, index) {
            return !(index === 2);
          }));
        }
      }).filter(function (item) {
        return !!item;
      });
      return {
        labels: ["raw", "ip", "time", "request", "status", "bytes", "referer", "ua"],
        content: result
      };
    }

    if (type === "error") {
      var _regex = /([0-9]{4}\/[0-9]{2}\/[0-9]{2} ([0-9]{2}:?)+)\s*\[([a-z]+)\]\s*([0-9#]+):\s*\*([0-9]+)\s*([^,]+),\s*(client:\s*[^,]+),\s*(server:\s*[^,]+),\s*(request:\s*\"[^"]+\"),? ?(upstream:\s*\"[^"]+\")?(host:\s*\"[^"]+\")?,? ?(referrer:\s*\"[^"]+\")?/;

      var _result = log.map(function (item) {
        var res = _regex.exec(item); // 转化为数组输出


        if (!!res) {
          var tmp = [];

          for (var i = 0; i < res.length; i++) {
            if (i !== 2) {
              if (!res[i]) {
                tmp.push("");
                continue;
              }

              tmp.push(res[i]);
            }
          }

          return tmp;
        }
      }).filter(function (item) {
        return !!item;
      });

      return {
        labels: ["raw", "time", "level", "pid", "message", "client", "server", "request", "upstream", "host", "referrer"],
        content: _result
      };
    }
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
              type: item.type,
              logs: {
                labels: [],
                content: []
              }
            });
          } else {
            var afterSorted = sorter(afterFormat, item.type);

            if (!!afterSorted) {
              result.push({
                from: item.from,
                type: item.type,
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
