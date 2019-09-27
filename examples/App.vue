<template>
<section>
  <w-datepicker v-model="time" :maxDate="maxDate" :disabledDate="disabledDateFn" @change="change" @focus="focus" @blur="blur" @disabledDate="disabledDate">
    <!-- <template v-slot:close-icon>
      x
    </template> -->
    <!-- <template v-slot:header="{self}">
      <div></div>
    </template>
    
    <template v-slot:footer="{self}">
      <div @click="a(self, 'q')">前十天</div>
      <div @click="a(self)">今天</div>
      <div @click="a(self, 'x')">后十天</div>
    </template> -->
  </w-datepicker>
</section>
</template>

<script>
import Vue from 'vue'
import Wdatepicker from '../packages/Wdatepicker'
Vue.use(Wdatepicker)
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
    a (self, t) {
      let now = new Date()
      if (t == 'q') {
        now.setDate(now.getDate() - 10)
        self.selectDate(now)
      } else if (t == 'x') {
        now.setDate(now.getDate() + 10)
        self.selectDate(now)
      } else {
        self.selectDate(now)
      }
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
  }
}
</script>