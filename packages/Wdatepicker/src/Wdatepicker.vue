<template>
<section class="wj-datepicker">
  <input 
    class="wj-datepicker-ipt" 
    type="text"
    @click.stop="showDatetimePicker" 
    @focus="example('focus')" 
    @blur="example('blur')"
    @change="change"
    @input="example('input', $event.target.value)"
    @keyup.enter="switchingPickerStatus($event, 'keyup')" 
    :value="nowDate" 
    :placeholder="placeholder" 
    :readonly="!editable"
    :disabled="disabled" 
    :class="{'ipt-disabled': disabled}" 
    ref="ipt" 
  />

  <section class="wj-close" @click="currentDate = ''" v-if="!disabled && clearBtn">
    <slot name="close-icon"><i :class="closeIconClass || 'iconfont icon-guanbi'"></i></slot>
  </section>
  <section class="wj-date-icon">
    <slot name="date-icon"><i :class="dateIconClass || 'iconfont icon-riqi'"></i></slot>
  </section>

  <transition name="fade">
    <section class="wj-datepicker-content" @click.stop v-show="isShowPicker" :class="{'on': isShowPicker}">
      <header class="wj-datepicker-header">
        <slot name="header" :self="_self"></slot>
        <section class="wj-datepicker-header-tools">
          <section class="tab-btn iconfont icon-jiantou_yemian_xiangzuo_o" @click="switchoverYearAndMonth('yearPrev')" title="上一年"></section>
          <section class="tab-btn iconfont icon-jiantou_liebiaoxiangzuo_o" @click="switchoverYearAndMonth('monthPrev')" title="上一月"></section>
          <section class="wj-datepicker-select-date">{{pickerDate}}</section>
          <section class="tab-btn iconfont icon-jiantou_liebiaoxiangyou_o" @click="switchoverYearAndMonth('monthNext')" title="下一月"></section>
          <section class="tab-btn iconfont icon-jiantou_yemian_xiangyou_o" @click="switchoverYearAndMonth('yearNext')" title=
          "下一年"></section>
        </section>
      </header>
      <table class="wj-datepicker-body" border="0" cellspacing="0">
        <thead>
          <tr>
            <td>一</td>
            <td>二</td>
            <td>三</td>
            <td>四</td>
            <td>五</td>
            <td>六</td>
            <td>日</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of currentMonthAllDate" :key="item.index">
            <td 
              v-for="v of item" 
              :key="v.index" 
              :class="{
                'otherTime': v.otherTime,
                'disabled': v.disabledDate
              }"
              :title="`${v.year}-${v.month}-${v.date}`"
              @click="!v.otherTime && example('change', selectDate(v)) || disabledHandle(v)"
            >
              <div>
                <section 
                  :class="{
                    'square': selectState === 'square',
                    'circle': selectState === 'circle',
                    'current-on': v.isCurrentDate,
                    'on': v.isSelectDate && v.month === v.thisMonth,
                  }"
                >
                  {{v.date}}
                </section>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <section class="wj-datepicker-footer">
        <slot name="footer" :self="_self"></slot>
      </section>
    </section>
  </transition>
</section>
</template>

<script>
/*
  value/v-model 绑定值
  events
    change('2019-09-18') 时间被更改时调用
    focus(组件实例) input获取焦点时调用
    blur(组件实例) input失去焦点时调用
    disabledDate(time Object) 点击非当月日期或被禁日期的回调
  slot
    header 接收self参数组件实例,{selectDate}切换年，月，日
    footer 接收self参数组件实例,{selectDate}切换年，月，日
    date-icon 设置时间icon 图标
    close-icon 设置关闭图标
*/
import Wdatepicker from './js/Wdatepicker'
import './font/iconfont.css'
let { validator } = Wdatepicker

