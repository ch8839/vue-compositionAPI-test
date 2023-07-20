import { defineComponent, useResetAttrs, getSlotsInRender, classNames, styles } from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { useBreadcrumb } from './breadcrumb'
import { createError } from '@utils/log'
import MtdIcon from '@components/icon'

export default defineComponent({
  name: 'MtdBreadcrumbItem',
  components: {
    MtdIcon,
  },
  inheritAttrs: false,
  props: {
    tag: {
      type: String,
      default: 'span',
    },
    icon: String,
    disabled: Boolean,
  },
  setup(props, { attrs }) {
    const config = useConfig()
    const prefix = config.getPrefixCls('breadcrumb-item')
    const iconPrefix = config.getIconCls

    const breadcrumb = useBreadcrumb()
    if (!breadcrumb) {
      throw createError('MtdBreadcrumbItem', 'MtdBreadcrumbItem must be used in MtdBreadcrumb')
    }

    const resetAttrs = useResetAttrs({
      ...attrs,
      class: `${breadcrumb.breadcrumbPrefix}-inner ${props.disabled ? `${prefix}-disabled` : ''}`,
      style: undefined,
    })

    return {
      separator: breadcrumb.separator,
      separatorClass: breadcrumb.separatorClass,
      breadcrumbPrefix: breadcrumb.breadcrumbPrefix,
      prefix, iconPrefix,
      resetAttrs,
    }
  },
  render() {
    const {
      prefix, iconPrefix,
      resetAttrs,
      separatorClass,
      separator,
      breadcrumbPrefix,
    } = this
    const { tag, icon } = this.$props
    const Component = tag as any

    return <span
      class={classNames(this, prefix)}
      style={styles(this)}
    >
      <Component
        {...resetAttrs}
      >
        {icon && <i class={[`${prefix}-icon`, iconPrefix(icon)]} />}
        {getSlotsInRender(this)}

      </Component>
      <span class={[`${breadcrumbPrefix}-separator`, separatorClass]}>
        {separator || <mtd-icon name="slash" />}
      </span>
    </span>
  },
})
