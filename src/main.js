import Vue from 'vue'
import Vuetify from 'vuetify'
import VueFire from 'vuefire'
import App from './App.vue'

Vue.use(Vuetify)
Vue.use(VueFire)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App)
})