export default {
  name: 'WDatepicker',
  data () {
    return {
      datepicker: {},
      currentMonthAllDate: [],
      currentDate: '',
      pickerDate: '',
      isShowPicker: !1,
      dateReg: /[0-9]{4}(.{1}[0-9]{1,2}){2}/
    }
  },
  props: {
    // 默认值
    defaultValue: {
      type: [String, Number, Date],
      default () {
        return ''
      },
      validator
    },
    // 绑定值
    value: {
      type: [String, Number, Date],
      default () {
        return ''
      },
      validator
    },
    // 输入框是否可输入
    editable: {
      type: Boolean,
      default () {
        return !1
      }
    },
    // 时间格式 'YYYY-MM-DD hh:mm:ss'
    formatDate: {
      type: String,
      default () {
        return 'YYYY-MM-DD'
      }
    },
    // 最小时间（默认前10年）
    minDate: {
      type: [String, Number, Date],
      default () {
        let date = new Date()
        date.setFullYear(date.getFullYear() - 10)
        return date
      },
      validator
    },
    // 最大时间（默认后10年）
    maxDate: {
      type: [String, Number, Date],
      default () {
        let date = new Date()
        date.setFullYear(date.getFullYear() + 10)
        return date
      },
      validator
    },
    // 点击非当月日期 return  （'' 默认选择该月日期）（switch 切换到该月） （. 任意值都不做任何操作）
    clickDisabledDate: {
      type: String,
      default () {
        return ''
      }
    },
    placeholder: {
      type: String,
      default () {
        return '选择日期'
      }
    },
    // 当前时间选中形状： square(方形),circle(圆形)
    selectState: {
      type: String,
      default () {
        return 'circle'
      }
    },
    // 是否显示清除按钮
    clearBtn: {
      type: Boolean,
      default () {
        return !0
      }
    },
    // 禁用
    disabled: {
      type: Boolean,
      default () {
        return !1
      }
    },
    // 日期禁用状态,可传入：日期的数组[String Date format, Number time stamp, Date Object]、Fn(selectDate, monthDate, nowDate)接收当前选择的时间，当前月date，现在时间三个参数，必须返回true
    disabledDate: {
      type: [Array, Function],
      default () {
        return []
      },
      validator (v) {
        if (v.constructor === Function || !v.length) return !0
        for (let i = 0; i < v.length; i++) {
          return validator(v[i])
        }
      }
    },
    closeIconClass: {
      type: String,
      default () {
        return ''
      }
    },
    dateIconClass: {
      type: String,
      default () {
        return ''
      }
    }
  },
  computed: {
    nowDate: {
      set (v) {
        this.currentDate = v
      },
      get (v) {
        return !!v.currentDate && this.datepicker.formatDate(this.datepicker.judgeType(v.currentDate), this.formatDate) || ''
      }
    }
  },
  methods: {
    change (e) {
      let v = e.target.value
      if(!this.dateReg.test(v)) return !v && (this.currentDate = '')
      this.example('change', this.selectDate(this.datepicker.judgeType(v)))
    },
    // input 获取焦点
    focus () {
      this.$refs.ipt.focus()
    },
    // 点击不是当月日期，切换到该月或选择该月日期或不做任何操作，最大和最小之外的时间禁止操作
    disabledHandle (time) {
      let {year, month, date, disabledDate, thisMonth} = time
      if ((this.clickDisabledDate === 'switch' || this.clickDisabledDate === '') && !disabledDate) this.pickerDate = this.datepicker.formatDate(new Date(`${year}/${month}/${date}`), 'YYYY年MM月')
      switch (this.clickDisabledDate) {
        case 'switch':
          !disabledDate && this.datepicker.init(new Date(`${year}/${month}/${date}`))
          break
        case '':
          !disabledDate && this.example('change', this.selectDate(time))
          break
      }
      // 返回当前操作信息
      this.example('disabledDate', {year, month, date, disabledDate, thisMonth})
    },
    // 隐藏时间选择框
    switchingPickerStatus (bl, t) {
      if (t == 'keyup') {
        let v = bl.target.value
        if (this.dateReg.test(v) || !v) {
          this.$refs.ipt.blur()
          bl = !1
        } else {
          bl = !0
        }
      }

      bl = typeof bl == 'object' ? !1 : bl
      !bl && this.example('input', this.currentDate)
      this.isShowPicker = bl
    },
    // focus and blur events
    example (eventName, value) {
      value = value || value === '' ? value : this
      this.$emit(eventName, value)
      return value
    },
    // 显示控件
    showDatetimePicker () {
      this.pickerDate = this.datepicker.formatDate(this.datepicker.judgeType(this.currentDate), 'YYYY年MM月')
      this.datepicker.init(this.currentDate, !0)
      this.switchingPickerStatus(!0)
    },
    // 选择日期
    selectDate (v) {
      v = Object.prototype.toString.call(v) === '[object Object]' ? `${v.year}-${v.month}-${v.date}` : v
      this.switchingPickerStatus(!1)
      return this.example('input', this.currentDate = this.datepicker.switchingDate(v))
    },
    // 切换年份或月份
    switchoverYearAndMonth (t) {
      let date = this.pickerDate.match(/\d+/g),
      year = parseInt(date[0]),
      month = parseInt(date[1]) - 1
      switch (t) {
        case 'yearPrev':
          year -= 1
          break;
        case 'yearNext':
          year += 1
          break;
        case 'monthPrev':
          month -= 1;
          break;
        case 'monthNext':
          month += 1
          break;
      }

      this.pickerDate = this.datepicker.formatDate(new Date(year, month), 'YYYY年MM月')
      this.datepicker.init(new Date(year, month))
    },
    getSwitchoverDate (date) {
      return date.match(/\d+/g)
    }
  },
  watch: {
    'datepicker.currentMonthAllDate' (monthAllDate) {
      this.currentMonthAllDate = monthAllDate
    }
  },
  created () {
    let {defaultValue = '', value = '', formatDate, maxDate = '', minDate = '', disabledDate = []} = this,
    currentDate = this.currentDate = value || defaultValue
    this.datepicker = new Wdatepicker({
      formatDate,
      currentDate,
      maxDate,
      minDate,
      disabledDate
    })
    this.currentMonthAllDate = this.datepicker.currentMonthAllDate
    this.pickerDate = this.datepicker.formatDate(this.datepicker.judgeType(this.currentDate), 'YYYY年MM月')
    this.currentDate && this.example('change', this.currentDate)
  },
  mounted () {
    document.addEventListener('click', this.switchingPickerStatus)
  },
  destroyed () {
    document.removeEventListener('click', this.switchingPickerStatus)
  }
}
</script>

