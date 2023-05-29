import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const pageList = [
  {
    path: '/es6/modules',
    name: 'Es6_modules',
    component: () => import('../views/es6/modules/index.vue'),
  },
  {
    path: '/ref',
    name: 'ref',
    component: () => import('../views/base/ref.vue'),
  },
  {
    path: '/CompositionApi',
    name: 'CompositionApi',
    component: () => import('../views/base/CompositionApi/index.vue')
  },
  {
    path: '/component/provide/optional',
    name: 'Provide_optional',
    component: () => import('../views/component/provide/optional/parent1.vue')
  },
  {
    path: '/jsx-slot',
    name: 'JsxSlot',
    component: () => import('../views/slot/index')
  },
  {
    path: '/jsx-scopedSlots',
    name: 'JsxScopedSlots',
    component: () => import('../views/slot/slot2')
  },
  {
    path: '/template-slot',
    name: 'Templateslot',
    component: () => import('../views/slot/slot3.vue')
  },
  {
    path: '/mtd-select',
    name: 'MtdSelect',
    component: () => import('../views/mtd/select/index')
  },
  {
    path: '/simple-store',
    name: 'SimpleStore',
    component: () => import('../views/simple-store/index.vue')
  },
  {
    path: '/tips/no-render',
    name: 'NoRender',
    component: () => import('../views/tips/no-render/index.vue')
  },
]

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  ...pageList,
]

const router = new VueRouter({
  routes,
})

export { pageList }

export default router
