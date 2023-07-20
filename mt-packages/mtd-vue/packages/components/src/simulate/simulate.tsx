import {
  defineComponent,
  getSlotsInRender,
  getScopedSlotsInRender,
  vSlots,
  vueInstance,
  useResetAttrs,
  classNames,
  styles,
  defineEmits,
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
  emits: defineEmits([]),
  setup(props, ctx) {
    const ins = vueInstance()
    const resetAttrs = useResetAttrs(ctx.attrs)

    if (props.showMsg) {
      console.log('【props】', props)
      console.log('【attrs】', ctx.attrs, resetAttrs.value)
      console.log('【ins】', ins)
    }

    return {
      resetAttrs,
    }
  },
  render() {
    const { showChild, showMsg, resetAttrs } = this

    if (showMsg) {
      console.log('【this】', this)
    }


    const $renderTestChild = () => {
      const slots = {
        content: () => <span style="color: blue">具名插槽内容</span>,
        ['content-scope']: (val: any) => <span style="color: blue">{'作用域插槽内容:' + val}</span>,
      }

      return <mtd-simulate-child
        id={'3'}
        class={'💥'}
        style={'border: 1px solid red'}
        v-slots={slots}
        {...vSlots(slots)}
      >
        <span style="color: blue" >默认插槽内容</span>
      </mtd-simulate-child >
    }


    return <div
      class={classNames(this, '壳')}
      style={styles(this, { border: `1px solid black` })}
    >
      <div>我是组件主体</div>
      <div {...resetAttrs} >{getSlotsInRender(this)}</div>
      {showChild &&
        <div>
          <div>具名插槽——{getSlotsInRender(this, 'content')}</div>
          <div>作用域插槽——{getScopedSlotsInRender(this, 'content-scope', '😢')}</div>
          {$renderTestChild()}
        </div>
      }
    </div>
  },
})
