import { computed, defineComponent, ref, onMounted } from '@vue/composition-api'
import SlotComponent from './slot-component'
import SlotComponent2 from './slot-component2'

export default defineComponent({
  name: 'SlotTest',
  components: {
    SlotComponent,
    SlotComponent2,
  },
  setup(props: any, { slots, emit }: any) {
    const count = ref<number>(0)

    function increment() {
      count.value++
    }

    onMounted(() => {
      console.log(`The initial4 count is ${count.value}.`)
    })

    return () => (
      <div>
        <h2>example1</h2>
        <SlotComponent
          {...{
            scopedSlots: {
              main: ({ count }: any) => (
                // 这个user就是子组件传递来的数据，同理可这样拿到el-table的row，不过test得是default，不过案例还是我这样
                <div style="color:blue;">
                  快来啊，{count}，看看这个作用域插槽
                </div>
              ),
            },
          }}
        >
          默认
          {/* @ts-ignore */}
          <template slot="footer">底部</template>
        </SlotComponent>

        <h2>example2</h2>
        <SlotComponent2>
          默认2
          <template slot="footer">底部2</template>
        </SlotComponent2>
      </div>
    )
  },
})
