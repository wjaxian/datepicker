import Vue from 'vue'
import deepmerge from 'deepmerge'
import defaultLang from './lang/zh_CN'
let lang = defaultLang
let isOn = false

let i18n_$t = function () {
  let $t = Object.getPrototypeOf(this || Vue).$t
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

export let t = function (path = '') {
  let value = i18n_$t.apply(this, arguments)
  if (value !== null && value !== undefined) return value

  let attributes = path.split('.')
  
  let get = (arr, obj) => {
    if (!arr.length) return obj
    let narr = arr.slice(1)
    return get(narr, obj[arr[0]])
  }

  return get(attributes, lang)
}

export let use = nlang => {
  lang = nlang || lang
}

export let i18n = fn => {
  i18n_$t = fn || i18n_$t
}

export default {
  use,
  t,
  i18n
}