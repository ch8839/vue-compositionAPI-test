import {
  defineComponent, computed, reactive, onMounted, nextTick, classNames, styles,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import vueInstance from '@components/hooks/instance'
import { autoprefixer, cssStyle } from './style'
import { firstUpperCase } from '@utils/util'
import { isArray } from '@components/__utils__/type'

export default defineComponent({
  name: 'MtdTabBar',
  inheritAttrs: false,
  props: {
    tabs: {
      type: Array,
      required: true,
    },
    lineSize: Number,
    tabPosition: String,
  },
  setup(props) {
    const ins = vueInstance()
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('tabs'))

    const barStyle = reactive({
      width: '',
      height: '',
      transform: '',
    })

    const style = computed(() => autoprefixer(barStyle))

    // 调用此方法更新 bar line 的样式
    function getStyle() {
      const tempBarStyle: Record<string, string | number | undefined> = {
        width: '',
        height: '',
        transform: '',
      }
      let offset = 0
      let sizeName = 'width'
      let tabSize = 0
      // 过滤 $el
      if (props.tabPosition === 'top' || props.tabPosition === 'bottom') {
        const styleList = ['padding-left', 'padding-right', 'margin-right']

        let paddingWidth = 0
        let marginWidth = 0
        props.tabs.every((tab: any, index) => {
          // 注意 $el 与 component 的关系， 外面拼装list 的方式会对这里有影响
          const tabRef = ins.$parent!.$refs[`tabs${index}`]
          const tabOne = isArray(tabRef) ? tabRef[0] : tabRef

          if (!tabOne) {
            // tofix: https://tt.sankuai.com/ticket/detail?id=3852483
            return
          }
          const $el = tabOne.$el || tabOne

          if (!$el) {
            return false
          }

          const style = cssStyle($el, ...styleList)
          const getPaddingWidth = () => {
            const paddingLeft = style['padding-left']
            const paddingRight = style['padding-right']
            return paddingLeft === paddingRight
              ? paddingLeft
              : paddingLeft + paddingRight
          }
          paddingWidth = getPaddingWidth()
          marginWidth = marginWidth || style['margin-right']

          if (tab.active) {
            tabSize += $el[`client${firstUpperCase(sizeName)}`]
            if (sizeName === 'width' && props.tabs.length > 1) {
              tabSize -= paddingWidth * 2
              // 计算头尾特殊tab 的line 的宽度
            }
            return false
          }

          offset += $el[`client${firstUpperCase(sizeName)}`]
          offset += marginWidth
          return true
        })

        if (sizeName === 'width') {
          offset = offset + paddingWidth
        }
        const transform = `translateX(${offset}px)`
        tempBarStyle[props.tabPosition === 'top' ? 'bottom' : 'top'] = '0'
        tempBarStyle[sizeName] = tabSize + 'px'
        tempBarStyle['height'] = props.lineSize
          ? `${props.lineSize}px`
          : props.lineSize
        tempBarStyle.transform = transform
      } else if (props.tabPosition === 'left' || props.tabPosition === 'right') {
        tabSize = 0
        sizeName = 'height'
        let marginWidth = 0
        const styleList = ['margin-bottom']
        props.tabs.every((tab: any, index) => {
          // 注意 $el 与 compoment 的关系， 外面拼装list 的方式会对这里有影响

          const tabRef = ins.$parent!.$refs[`tabs${index}`]
          const tabOne = isArray(tabRef) ? tabRef[0] : tabRef
          const $el = tabOne.$el || tabOne

          if (!$el) {
            return false
          }

          const style = cssStyle($el, ...styleList)

          marginWidth = marginWidth || style['margin-bottom']
          if (tab.active) {
            tabSize += $el[`client${firstUpperCase(sizeName)}`]
            return false
          }

          offset += $el[`client${firstUpperCase(sizeName)}`]
          offset += marginWidth
          return true
        })
        const transform = `translateY(${offset}px)`
        tempBarStyle[sizeName] = tabSize + 'px'
        tempBarStyle['width'] = props.lineSize
          ? `${props.lineSize}px`
          : props.lineSize
        tempBarStyle.transform = transform
      }

      // console.log('【tempBarStyle】', tempBarStyle)
      for (const key in tempBarStyle) {
        (barStyle as any)[key] = tempBarStyle[key]
      }
    }

    onMounted(() => {
      nextTick(() => {
        getStyle()
      })
    })

    return {
      prefix,
      style,
      getStyle,
      barStyle,
    }
  },
  render() {
    const { prefix, style } = this
    return <div
      class={classNames(this, `${prefix}-bar ${prefix}-bar-active`)}
      style={styles(this, style)}
    />
  },
})
