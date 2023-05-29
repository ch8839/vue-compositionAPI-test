import {
  defineComponent,
  getSlotsInRender,
  getScopedSlotsInRender,
  vSlots,
  vueInstance,
  useResetAttrs,
  classNames,
  styles,
  getChildInsList,
  getChildVNodeList,
  onMounted,
  getCurrentInstance,
  ref,
  useSlots,
  translateIntoProps,
} from '@ss/mtd-adapter'

import MtdSimulateChild from './simulateChild'

export default defineComponent({
  name: 'MtdSimulate',
  components: {
    MtdSimulateChild,
  },
  inheritAttrs: false,
  props: {
    id: String,
    showChild: Boolean,
    showMsg: Boolean,
  },
  emits: [],
  setup(props, ctx) {
    const ins = vueInstance()
    const resetAttrs = useResetAttrs(ctx.attrs)

    if (props.showMsg) {
      console.log('【props】', props)
      console.log('【attrs】', ctx.attrs, resetAttrs.value)
      console.log('【ins】', ins)
    }

    // 获取 ins
    function getChildSimulateInsList() {
      return getChildInsList(ins, ['MtdSimulateChild'])
    }

    // 获取 vnode
    function getChildSimulateVNodeList() {
      return getChildVNodeList(ins, ['MtdSimulateChild'])
    }

    function handleClick() {
      console.log('点击事件')
    }

    const childRef = ref(null)

    onMounted(() => {
      console.log(ins, getCurrentInstance())
      const arr1 = getChildSimulateInsList()
      console.log('子组件实例', arr1)
      /* (arr1[0] as any).id = 8888 */
      //console.log(childRef.value.id)
    })

    return {
      resetAttrs, handleClick, childRef,
    }
  },
  render() {
    const { showChild, resetAttrs } = this



    const $renderTestChild = () => {
      const slots = {
        default: () => <span style="color: blue" >默认插槽内容</span>,
        content: () => getSlotsInRender(this, 'content'),
        // item: (scoped: any) => getScopedSlotsInRender(this, 'item', scoped),
        item: getScopedSlotsInRender(this, 'item'),
        // item: getScopedSlotsInRender(this, 'item') ? (scoped: any) => getScopedSlotsInRender(this, 'item', scoped) : undefined,
      }
      const data = {
        title: '鸡你太美',
      }
      const on = {
        click: () => {
          console.log('点击事件')
        },
      }

      const lis = translateIntoProps({
        props: {
          title: '🐔',
        },
        on: {
          click: () => {
            console.log('点击事件')
          },
        },
      })


      return <mtd-simulate-child
        /*         id={'3'}
        class={'💥'}
        style={'border: 1px solid red'} */
        {...vSlots(slots)}
        v-slots={slots}
        {...lis}
        on={lis.on}
      >
      </mtd-simulate-child >
    }

    return <div
      class={classNames(this, '壳')}
      style={styles(this, { border: '1px solid black' })}
    >
      <div>我是组件主体</div>
      <div>{getSlotsInRender(this)}</div>
      <div>{getScopedSlotsInRender(this, 'content')?.({})}</div>
      {$renderTestChild()}
      {/*  <div {...resetAttrs} >{getSlotsInRender(this)}</div>
      <div>具名插槽——{getSlotsInRender(this, 'content')}</div> */}
      {/* {showChild &&
        <div>
          <div>具名插槽——{getSlotsInRender(this, 'content')}</div>
          <div>作用域插槽——{getScopedSlotsInRender(this, 'content-scope', '😢')}</div>
          {$renderTestChild()}
        </div>
      } */}
    </div>
  },
})
