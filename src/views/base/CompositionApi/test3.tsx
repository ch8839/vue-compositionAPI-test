import { computed, defineComponent, ref, onMounted } from '@vue/composition-api'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    msg: {
      type: String
    }
  },
  setup(props: any, { slots, emit }: any) {
    const count = ref<number>(0);

    function increment() {
      count.value++;
    }

    onMounted(() => {
      console.log(`test3: The initial count is ${count.value}.`);
    });
    
    // 直接写在setup中
    // 不用一个个return 响应式变量了
    return () => {
      const { msg } = props

      return (
        <div>
          tsx测试
          <p>receiveMsg: {msg}</p>
          <button onClick={increment}>Count is: {count.value}</button>
        </div>
      )
    }
  }
})
