import {
  defineComponent,
  computed,
  ref,
  getSlotsInRender,
  useListeners, getListeners,
  classNames, styles,
  defineEmits,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import props from './props'
import { isArray, isFunction, isPromise } from '@utils/type'

import useControlled from '@hooks/controlled'

import MtdIcon from '@components/icon'
import MtdLoadingCircle from '@components/loading/circle'

export default defineComponent({
  name: 'MtdButton',
  components: {
    MtdIcon,
    MtdLoadingCircle,
  },
  inheritAttrs: false,
  props: props(),
  emits: defineEmits([]), // 🤡 vue3 加上click别想拿到
  setup(props, context) {
    // get prefix class
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('btn'))

    // get ref
    const buttonRef = ref<HTMLElement | null>(null)

    // get root component
    const tag = computed(() => {
      if (props.to !== undefined) {
        return 'router-link'
      } else if (props.href !== undefined) {
        return 'a'
      } else {
        return 'button'
      }
    })

    let timer = 0
    const clicked = ref(false)
    // eslint-disable-next-line
    function useClicked(e: Event) {
      clearTimeout(timer)
      clicked.value = true
      timer = setTimeout(() => {
        clicked.value = false
      }, 300)
    }

    const listeners = getListeners()
    const [loading, setLoading] = useControlled<boolean>('loading', props, context)
    function useClickLoading(e: Event) {
      const onClick = listeners.value.click
      const handler = () => {
        setLoading(false, { force: true })
      }
      if (isArray(onClick)) {
        const r = Promise.all(onClick.map((fn) => fn && fn(e)))
        setLoading(true, { force: true })
        r.then(handler, handler)
      } else if (isFunction(onClick)) {
        const r = onClick(e)
        if (isPromise(r)) {
          setLoading(true, { force: true })
          r.then(handler, handler)
        }
      }
    }

    const handleClick = (e: Event) => {
      if (props.disabled) { return }
      useClicked(e)
      useClickLoading(e)
    }

    const restListeners = useListeners({
      click: handleClick,
    })

    const focus = () => { buttonRef.value?.focus() }
    const blur = () => { buttonRef.value?.blur() }

    return {
      clicked,
      tag,
      innerLoading: loading,
      prefix,
      restListeners,
      handleClick,
      focus,
      blur,
      buttonRef,
    }
  },
  render() {
    const {
      clicked, tag,
      innerLoading: loading,
      prefix,
      htmlType,
      type,
      size,
      dashed,
      disabled,
      ghost,
      icon,
      href,
      to,
      restListeners,
    } = this
    // innerLoding返回一个计算属性的loading，无loading才用inner
    const Component = tag

    return <Component
      class={classNames(this, [
        `${prefix}`,
        `${type ? `${prefix}-${type}` : ''}`,
        `${size ? `${prefix}-${size}` : ''}`,
        {
          [`${prefix}-dashed`]: dashed,
          [`${prefix}-disabled`]: disabled,
          [`${prefix}-loading`]: loading,
          [`${prefix}-clicked`]: clicked,
          [`${prefix}-ghost`]: ghost,
        },
      ])}
      style={styles(this)}
      href={href}
      to={to}
      type={htmlType}
      disabled={disabled || loading ? 'disabled' : undefined}
      ref={'buttonRef'}
      {...restListeners}
    >
      {
        (loading || icon || getSlotsInRender(this, 'icon')) &&
        <span class={`${prefix}-before`}
          style={{ marginRight: getSlotsInRender(this) ? undefined : '0px' }}>
          {loading ? <mtd-loading-circle style="color:currentColor" />
            : (getSlotsInRender(this, 'icon') || <mtd-icon name={icon} />)
          }
        </span>
      }
      {getSlotsInRender(this)}
    </Component>
  },
})
