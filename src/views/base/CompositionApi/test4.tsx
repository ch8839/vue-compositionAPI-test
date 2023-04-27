import { computed, defineComponent, ref, onMounted } from '@vue/composition-api'
import type { PropType } from 'vue'

export default defineComponent({
  
  setup(props: any, { slots, emit }: any) {
    const count = ref<number>(0);

    function increment() {
      count.value++;
    }

    onMounted(() => {
      console.log(`The initial4 count is ${count.value}.`);
    });
    
    // 直接写在setup中
    // 不用一个个return 响应式变量了
    return () => {
      return (
        <div>
          tsx测试
          <button onClick={increment}>Count is: {count.value}</button>
        </div>
      )
    }
  }
})
