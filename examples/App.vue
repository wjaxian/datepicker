<template>
<section>
  <w-datepicker v-model="time" :maxDate="maxDate" :disabledDate="disabledDateFn" @change="change" @focus="focus" @blur="blur" @disabledDate="disabledDate" :editable="true">
    <!-- <template v-slot:close-icon>
      x
    </template> -->
    <!-- <template v-slot:header="{self}">
      <div></div>
    </template> -->
    
    <template v-slot:footer="{self}">
      <section class="dp-footer">
        <div class="dp-footer-item" @click="switchingDate(self, 'front')">前十天</div>
        <div class="dp-footer-item" @click="switchingDate(self, 'now')">今天</div>
        <div class="dp-footer-item" @click="switchingDate(self, 'after')">后十天</div>
      </section>
    </template>
  </w-datepicker>
</section>
</template>

<script>
import Vue from 'vue'
import Wdatepicker from '../src'
import locale from '../src/locale/index'
import cn from '../src/locale/lang/zh_CN'
locale.use(cn)
Vue.use(Wdatepicker)
const cs = window.console

export default {
  name: 'app',
  data () {
    return {
      maxDate: new Date(),
      time: '2019-09-30',
      disabledDateArr: ['2019-09-10', '2019-09-09']
    }
  },
  methods: {
    switchingDate (self, type) {
      let now = new Date()
      let cnow = new Date(this.time)
      switch (type) {
        case 'front':
          cnow.setDate(cnow.getDate() - 10)
          break
        case 'after':
          cnow.setDate(cnow.getDate() + 10)
          break
      }
      const t = type === 'now' ? now : cnow
      self.selectDate(t)
    },
    focus (vcomponent) {
      cs.log(vcomponent)
    },
    blur (vcomponent) {
      cs.log(vcomponent)
    },
    change (value) {
      cs.log(value)
    },
    disabledDateFn (selectDate, monthDate) {
      let date = new Date('2019/09/10')
      return date.getFullYear() === monthDate.getFullYear() && date.getMonth() === monthDate.getMonth() && date.getDate() === monthDate.getDate()
    },
    disabledDate (time) {
      cs.log(time)
    }
  },
  created () {
    // cs.log(locale.t('datepicker.weeks'), Vue.locale)
  }
}
</script>

<style lang="scss">
  .dp-footer {
    display: flex;
    justify-content: center;
    padding-top: 20px;
  }
  .dp-footer-item {
    flex: 1;
    color: #409eff;
    cursor: pointer;
  }
</style>