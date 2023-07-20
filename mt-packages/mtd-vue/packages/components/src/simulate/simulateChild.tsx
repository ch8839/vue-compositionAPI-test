import {
  defineComponent,
  getSlotsInRender,
  getScopedSlotsInRender,
  classNames,
  styles,
} from '@ss/mtd-adapter'

export default defineComponent({
  name: 'MtdSimulateChild',
  inheritAttrs: false,
  props: {
  },
  render() {
    const childMsg = '来自孩子的内容'
    console.log('【testChild】', this.$attrs)

    const $thisRender = <div
      class={classNames(this)}
      style={styles(this, { color: `red` })}
    >
      <div><span>default：</span>{getSlotsInRender(this)}{'默认'}</div>
      <div><span>content：</span>{getScopedSlotsInRender(this, 'content')}</div>
      <div><span>content-scope：</span>{getScopedSlotsInRender(this, 'content-scope', childMsg)}</div>
    </div>
    return $thisRender
  },
})
