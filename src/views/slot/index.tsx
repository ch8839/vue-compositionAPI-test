import { computed, defineComponent, ref, onMounted } from '@vue/composition-api'
import SlotTest from './slot'
import SlotTest2 from './slot2'

export default defineComponent({
  components: {
    SlotTest,
    SlotTest2
  },
  setup(props: any, { slots, emit }: any) {
    
    return () => (
      <div>
        <h2>slot具名插槽</h2>
        <slot-test></slot-test>

        
        {/* <slot-test2></slot-test2> */}
        
      </div>
    )
  }
})
