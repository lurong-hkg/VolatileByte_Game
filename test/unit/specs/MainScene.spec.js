import Vue from 'vue'
import Hello from '@/components/MainScene.vue'
require('../../../src/main')
describe('MainScene.vue', () => {
  it('should render correct contents', () => {
    const Cmpt = Vue.extend(Hello)
    const vm = new Cmpt().$mount()
    expect(vm.$el.querySelector('.cardback'))
      .to.not.null
  })
})
