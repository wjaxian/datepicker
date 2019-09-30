(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ja', ['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    global.W = global.W || {};
    global.W.lang = global.W.lang || {};

    factory(mod.exports);
    global.W.lang = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  exports.__esModule = true;
  var ja = exports.ja = {
    datepicker: {
      now: '現在',
      today: '今日',
      cancel: 'キャンセル',
      clear: 'クリア',
      confirm: 'OK',
      selectDate: '日付を選択',
      selectTime: '時間を選択',
      startDate: '開始日',
      startTime: '開始時間',
      endDate: '終了日',
      endTime: '終了時間',
      prevYear: '前年',
      nextYear: '翌年',
      prevMonth: '前月',
      nextMonth: '翌月',
      year: '年',
      month1: '1月',
      month2: '2月',
      month3: '3月',
      month4: '4月',
      month5: '5月',
      month6: '6月',
      month7: '7月',
      month8: '8月',
      month9: '9月',
      month10: '10月',
      month11: '11月',
      month12: '12月',
      // week: '週次',
      weeks: {
        sun: '日',
        mon: '月',
        tue: '火',
        wed: '水',
        thu: '木',
        fri: '金',
        sat: '土'
      },
      months: {
        jan: '1月',
        feb: '2月',
        mar: '3月',
        apr: '4月',
        may: '5月',
        jun: '6月',
        jul: '7月',
        aug: '8月',
        sep: '9月',
        oct: '10月',
        nov: '11月',
        dec: '12月'
      }
    }
  };

  exports.default = ja;
});