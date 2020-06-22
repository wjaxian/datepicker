(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ko', ['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    global = global || window;
    global.W = global.W || {};
    global.W.lang = global.W.lang || {};

    factory(mod.exports);
    global.W.lang = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  exports.__esModule = true;
  exports.default = {
    datepicker: {
      now: '지금',
      today: '오늘',
      cancel: '취소',
      clear: '초기화',
      confirm: '확인',
      selectDate: '날짜 선택',
      selectTime: '시간 선택',
      startDate: '시작 날짜',
      startTime: '시작 시간',
      endDate: '종료 날짜',
      endTime: '종료 시간',
      prevYear: '지난해',
      nextYear: '다음해',
      prevMonth: '지난달',
      nextMonth: '다음달',
      year: '년',
      month1: '1월',
      month2: '2월',
      month3: '3월',
      month4: '4월',
      month5: '5월',
      month6: '6월',
      month7: '7월',
      month8: '8월',
      month9: '9월',
      month10: '10월',
      month11: '11월',
      month12: '12월',
      // week: 'week',
      weeks: {
        sun: '일',
        mon: '월',
        tue: '화',
        wed: '수',
        thu: '목',
        fri: '금',
        sat: '토'
      },
      months: {
        jan: '1월',
        feb: '2월',
        mar: '3월',
        apr: '4월',
        may: '5월',
        jun: '6월',
        jul: '7월',
        aug: '8월',
        sep: '9월',
        oct: '10월',
        nov: '11월',
        dec: '12월'
      }
    }
  };
  module.exports = exports.default;
});