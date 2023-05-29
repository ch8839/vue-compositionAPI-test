import {
  defineComponent, computed, reactive, toRefs, watch, onMounted, onBeforeUnmount, vueInstance,
  classNames, styles, getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { isTabDrop, ITabDrop } from '../types'
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
    const ins = vueInstance()!
    const el = getElement()
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('tab-pane'))

    const state = reactive({
      index: 0,
      active: false,
      tabDropInfo: undefined,
    })

    const IParent = computed<any>(() => ins.$parent!)

    const isClosable = computed(() => props.closable || IParent.value.closable)
    const paneName = computed(() => props.value || state.index)
    const dropActive = computed(() => props.value === (IParent.value as ITabDrop).currentValue)

    watch(() => props.label, () => {
      IParent.value.$forceUpdate()
    })

    onMounted(() => {
      // $parent type is ITabDrop
      if (isTabDrop(IParent.value)) {
        (IParent.value ).addTabs?.(ins, ins.$parent)
      }

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
      {getSlotsInRender(this)}
    </div>
  },
})
