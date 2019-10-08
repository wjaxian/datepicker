(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('index', ['exports', 'vue', 'deepmerge', './lang/zh_CN'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('vue'), require('deepmerge'), require('./lang/zh_CN'));
  } else {
    var mod = {
      exports: {}
    };
    global = global || window;
    global.W = global.W || {};
    global.W.locale = global.W.locale || {};

    factory(mod.exports, global.vue, global.deepmerge, global.zh_CN);
    global.W.locale = mod.exports;
  }
})(this, function (exports, _vue, _deepmerge, _zh_CN) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.i18n = exports.use = exports.t = undefined;

  var _vue2 = _interopRequireDefault(_vue);

  var _deepmerge2 = _interopRequireDefault(_deepmerge);

  var _zh_CN2 = _interopRequireDefault(_zh_CN);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var lang = _zh_CN2.default;
  var isOn = false;

  var i18n_$t = function () {
    var $t = Object.getPrototypeOf(this || _vue2.default).$t;
    if (typeof $t === 'function' && !!_vue2.default.locale) {
      if (!isOn) {
        isOn = true;
        _vue2.default.locale(_vue2.default.config.lang, (0, _deepmerge2.default)(lang, _vue2.default.locale(_vue2.default.config.lang) || {}, { clone: true }));
      }
      return $t.apply(this, arguments);
    }
  };

  var t = exports.t = function (path = '') {
    var value = i18n_$t.apply(this, arguments);
    if (value !== null && value !== undefined) return value;

    var attributes = path.split('.');

    var get = function (arr, obj) {
      if (!arr.length) return obj;
      var narr = arr.slice(1);
      return get(narr, obj[arr[0]]);
    };

    return get(attributes, lang);
  };

  var use = exports.use = function (nlang) {
    lang = nlang || lang;
  };

  var i18n = exports.i18n = function (fn) {
    i18n_$t = fn || i18n_$t;
  };

  exports.default = {
    use: use,
    t: t,
    i18n: i18n
  };
});