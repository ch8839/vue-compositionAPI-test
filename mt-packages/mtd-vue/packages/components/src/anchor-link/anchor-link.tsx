import {
  defineComponent,
  computed,
  onBeforeUnmount,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { error } from '@utils/log'
import useAnchorProvide from '../anchor/useProvide'
import vueInstance from '@components/hooks/instance'

export default defineComponent({
  name: 'MtdAnchorLink',
  inheritAttrs: true,
  props: {
    href: String,
    title: String,
    scrollOffset: {
      type: Number,
    },
  },
  emits: [],
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('anchor-link'))
    const ins = vueInstance()

    const { injectAnchor } = useAnchorProvide()
    const anchor = injectAnchor()!
    if (!anchor) {
      error('anchorLink', 'must use in Anchor component')
    }

    // @Computed
    const offset = computed(() => props.scrollOffset !== undefined ? props.scrollOffset : anchor.scrollOffset)
    const anchorLinkClasses = computed(() => {
      return [
        prefix.value,
        anchor.currentLink === props.href ? `${prefix.value}-active` : '',
      ]
    })
    const linkTitleClasses = computed(() => [`${prefix.value}-title`])

    // @Methods
    function goAnchor(e: Event) {
      e.preventDefault()
      if (!props.href) {
        return
      }
      anchor.emitter.emit('go', props.href)
    }

    anchor.emitter.emit('addAnchorLink', ins)
    onBeforeUnmount(() => {
      anchor.emitter.emit('removeAnchorLink', ins)
    })

    const computedCollection = {
      offset, anchorLinkClasses, linkTitleClasses,
    }
    const methodsCollection = {
      goAnchor,
    }

    return {
      prefix,
      ...computedCollection,
      ...methodsCollection,
    }
  },
  render() {
    const {
      title, offset, anchorLinkClasses, linkTitleClasses, href,
    } = this
    return <div class={anchorLinkClasses}>
      <a
        class={linkTitleClasses}
        href={href}
        data-scroll-offset={offset}
        data-href={href}
        onClick={this.goAnchor}
        title={title}
      >
        {title}
      </a>
      {this.$slots.default}
    </div >
  },
})
