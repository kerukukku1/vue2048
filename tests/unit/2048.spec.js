import { expect } from 'chai'
import Game from '@/views/Game.vue'
import Vue from 'vue'

describe('Game .vue', () => {
  it('makeID function test', () => {
    const wrapper = new Vue(Game).$mount()
    expect(wrapper.makeID(1)).contain("item-1")
  })
})
