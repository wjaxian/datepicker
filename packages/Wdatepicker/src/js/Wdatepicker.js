class Wdatepicker {
  constructor({ currentDate = new Date(), formatDate = 'YYYY/MM/DD hh:mm:ss', maxDate = '', minDate = '', disabledDate = []} = {}) {
    this.config({
      win: window,
      format: formatDate,
      maxDate: this.judgeType(maxDate),
      minDate: this.judgeType(minDate),
      disabledDate,
      currentDate
    })
  }

  config (options, isUpdateDate = !1) {
    Object.assign(this, options)
    this.init(options.currentDate, isUpdateDate)
  }

  currentMonthAllDate = []

  // 初始化时间(更新的时间, 是否执行更新)
  init (updateDate, isUpdateDate = !1) {
    let currentDate = this.judgeType(updateDate),
      { YYYY, MM, DD } = this.getCurrentDate(),
      nmonth = MM, // 当前月份
      ncurrentMonthDate = DD, // 当前月日期
      year = currentDate.getFullYear(),// 切换的年份
      month = currentDate.getMonth() + 1, // 切换的月份
      firstDay = new Date(year, month - 1, 1), // 当月第一天
      firstDayWeek = firstDay.getDay() // 当月第一天，周几
    if (firstDayWeek === 0) firstDayWeek = 7 // 如果当月第一天是周日把0转成7
    this.currentDate = isUpdateDate ? updateDate && currentDate || '' : this.currentDate ? this.judgeType(this.currentDate) : ''
    
    let lastDayOfLastMonth = new Date(year, month - 1, 0), // 获取上月最后一天
      lastDateOfLastMonth = lastDayOfLastMonth.getDate(), // 获取上月最后一天日期，总天数
      preMonthDayCount = firstDayWeek - 1, // 保存当月第一天周几的正常数据，因为系统从0开始，上方把0已经转换成7
      lastDay = new Date(year, month, 0), // 获取下个月最后一天
      lastDate = lastDay.getDate(), // 获取下个月最后一天日期，总天数
      selectYear = this.currentDate && this.currentDate.getFullYear(),// 当前选择的年份
      selectMonth = this.currentDate && this.currentDate.getMonth() + 1,// 当前选择的月份
      selectDate = this.currentDate && this.currentDate.getDate(),// 当前选择的日
      currentMonthDateData = []

    for (let i = 0; i < 42; i++) {
      let date = i + 1 - preMonthDayCount,
        showDate = date,
        thisMonth = month,
        otherTime = !1,
        disabledDate = !1
      if (date <= 0) {
        thisMonth = month - 1
        showDate = lastDateOfLastMonth + date
        otherTime = !0
        thisMonth == 0 && (year = currentDate.getFullYear() - 1)
      } else if (date > lastDate) {
        thisMonth = month + 1
        showDate = showDate - lastDate
        otherTime = !0
        thisMonth == 13 && (year = currentDate.getFullYear() + 1)
      } else {
        year = currentDate.getFullYear()
      }

      // 设置可选择的 最小时间 与 最大时间
      let cdate = this.judgeType(`${year}/${thisMonth}/${showDate}`),
          ctime = cdate.getTime()
      if (this.minDate.getTime() > ctime || this.maxDate.getTime() < ctime) {
        disabledDate = otherTime = !0
      }

      // 设置禁用状态
      if (this.disabledDate.constructor === Array) {
        this.disabledDate.map(v => {
          v = this.judgeType(v)
          if (ctime == v.getTime() && !disabledDate) {
            disabledDate = otherTime = !0
          }
        })
      } else if (this.disabledDate.constructor === Function && !disabledDate) {
        let state = this.disabledDate(currentDate, cdate, new Date())
        if (state) disabledDate = otherTime = state
      }

      if (thisMonth === 0) thisMonth = 12
      if (thisMonth === 13) thisMonth = 1
    
      currentMonthDateData.push({
        year,
        date: showDate,
        month: thisMonth,
        isCurrentDate: YYYY == year && thisMonth == nmonth && ncurrentMonthDate == showDate,
        isSelectDate: !!this.currentDate && year == selectYear && thisMonth == selectMonth && showDate == selectDate,
        otherTime,
        disabledDate,
        thisMonth: month
      })
    }

    this.currentMonthDateData = currentMonthDateData
    this.dataHandler(currentMonthDateData)
  }

  // 获取当前日期
  getCurrentDate () {
    let date = new Date(),
    yare = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds()	
    
    return {
      YYYY: yare,
      MM: this.addZiller(month),
      DD: this.addZiller(day),
      hh: this.addZiller(h),
      mm: this.addZiller(m),
      ss: this.addZiller(s)
    }
  }
  
  // 切换日期
  switchingDate (selectDate = '') {
    selectDate = this.judgeType(selectDate)
    let year = selectDate.getFullYear(),
        month = selectDate.getMonth() + 1,
        date = selectDate.getDate(),
        {hh, mm, ss} = this.getCurrentDate()
        
    this.currentMonthDateData.map(v => {
      v.isSelectDate = !1
      if (v.year == year && v.month == month && v.date == date) {
        v.isSelectDate = !0
        this.dataHandler(this.currentMonthDateData)
      }
    })

    let time = this.judgeType(`${this.formatDate(selectDate, 'YYYY/MM/DD')} ${hh}:${mm}:${ss}`)
    this.selectDate = time
    return this.formatDate(time, this.format)
  }

  // 判断类型
  judgeType (value = '') {
    let now = new Date()
    switch (value.constructor) {
      case String:
        value = value.replace(/[^\d:\s]/g, '/').match(/\d{4}\/\d{1,2}\/\d{1,2}/)
        value = value && value[0].split('/') || value
        return value && new Date(value[0], value[1] - 1, value[2], now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()) || new Date()
      case Number:
        value = ''+value
        value = value.length == 10 ? 1000 * value : value.length == 13 ? 1 * value : +new Date
        return new Date(value)
      case Date:
        return value
      default:
        this.throwWrong('Entry can only be a Date object, String, Number')
        return new Date()
    }
  }

  // 数据聚合
  dataHandler (arr) {
    let index = 0
    this.currentMonthAllDate = [[]]
    arr.map((item, i) => {
      i = i + 1
      if (index >= 6) return null
      this.currentMonthAllDate[index].push(item)
      if (i % 7 == 0) {
        index += 1
        if (index >= 6) return null
        this.currentMonthAllDate.push([])
      }
    })
  }

  // 补零
  addZiller (n) {
    return n < 10 ? '0' + n : n;
  }

  // 格式化时间
  formatDate (n, rule = 'YYYY-MM-DD hh:mm:ss') {
    let type = n.constructor
    if ((type == String && /^[0-9]+$/g.test(n)) || type == Number || type == Date) {
      n = type == Date ? n : (type == Number && `${n}`.length > 10 ? n : n * 1000) || n;
      let date = type == Date ? n : new Date(n),
        od = {
          'Y+': date.getFullYear(),
          'M+': date.getMonth() + 1,
          'D+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds()
        }
        
      for (let d in od) {
        if (new RegExp(`(${d})`, 'i').test(rule)) {
          rule = rule.replace(new RegExp(d, 'i'), this.addZiller(od[d]));
        }
      }
      
      return rule;
    } else {
      return n;
    }
  }

  throwWrong (errorMsg = '') {
    errorMsg && this.win.console.error(errorMsg)
  }
}

// props validator check
Wdatepicker.validator = v => {
  if (v.constructor === String) {
    return v === '' || /^[0-9]{4}(.{1}[0-9]{1,2}){2}.?$/.test(v)
  } else if (v.constructor === Number) {
    v = `${v}`
    if (v.length === 13 || v.length == 10) {
      return !0
    }
    return !1
  } else if (v.constructor === Date) {
    return !0
  }
}

export default Wdatepicker