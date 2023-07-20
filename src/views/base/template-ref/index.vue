<template>
  <div>
    <button @click="handleClick">click</button>
    <input ref="inputRef" />
  </div>
</template>

<script>
import { ref, onMounted, watchEffect, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Template-ref',
  setup(props, context) {
    // 声明一个 ref 来存放该元素的引用
    // 必须和模板里的 ref 同名
    const inputRef = ref(null)

    watchEffect(() => {
      if (inputRef.value) {
        console.log('>>>mounted')
        inputRef.value.focus()
      } else {
        console.log('>>>not mounted')
        // 此时还未挂载，或此元素已经被卸载（例如通过 v-if 控制）
      }
    })

    // 只可以在组件挂载后才能访问模板引用。如果想在模板中的表达式上访问 input，在初次渲染时会是 null。这是因为在初次渲染前这个元素还不存在
    onMounted(() => {
      console.log('>>>onMounted——input.value', inputRef.value)
      setTimeout(()=> {
         inputRef.value && inputRef.value.focus()
      }, 1000)
     
    })

    const handleClick = ()=> {
      console.log('>>>inputRef.value', inputRef.value)
    }

    return {
      inputRef,
      handleClick
    }
    
  },
})
</script>
