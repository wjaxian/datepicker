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

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    methods: {
      t: function (...args) {
        return _locale.t.apply(this, args);
      }
    }
  };
});