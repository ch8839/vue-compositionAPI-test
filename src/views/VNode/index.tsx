import {
  computed,
  defineComponent,
  ref,
  onMounted,
  h,
} from '@vue/composition-api'

export default defineComponent({
  setup(props: any, { slots, emit }: any) {
    const count = ref<number>(0)

    function render(VNode: any) {
      const { tag, data, children } = VNode
      const el = document.createElement(tag)
      for (let attrKey in data) {
        setAttr(el, attrKey, data[attrKey])
      }
      if (children && children.length) {
        let childEl = null
        for (let childItem of children) {
          if (childItem.tag) {
            childEl = render(childItem)
          } else {
            childEl = document.createTextNode(childItem.text)
          }
          el.appendChild(childEl)
        }
      }
      return el
    }

    function setAttr(el: any, attrKey: string, attrValue: any) {
      el.setAttribute(attrKey, attrValue)
    }
    
    function increment() {
      count.value++
      const VNode = h('div', { class: 'list' }, [
        `${count.value}:`,
        h('span', { class: 'list-item' }, `I am ${count.value}`),
      ])
      console.log('>>>VNode', VNode)
      const el = render(VNode)
      console.log('>>>el', el)
      const VNodeContainer = document.querySelector('#VNode-container')
      VNodeContainer?.appendChild(el)
    }

    onMounted(() => {
      console.log(`The initial4 count is ${count.value}.`)
    })
    return {
      count,
      increment,
    }
  },
  render(h: any) {
    const { increment, count } = this
    return (
      <div>
        tsx测试
        <button onClick={increment}>Count is: {count}</button>
        <div id="VNode-container"></div>
      </div>
    )
  },
})
