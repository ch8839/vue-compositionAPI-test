import { computed, defineComponent, ref, onMounted } from '@vue/composition-api'
import SlotComponent from './slot-component'
import SlotComponent2 from './slot-component2'
import HelloWorld from '../../components/HelloWorld.vue'
export default defineComponent({
  name: 'SlotTest',
  components: {
    HelloWorld,
    SlotComponent,
    SlotComponent2,
  },
  setup(props: any, { slots, emit }: any) {
    const count = ref<number>(0)

    function increment() {
      count.value++
    }

    return () => {
      // const footerSlots = () => {
      //   return 
      // }

      // 需要放在render过程中，每次render重新渲染
      const scopedSlots = {
        default: 'header',
        main: ({ count }: any) => <p>count: {count}</p>,
        footer: <div style="color:blue;">底部插槽的值:父组件的{count.value}</div>,
      }

      return (
        <div>
          <button onClick={increment}>Count is: {count.value}</button>
          <h2>example1</h2>
          <SlotComponent>
            默认插槽的值1
            <HelloWorld></HelloWorld>
            <template slot="footer">底部插槽的值1</template>
          </SlotComponent>

          <h2>example2</h2>
          <SlotComponent>
            <div style="color:blue;" slot="default">
              默认插槽的值2
            </div>
            <div style="color:red;" slot="footer">
              底部插槽的值,父组件的count: {count.value}
            </div>
          </SlotComponent>

          <h2>example3</h2>
          <SlotComponent>
            {Object.keys(scopedSlots).map((slotName) => (
              <template slot={slotName}>
                {(scopedSlots as any)[slotName]}
              </template>
            ))}
          </SlotComponent>

          <h2>example4</h2>
          <SlotComponent2>
            默认2
            <template slot="footer">底部2</template>
          </SlotComponent2>

          <h2>example5</h2>
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
