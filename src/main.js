import Vue from 'vue'
import Vuetify from 'vuetify'
import VueFire from 'vuefire'
import App from './App'

Vue.use(Vuetify)
Vue.use(VueFire)

require('dotenv').config()

import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App)
})