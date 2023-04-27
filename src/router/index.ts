import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const pageList = [
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
    path: '/jsx',
    name: 'Jsx',
    component: () => import('../views/jsx/index')
  },
  {
    path: '/mtd-select',
    name: 'MtdSelect',
    component: () => import('../views/mtd/select/index')
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
