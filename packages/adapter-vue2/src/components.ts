// 这部分是vue2没有但是vue3有的组件存放的地方
import Vue from 'vue'
import { Fragment as Frag } from 'vue-frag'

// 为了保证TS引入正确，需要排出一个无用变量
export const Transition = Vue.component('Transition')
export const TransitionGroup = Vue.component('TransitionGroup')
export const Fragment = Frag as any
export const Teleport = 'mtd-teleport'
export const RouterLink = 'RouterLink'
