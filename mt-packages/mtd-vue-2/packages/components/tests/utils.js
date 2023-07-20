import {
  createLocalVue,
  mount as $mount,
} from '@vue/test-utils'
import VueCompositionAPI from '@ss/mtd-adapter'
import VueRouter from 'vue-router'
import glob from 'glob'
import MTD from '../src/index'
import * as path from 'path'
import Vue from 'vue'

export function createDemoTest (component, options = {}) {
  const suffix = options.suffix || 'vue'
  // root is  path.resolve(options.cwd, "/")
  const files = glob.sync(`./src/${component}/doc/*.${suffix}`, {
    root: path.resolve(),
  })
  files.forEach(file => {
    it(`renders ${file} correctly`, async () => {
      const demo = require(`../${file}`).default || require(`../${file}`)
      document.body.innerHTML = ''
      const localVue = createLocalVue({
        errorHandler: function (err, vm, info) {
          console.error('xxxxxxxxx', err)
          throw err;
        }
      })
      localVue.use(VueCompositionAPI)
      localVue.use(MTD)
      localVue.component('router-link', {
        functional: true,
        props: {
        },
        render: function (createElement, context) {
          return createElement('a', context.data, context.children)
        }
      })
      const wrapper = mount(demo, { localVue, attachTo: document.body })
      await wait(100)
      // const dom = options.getDomFromElement ? wrapper.element : wrapper.html()
      // expect(dom).toMatchSnapshot()
      wrapper.destroy()
      document.body.innerHTML = ''
    })
  })
}

export function mount (component, options) {
  const localVue = createLocalVue({
    errorHandler: function (err, vm, info) {
      console.error('xxxxxxxxx', err)
      throw err;
    }
  })
  localVue.config.warnHandler = function (err, vm, info) {
    console.error('222233232342', err)
    throw err;
  }
  localVue.use(VueCompositionAPI)
  return $mount(component, {
    localVue,
    ...(options || {}),
  })
}

/**
 * 等待 ms 毫秒，返回 Promise
 * @param {Number} ms
 */
export const wait = function (ms = 50) {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}

/**
 * 等待一个 Tick，代替 Vue.nextTick，返回 Promise
 */
export const waitImmediate = () => wait(0)

/**
 * 触发一个事件
 * mouseenter, mouseleave, mouseover, keyup, change, click 等
 * @param  {Element} elm
 * @param  {String} name
 * @param  {*} opts
 */
export const triggerEvent = function (elm, name, opts) {
  const evt = new Event(name, opts)
  elm.dispatchEvent
    ? elm.dispatchEvent(evt)
    : elm.fireEvent('on' + name, evt)

  return elm
}

/**
 * 触发 “mouseup” 和 “mousedown” 事件
 * @param {Element} elm
 * @param {*} opts
 */
export const triggerClick = function (elm, ...opts) {
  triggerEvent(elm, 'mousedown', ...opts)
  triggerEvent(elm, 'mouseup', ...opts)
  triggerEvent(elm, 'click', ...opts)

  return elm
}


export function asyncExpect(fn, timeout) {
  return new Promise(resolve => {
    if (typeof timeout === 'number') {
      setTimeout(() => {
        fn()
        resolve()
      }, timeout)
    } else {
      Vue.nextTick(() => {
        fn()
        resolve()
      })
    }
  })
}