<style lang="scss">
@import './style/theme';
.wj-datepicker {
  display: inline-block;
  position: relative;
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent !important;
  }
  .fade-enter-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fade-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fade-enter, .fade-leave-to {
    transform: translatey(-5px);
    opacity: 0;
  }

  .wj-datepicker-ipt {
    width: 220px;
    line-height: 40px;
    height: 40px;
    border: 1px solid $border;
    padding: 0 10px;
    padding-left: 28px;
    font-size: 14px;
    border-radius: 5px;
    color: $font_color;
    cursor: pointer;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    &::placeholder {
      color: $ipt_placeholder;
    }
    &:hover {
      border-color: $ipt_hover_border;
    }
    &:hover + .wj-close {
      visibility: visible;
    }
    &:focus {
      border-color: $ipt_focus_border;
    }
    &.ipt-disabled {
      background: $disabeld_bg;
      cursor: not-allowed;
      &, &::placeholder {
        color: $disabled_font;
      }
    }
  }

  .wj-date-icon {
    position: absolute;
    left: 8px;
  }
  .wj-close, .wj-date-icon {
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
    color: #c0c4cc;
  }
  .wj-close {
    cursor: pointer;
    visibility: hidden;
    position: absolute;
    right: 8px;
    &:hover {
      visibility: visible;
    }
  }

  .wj-datepicker-content {
    border-radius: 5px;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 41px;
    padding: 8px 14px 14px 14px;
    background: $datepicker_bg;
    text-align: center;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border: 1px solid $border;
   
    .wj-datepicker-header {
      .wj-datepicker-header-tools {
        display: flex;
        line-height: 40px;
        margin-bottom: 12px;
        color: $font_color;
        .tab-btn.iconfont {
          font-size: 24px;
          cursor: pointer;
        }
        .wj-datepicker-select-date {
          margin: 0 10px;
          flex: 1;
          letter-spacing: 2px;
          font-size: 16px;
        }
      }
    }

    .wj-datepicker-body {
      border-collapse: collapse;
      color: $font_color;
      &, td {
        font-size: 12px;
      }
      td {
        div {
          width: 40px;
          margin: 3px;
          padding: 3px 0;
          section {
            margin: 0 auto;
            width: 24px;
            height: 24px;
            line-height: 24px;
          }
        }
      }

      thead {
        background: $week_bg;
        tr {
          border-bottom: 1px solid $week_border;
          line-height: 40px;
        }
      }

      tbody {
        td {
          cursor: pointer;
          &:hover {
            color: $date_hover_color;
          }
          div > section {
            &.square {
              border-radius: 3px;
            }
            &.circle {
              border-radius: 50%;
            }
            &.circle:hover, &.square:hover {
              background: $date_hover_bg;
            }
            &.current-on, &.on {
              font-weight: bold;
            }
            &.current-on {
              color: $date_status;
              &.circle, &.square {
                border: 1px solid $date_status;
              }
            }
            &.on {
              color: $on_color_status;
              &, &:hover {
                background: $date_status;
              }
            }
          }
          &.otherTime {
            color: $disabled_date_color;
            // background: transparent !important;
            // &:active {
            //   background: $date_hover_bg !important;
            // }
          }
          &.disabled {
            background: $disabeld_bg;
            color: $disabled_font;
            cursor: not-allowed;
            > div > section, > div > section:hover {
              background: transparent;
            }
            > div > section.on {
              background: $date_status;
            }
          }
        }
      }
    }
  }
}
</style>
