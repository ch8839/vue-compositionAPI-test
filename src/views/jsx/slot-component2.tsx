import { computed, defineComponent, ref, onMounted } from '@vue/composition-api'

export default defineComponent({
  name: 'SlotComponent',
  setup(props: any, { slots, emit }: any) {
    const count = ref<number>(0);

    function increment() {
      count.value++;
    }

    return ()=> (
      <div>
        <div>
          SlotComponent2的default slot:
          {slots.default()}
        </div>
        <div>
          SlotComponent2的footer slot:
          {slots.footer()}
        </div>
      </div>
    )
  },
})
