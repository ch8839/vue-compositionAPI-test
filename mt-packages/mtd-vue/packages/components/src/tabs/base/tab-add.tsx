import {
  defineComponent, computed, classNames, styles,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import vueInstance from '@components/hooks/instance'
import Icon from '@components/icon'

export default defineComponent({
  name: 'MtdTabAdd',
  components: {
    Icon,
  },
  inheritAttrs: false,
  props: {
    size: String,
  },
  setup() {
    const ins = vueInstance()
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('tabs'))

    const addClick = (e: Event) => {
      ins.$parent.addClick(e)
    }
    return {
      prefix,
      addClick,
    }
  },
  render() {
    const { prefix, size } = this
    return <div
      class={classNames(this, {
        [`${prefix}-action`]: true,
        [`${prefix}-item`]: true,
        [`${prefix}-item-${size}`]: true,
        [`${prefix}-add`]: true,
      })}
      style={styles(this)}
      onClick={this.addClick}
    >
      <Icon name="add" />
    </div >
  },
})
