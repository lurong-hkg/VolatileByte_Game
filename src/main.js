// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import MainScene from './components/MainScene.vue'
import { Button } from 'element-ui'
import VModal from 'vue-js-modal'

import 'element-theme-default/lib/index.css'
NodeList.prototype.forEach = Array.prototype.forEach
NodeList.prototype.includes = Array.prototype.includes

Vue.config.productionTip = true
Vue.use(VModal)
Vue.use(MainScene)
Vue.use(Button)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: {
    App
  }
})
