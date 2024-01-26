import Vue from 'vue'
import VueI18n from 'vue-i18n'
import store from '../src/store/index.js'
import en from './en.js'
import vi from './vi.js'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: store.state.locale,
  fallbackLocale: "en",
  messages: {
    en,
    vi
  },
  //關閉黃色警告
  silentTranslationWarn: true
});

export default i18n