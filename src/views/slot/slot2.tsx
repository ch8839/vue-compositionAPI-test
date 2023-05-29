import { computed, defineComponent, ref, onMounted } from '@vue/composition-api'
import SlotComponent from './slot-component'
import SlotComponent2 from './slot-component2'
import HelloWorld from '../../components/HelloWorld.vue'

export default defineComponent({
  name: 'SlotTest',
  components: {
    SlotComponent,
    SlotComponent2,
    HelloWorld
  },
  setup(props: any, { slots, emit }: any) {
    return () => {
      const scopedSlots = {
        default: 'hello',
        main: ()=> <HelloWorld></HelloWorld>,
        // main: ({ count }: any) => <p>子组件传递过来的count: {count}</p>,
        footer: <p>footer</p>,
      }

      return (
        <div>
          <h2>slot作用域插槽</h2>
          <h2>example1</h2>
         
          <h2>example2</h2>
          <SlotComponent scopedSlots={scopedSlots}>
            
          </SlotComponent>

          <h2>example3</h2>
          <SlotComponent2>
            {Object.keys(scopedSlots).map((slotName) => (
              <template slot={slotName}>
                {(scopedSlots as any)[slotName]}
              </template>
            ))}
          </SlotComponent2>
        </div>
      )
    }
  },
})
