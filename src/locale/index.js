import Vue from 'vue'
import deepmerge from 'deepmerge'
import defaultLang from './lang/zh_CN'
var lang = defaultLang
var isOn = false

var i18n_$t = function () {
  var $t = Object.getPrototypeOf(this || Vue).$t
  if (typeof $t === 'function' && !!Vue.locale) {
    if (!isOn) {
      isOn = true
      Vue.locale(
        Vue.config.lang,
        deepmerge(lang, Vue.locale(Vue.config.lang) || {}, { clone: true })
      )
    }
    return $t.apply(this, arguments)
  }
}

export var t = function (path = '') {
  var value = i18n_$t.apply(this, arguments)
  if (value !== null && value !== undefined) return value

  var attributes = path.split('.')
  
  var get = function (arr, obj) {
    if (!arr.length) return obj
    var narr = arr.slice(1)
    return get(narr, obj[arr[0]])
  }

  return get(attributes, lang)
}

export var use = function (nlang) {
  lang = nlang || lang
}

export var i18n = function (fn) {
  i18n_$t = fn || i18n_$t
}

export default {
  use: use,
  t: t,
  i18n: i18n
}