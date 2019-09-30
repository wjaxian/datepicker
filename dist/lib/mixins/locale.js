import {t} from '../locale'

export default {
  methods: {
    t: function (...args) {
      return t.apply(this, args)
    }
  }
}