import { defineComponent, ref, onMounted } from '@vue/composition-api'

export default defineComponent({
  props: {
    parentCount: {
      type: Number
    }
  },
  setup(props: any, { slots, emit }: any) {
    console.log('>>>component1 setup')
    const count = ref<number>(100)

    const handleClick = () => {
      count.value++
    }
    return () => {
      console.log('>>>component1 render', props)
      return (
        <div>
          <h2>component1</h2>
          <button onClick={handleClick}>click</button>
          <p>component1 count: {count.value}, receive parentCount: {props.parentCount}</p>
       
        </div>
      )
    }
  },
})
