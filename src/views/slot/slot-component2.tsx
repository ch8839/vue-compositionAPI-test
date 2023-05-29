import { computed, defineComponent, ref, onMounted } from '@vue/composition-api'

export default defineComponent({
  name: 'SlotComponent',
  setup(props: any, { slots, emit }: any) {
    console.log('>>>slot-component2', slots)

    return ()=> (
      <div>
        <div>
          SlotComponent setup写法的default slot:
          {slots.default()}
        </div>
        <div>
          SlotComponent setup写法的footer slot:
          {slots.footer && slots.footer()}
        </div>
      </div>
    )
  },
})
