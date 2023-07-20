import {
  defineComponent, computed, reactive, toRefs, watch, onMounted, onBeforeUnmount,
  classNames, styles,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import vueInstance from '@components/hooks/instance'
import getElement from '@components/hooks/getElement'

export default defineComponent({
  name: 'MtdTabPane',
  inheritAttrs: false,
  props: {
    label: String,
    value: [String, Number, Boolean, Array, Object],
    icon: String,
    closable: Boolean,
    disabled: Boolean,
  },
  setup(props) {
    const ins = vueInstance()
    const el = getElement()
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('tab-pane'))

    const state = reactive({
      index: 0,
      active: false,
      tabDropInfo: undefined,
    })

    const isClosable = computed(() => props.closable || ins.$parent.closable)
    const paneName = computed(() => props.value || state.index)
    const dropActive = computed(() => props.value === ins.$parent.currentValue)

    watch(() => props.label, () => {
      ins.$parent.$forceUpdate()
    })

    onMounted(() => {
      // $parent type is IPaneDrop
      ins.$parent.addTabs?.(ins, ins.$parent)
    })

    onBeforeUnmount(() => {
      if (el.value && el.value.parentNode) {
        el.value.parentNode.removeChild(el.value)
      }
    })

    return {
      prefix,
      ...toRefs(state),
      isClosable,
      paneName,
      dropActive,
    }
  },
  render() {
    const { prefix, active, dropActive } = this
    return <div
      class={classNames(this, prefix)}
      style={styles(this)}
      v-show={active || dropActive}
      ref="paneRef">
      {this.$slots.default}
    </div>
  },
})
