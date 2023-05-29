import {
  defineComponent, computed, classNames, styles,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdIcon from '@components/icon'

export default defineComponent({
  name: 'MtdTabPage',
  components: {
    MtdIcon,
  },
  inheritAttrs: false,
  props: {
    size: String,
    prevStatus: Boolean,
    nextStatus: Boolean,
    pageStyle: {
      type: Object,
      default: () => ({
        right: 0,
      }),
    },
  },
  emits: ['prevClick', 'nextClick'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('tabs'))
    const prevClick = (event: Event) => {
      if (props.prevStatus) {
        emit('prevClick', event)
      }
    }
    const nextClick = (event: Event) => {
      if (props.nextStatus) {
        emit('nextClick', event)
      }
    }

    return {
      prefix,
      prevClick,
      nextClick,
    }
  },
  render() {
    const { prefix, pageStyle, prevStatus, nextStatus } = this
    return (
      <span
        class={classNames(this, `${prefix}-page`)}
        style={styles(this, pageStyle)}
      >
        <mtd-icon
          class={{
            [`${prefix}-action`]: true,
            [`${prefix}-action-disabled`]: !prevStatus,
          }}
          name={'left-thick'}
          onClick={this.prevClick}
        />
        <mtd-icon
          class={{
            [`${prefix}-action`]: true,
            [`${prefix}-action-disabled`]: !nextStatus,
          }}
          name={'right-thick'}
          onClick={this.nextClick}
        />
      </span>
    )
  },
})
