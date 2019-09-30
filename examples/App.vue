<template>
<section>
  <w-datepicker v-model="time" :maxDate="maxDate" :disabledDate="disabledDateFn" @change="change" @focus="focus" @blur="blur" @disabledDate="disabledDate" :editable="true">
    <!-- <template v-slot:close-icon>
      x
    </template> -->
    <!-- <template v-slot:header="{self}">
      <div></div>
    </template>
    
    <template v-slot:footer="{self}">
      <div @click="switchingDate(self, 'front')">前十天</div>
      <div @click="switchingDate(self, 'now')">今天</div>
      <div @click="switchingDate(self, 'after')">后十天</div>
    </template> -->
  </w-datepicker>
</section>
</template>

<script>
import Vue from 'vue'
import Wdatepicker from '../src'
import locale from '../dist/lib/locale'
import cn from '../dist/lib/locale/lang/ko'
// locale.use(cn)
Vue.use(Wdatepicker, {
  locale: cn
})
// console.log(locale.t(), Vue.locale)

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
      switch (type) {
        case 'front':
          now.setDate(now.getDate() - 10)
          break
        case 'after':
          now.setDate(now.getDate() + 10)
          break
      }

      self.selectDate(now)
    },
    focus (vcomponent) {
      // console.log(vcomponent)
    },
    blur (vcomponent) {
      // console.log(vcomponent)
    },
    change (value) {
      // console.log(value)
    },
    disabledDateFn (selectDate, monthDate, nowDate) {
      let date = new Date('2019-09-10')
      return date.getDate() === monthDate.getDate()
    },
    disabledDate (time) {
      // console.log(time)
    }
  },
  created () {
    // console.log(locale.t('datepicker.weeks'), Vue.locale)
  }
}
</script>