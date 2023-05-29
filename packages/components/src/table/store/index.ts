import { isString, isFunction } from '@utils/type'
import { firstUpperCase } from '@utils/util'
import { ITableStore } from '../types/table-store'
import { ITable } from '@components/table/types'

import Data from './data'
import Column from './column'
import Sort from './sort'
import Selection from './selection'
import Expand from './expand'
import Filter from './filter'
import Tree from './tree'
import { reactive } from '@ss/mtd-adapter'

type IModules = {
  getInitState(): any;
  actions: { [key: string]: Function };
  mutations: { [key: string]: Function };
  bootstrap?: (store: ITableStore) => void;
};
// 此处的顺序会影响 mutation 的执行顺序，从而影响结果
const Modules: IModules[] = [
  Data,
  Column,
  Expand,
  Selection,
  Sort,
  Filter,
  Tree,
]

const methods: { [key: string]: Function } = Modules.reduce((actions, mod) => {
  Object.assign(actions, mod.actions)
  return actions
}, {})

export function mapStates(mapper: { [key: string]: any }) {
  return Object.keys(mapper).reduce((res, key) => {
    const value = mapper[key]
    if (isString(value)) {
      res[key] = function () {
        return ((this as ITable).store.states as any)[value]
      }
    } else if (isFunction(value)) {
      res[key] = function () {
        return value.call(this, this.store.states)
      }
    }
    return res
  }, {} as any)
}

export function syncStates(mapper: { [key: string]: any }) {
  return Object.keys(mapper).reduce((res, key) => {
    const value = mapper[key]
    const name = firstUpperCase(value)
    res[key] = {
      immediate: true,
      deep: true,
      handler: function (val: any) {
        const fn = this.store[`set${name}`]
        if (!fn) {
          console.error('未找到同步函数', name)
        } else {
          fn(val)
        }
      },
    }
    return res
  }, {} as any)
}

interface StoreOptions<Row = any> {
  $emit: (eventName: string, ...args: any[]) => void;
  expandable?: (row: Row, $index: number) => boolean;
}
export function createStore(
  options: StoreOptions,
  extModule: any[] = [],
): ITableStore {
  const modules = [...Modules, ...extModule]

  // must
  const states = reactive(
    modules.reduce((state, mod) => {
      mod.getInitState && Object.assign(state, mod.getInitState())
      return state
    }, {}),
  )

  const store = {
    states,
    $emit: options.$emit,
    expandable: options.expandable,
    modules: [...Modules, ...extModule],
  }

  function dispatch(mutation: { [key: string]: any; type: string }) {
    const { type } = mutation
    store.modules.forEach((mod) => {
      const handler = mod.mutations[type]
      // eslint-disable-next-line
      // @ts-ignore
      // eslint-disable-next-line
      const that = this
      handler && handler.call(store, that.states, mutation)
    })
  }

  (store as ITableStore).dispatch = dispatch.bind(store)

  const fns = Object.keys(methods).reduce((ms, name) => {
    const method = methods[name]
    ms[name] = method.bind(store, (store as ITableStore).dispatch)
    return ms
  }, {} as any)

  Object.assign(store, fns)
  store.modules.forEach((mod: any) => mod.bootstrap && mod.bootstrap(store));

  (store as ITableStore).getExpandPropsByItem = function (row, $index) {
    const { treeEnabled } = (store as ITableStore).states
    if (treeEnabled) {
      return (store as ITableStore).getTreeExpandProps(row, $index)
    }
    return (store as ITableStore).getExpandProps(row, $index)
  }
  return store as ITableStore
}
