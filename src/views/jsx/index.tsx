import { computed, defineComponent, ref, onMounted } from '@vue/composition-api'
import SlotTest from './slot'

export default defineComponent({
  components: {
    SlotTest
  },
  setup(props: any, { slots, emit }: any) {
    const count = ref<number>(0);

    function increment() {
      count.value++;
    }

    onMounted(() => {
      console.log(`The initial4 count is ${count.value}.`);
    });
    
    return () => (
      <div>
        <slot-test></slot-test>
        <button onClick={increment}>Count is: {count.value}</button>
      </div>
    )
  }
})
