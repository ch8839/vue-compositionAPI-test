import { defineComponent, ref, provide, getCurrentInstance } from '@vue/composition-api'
import './styles/app.scss'
import Slider from './components/slider'
import Tag from '@components/tag'
import Icon from '@components/icon'

export default defineComponent({
  name: 'App',
  setup() {
    provide('app', getCurrentInstance())
    const clicked = ref(0)
    const onClick = (val: any) => {
      clicked.value++
      // console.log(val)
    }
    return {
      clicked,
      onClick,
    }
  },
  render() {
    const { clicked, xx } = this
    return <div class="app">
      hello world
      {clicked} {xx}
      {/* <Slider></Slider> */}
      <mtd-button>xxxx</mtd-button>
      <Icon name="close" />
    </div>
  },
})


