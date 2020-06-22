(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('locale', ['exports', '../locale'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../locale'));
  } else {
    var mod = {
      exports: {}
    };
    global = global || window;
    global.W = global.W || {};
    global.W.mixins = global.W.mixins || {};

    factory(mod.exports, global.W.mixins);
    global.locale = mod.exports;
  }
})(this, function (exports, _locale) {
  'use strict';

  exports.__esModule = true;
  exports.default = {
    methods: {
      t: function t() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _locale.t.apply(this, args);
      }
    }
  };
  module.exports = exports.default;
});