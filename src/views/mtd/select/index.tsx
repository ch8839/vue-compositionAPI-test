import Vue from 'vue'
import { computed, defineComponent, ref, onMounted } from '@vue/composition-api'
import type { PropType } from 'vue'
import '@ss/mtd-vue2/lib/theme-chalk/select.css'
import '@ss/mtd-vue2/lib/theme-chalk/option.css'
import Select from '@ss/mtd-vue2/es/components/select'
import virtual from '@ss/mtd-vue2/es/components/virtual'
Vue.use(virtual)
export default defineComponent({
  components: {
    'mtd-select': Select
  },
  setup(props: any, { slots, emit }: any) {
    onMounted(() => {
      console.log(`The initial4 count.`);
    });

    const options = ref([
      {
        "value": 1,
        "label": "苹果"
      },
      {
        "value": 2,
        "label": "香蕉"
      },
      {
        "value": 3,
        "label": "西瓜"
      },
      {
        "value": 4,
        "label": "土豆"
      },
      {
        "value": 5,
        "label": "白菜"
      }
    ])

    const selectValue = ref('')
    const handleChange = (data: any)=> {
      console.log('>>>data', data)
      selectValue.value = data
    }
    
    // 直接写在setup中
    // 不用一个个return 响应式变量了
    return () => (
      <div>
        <mtd-select 
          options={options.value} 
          modelValue={selectValue.value} 
          onInput={handleChange}
        >
          
        </mtd-select>
      </div>
    )
  }
})
