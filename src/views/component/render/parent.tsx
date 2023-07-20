import { defineComponent, ref, onMounted } from '@vue/composition-api'
import Component1 from './component1'

export default defineComponent({
  name: 'Render_parent',
  components: {
    Component1,
  },
  setup(props: any, { slots, emit }: any) {
    console.log('>>>parent setup')
    const count = ref<number>(0)

    const handleClick = () => {
      count.value++
    }
    return () => {
      console.log('>>>parent render')
      return (
        <div>
          <h2>parent</h2>
          <button onClick={handleClick}>click</button>
          <p>parent count: {count.value}</p>
          <Component1 parentCount={count.value}></Component1>

          {/* <slot-test2></slot-test2> */}
        </div>
      )
    }
  },
})
