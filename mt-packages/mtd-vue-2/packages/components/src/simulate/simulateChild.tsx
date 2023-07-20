import {
  defineComponent,
  getSlotsInRender,
  getScopedSlotsInRender,
  classNames,
  styles,
  ref,
} from '@ss/mtd-adapter'

export default defineComponent({
  name: 'MtdSimulateChild',
  inheritAttrs: false,
  props: {
    showChild: Boolean,
    title: String,
  },
  emits: ['click'],
  setup(props, { emit }) {
    function handleClick() {
      emit('click')
    }
    const id = ref(-1)
    return {
      handleClick, id,
    }
  },
  render() {
    const childMsg = '来自孩子的内容'
    console.log('孩子有没有', getScopedSlotsInRender(this, 'item'))

    const $thisRender = <div
      onClick={this.handleClick}
      class={classNames(this)}
      style={styles(this, { color: 'red' })}
    >
      <div>子组件的标题：{this.title}===={this.id}</div>
      <div> 子组件的主体 👶🏻：{getSlotsInRender(this)}</div>
      {true &&
        <div>
          <div><span>content：</span>{getSlotsInRender(this, 'content')}</div>
          <div><span>content-scope：</span>{getScopedSlotsInRender(this, 'item')?.({
            item: {
              data: '你好🤡',
            },
          })}</div>
        </div>
      }
    </div>

    const justDiv = <div onClick={this.handleClick}>我是孩子: {this.title}</div>
    return justDiv
  },
})
