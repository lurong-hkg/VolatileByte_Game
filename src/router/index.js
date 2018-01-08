import Vue from 'vue'
import Router from 'vue-router'
import MainScene from '@/components/MainScene.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainScene',
      component: MainScene
    }
  ]
})
