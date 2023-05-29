import { computed, defineComponent, ref, onMounted } from '@vue/composition-api'
import SlotComponent2 from './slot-component2'
export default defineComponent({
  name: 'SlotComponent',
  components: {
    SlotComponent2
  },
  setup(props: any, { slots, emit }: any) {
    const count = ref<number>(0);

    function increment() {
      count.value++;
    }

    return {
      count,
      increment
    }
  },
  render() {
    console.log('>>>slot-component1', this)
    return (
      <div style="margin-bottom: 20px">
        <div>
          SlotComponent的default slot:
          {this.$slots.default}
        </div>
        <div>
          SlotComponent的main slot:
          {/* 需要加ts-ignore，不然会解析报错 */}
          {/* @ts-ignore */}
          {/* {this.$scopedSlots.main({count: this.count})} */}

          {/* 或者这样写 */}
          {this.$scopedSlots.main && this.$scopedSlots.main({count: this.count})}
        </div>

        {/* <SlotComponent2>
          {this.$scopedSlots.main && this.$scopedSlots.main({count: this.count})}
        </SlotComponent2> */}

        <div>
          SlotComponent的footer slot:
          {this.$slots.footer}
        </div>
        <button onClick={this.increment}>Count is: {this.count}</button>
      </div>
    )
  }
})
