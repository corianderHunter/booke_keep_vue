import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate'
import AlloyFinger from 'alloyfinger'
import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger.vue'

import router from './router'
import store from './store'
import service from './service'

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@assets/styles/normalize.css'
import 'animate.css/animate.min.css'
import '@assets/styles/main.scss'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VeeValidate)
Vue.use(AlloyFingerPlugin, {
  AlloyFinger
})

//挂载service
Vue.prototype.$service = service;

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
