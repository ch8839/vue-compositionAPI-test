
import { computed, defineComponent, Fragment, getSlotsInRender } from '@ss/mtd-adapter'
import MtdButton from '@components/button'
import Locale from '@components/time-picker/locale'
import { useConfig } from '@components/config-provider'

export default defineComponent({
  components: { MtdButton },
  inheritAttrs: false,
  props: {
    isTime: {
      type: Boolean,
      default: false,
    },
    showBtnNow: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['confirm', 'click-now', 'close'],
  setup() {
    const config = useConfig()
    const prefixCls = computed(() => config.getPrefixCls('picker'))
    const timeClasses = computed(() => `${prefixCls.value}-confirm-time`)
    const t = Locale.t
    return {
      prefixCls, t, timeClasses,
    }
  },
  computed: {
    labels() {
      const labels = ['now', 'ok']
      const values = ['now', 'ok']
      return labels.reduce((obj, key, i) => {
        (obj as any)[key] = this.t('el.datepicker.' + values[i])
        return obj
      }, {}) as {
        now?: string,
        ok?: string,
      }
    },
  },
  methods: {
    handleClickNow() {
      this.$emit('click-now')
    },
    handleSuccess() {
      this.$emit('confirm')
    },
    close() {
      this.$emit('close')
    },
  },
  render() {
    const { showBtnNow, labels, prefixCls } = this
    return <div class={[prefixCls + '-confirm']}>
      {getSlotsInRender(this) ||
        <Fragment>
          <mtd-button
            size="small"
            type="text"
            onClick={this.handleClickNow}
            style={{ 'visibility': showBtnNow ? 'visible' : 'hidden' }}
          >
            {labels.now}
          </mtd-button>
          <div style="display:inline-flex;align-items: center;">
            <mtd-button size="small" type="text" onClick={this.close}>
              {'取消'}
            </mtd-button>
            <div style={'width:12px'} />
            <mtd-button size="small" type="primary" onClick={this.handleSuccess}>
              {labels.ok}
            </mtd-button>
          </div>
        </Fragment>
      }
    </div>
  },
})
