import {
  defineComponent,
  PropType,
  computed,
  reactive,
  onMounted,
  onUpdated,
  watch,
  ref,
  toRefs, classNames, styles,
  useListeners,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdSelectTag from './tag'
import MtdMultipleMirror from './multiple-mirror'
import MtdMultipleTooltip from './tooltip'
import MtdIcon from '@components/icon'
import { InputStatus } from '@components/input/types'
import { isNumber } from '@utils/type'

const StatusIconMap = {
  'error': 'error-circle',
  'success': 'success-circle',
  'warning': 'warning-circle',
}

export default defineComponent({
  name: 'MtdMultiple',
  components: {
    MtdSelectTag,
    MtdMultipleMirror,
    MtdMultipleTooltip,
    MtdIcon,
  },
  inheritAttrs: false,
  props: {
    value: {
      type: Array,
      default: () => [],
    }, // Option[]
    fieldNames: {
      type: Object,
      required: true,
    },
    maxCount: [Number, String],
    tipMaxCount: Number,
    placeholder: String,
    readonly: Boolean,
    disabled: Boolean,
    closable: [Boolean, Function],
    clearable: Boolean,
    prefixIcon: String,
    suffixIcon: String,
    loading: Boolean,
    invalid: Boolean,
    collapseTags: Boolean,
    formatter: Function,
    renderTag: Function,
    size: String,
    genre: Boolean,
    status: {
      type: String as PropType<InputStatus>,
    },
    hasFeedback: Boolean,
  },
  emits: ['remove', 'click', 'clear', 'query'],
  setup(props, { emit, slots }) {
    const responsive = computed(() => props.maxCount === 'responsive')

    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('select'))
    const inputPrefix = computed(() => config.getPrefixCls('input'))
    const prefixMTD = computed(() => config.getPrefix())

    const choices = ref<HTMLElement | null>(null)
    const mirror = ref<any | null>(null)
    const choicesMirror = ref<HTMLElement | null>(null)
    const restTag = ref<HTMLElement | null>(null)

    const state = reactive({
      focused: false,
      hovering: false,
      query: '',
      searchWidth: 5,
      tagsValueWidthMap: new Map(),

      // ————用于计算省略标签的变量 RestCalc————
      maxTagsWidth: 0, // tags 渲染区域最大宽度
      restTagWidthMap: {} as any, // { [key: value 值的长度]: width }
      maxShowTagsNumBoundaryWidth: 10, // 滑窗大小
      maxShowTagsNumBoundary: 0, // 滑窗的开始下标
      partialNewValueCalcFlag: responsive.value, // 迭代运算开关
      triggerCalcFlag: false,
      isNeedCalcRestTagWidth: responsive.value, //
      searchLineWidth: 10, // 选择框输入框长度 px

      // 计算属性
      finalMaxCount: responsive.value ? 0 : props.maxCount, // 最终迭代结束完毕的 迭代变化的最大展示标签数目
      hasPrefix: computed(() => !!(props.prefixIcon || slots.prefix)),
      hasSuffix: computed(() => props.loading || props.clearable ||
        !!(props.suffixIcon || slots.suffix)),
      hasValue: computed(() => props.value && !!props.value.length),

      querying: false,
    })
    const showClear = computed(() => props.clearable && !props.disabled && props.value
      && props.value.length && state.hovering)
    const tags = computed(() => {
      return props.value && props.value.length ? props.value.slice(0, state.finalMaxCount as number) : props.value
    })
    const hasMore = computed(() => {
      return !!(props.value && props.value.length && (props.value.length !== tags.value.length))
    })
    const hasQuery = computed(() => state.querying || !!state.query)
    const partialNewValue = computed(() => {
      if (state.hasValue && responsive.value && state.partialNewValueCalcFlag) {
        const result: any[] = []
        for (let i = state.maxShowTagsNumBoundary;
          i < props.value.length && result.length < state.maxShowTagsNumBoundaryWidth;
          i++) {
          const v = props.value[i] as any
          const w = state.tagsValueWidthMap.get(v[props.fieldNames.value])
          if (!w) {
            result.push(v)
          }
        }
        return result
      }
      return []
    })
    const allTagsNum = computed(() => {
      return props.value ? props.value.length : 0
    })
    const resetTagsNum = computed(() => {
      return allTagsNum.value - tags.value.length || 0
    })
    const resetValue = computed(() => {
      return props.value ? props.value.slice(tags.value.length, props.value.length) : []
    })

    /**
     * 计算是否需要开启局部渲染
     */
    const computedPartialValue = () => {
      if (state.hasValue) {
        const restTagWidth = getRestTagWidth(props.value.length)
        if (!restTagWidth) {
          state.isNeedCalcRestTagWidth = true
        }
        let max = state.maxTagsWidth - restTagWidth
        let i = 0
        while (max > 0 && i < props.value.length) {
          const item = props.value[i] as any
          const width = state.tagsValueWidthMap.get(item[props.fieldNames.value])
          if (!width) {
            state.maxShowTagsNumBoundary = i
            state.partialNewValueCalcFlag = true
            return
          } else {
            max = max - width
          }
          i++
        }
        if (!state.isNeedCalcRestTagWidth) {
          // 确认最终
          commitResponseCount(max > 0 ? i : i - 1)
        }
      }
    }
    const digit = (num: number) => num.toString().length
    /**
     * 计算可显示 value 的个数，如果不能得到准确的 value 个数，将会触发下一次渲染，直到获取到的准确的可显示的 value。
     */
    const restCalc = () => {
      if (state.hasValue) {

        let max = state.maxTagsWidth
        let index = 0
        let isNeedNextPartial = true // 为真的情况不用启动下一次渲染迭代计算
        let showTagsWidthSum = 0 // 展示的标签的宽度
        for (; index < props.value.length; index++) {
          const width = state.tagsValueWidthMap.get((props.value[index] as any)[props.fieldNames.value])
          if (!width) {
            isNeedNextPartial = false
            break
          }
          if (showTagsWidthSum + width > max) {
            isNeedNextPartial = true
            break
          }
          showTagsWidthSum += width
        }

        if (index === props.value.length) {
          // 说明可以全部显示下，就不用显示restTag
          commitResponseCount(index)
          return
        }

        const restTagWidth = getRestTagWidth(allTagsNum.value)
        // console.log('需要的省略标签宽度为', restTagWidth, state.restTagWidthMap)
        if (restTagWidth) {
          max = max - restTagWidth
          if (max < 0) {
            isNeedNextPartial = true
            index = 0
          } else if (showTagsWidthSum >= max) {
            // 缓存中已知宽度的数据就已经显示不下了
            isNeedNextPartial = true
            index--
            for (; index >= 0; index--) {
              const width = state.tagsValueWidthMap.get((props.value[index] as any)[props.fieldNames.value])
              showTagsWidthSum -= width
              // console.log(showTagsWidthSum, width)
              if (showTagsWidthSum <= max) {
                break
              }
            }
          }
        }

        if (!isNeedNextPartial) {
          setNextPartial(index) // 启动下一次迭代
        } else {
          commitResponseCount(index)
        }

      }
    }
    const setNextPartial = (num: number) => {
      state.maxShowTagsNumBoundary = num < 0 ? 0 : num
    }
    const commitResponseCount = (num: number) => {
      state.finalMaxCount = num
      state.partialNewValueCalcFlag = false
      state.isNeedCalcRestTagWidth = false
    }
    const initRestCalc = () => {
      state.finalMaxCount = 0
      state.maxShowTagsNumBoundary = 0
    }
    const updateTagsDomsWidth = () => {
      if (choicesMirror.value) {
        [...choicesMirror.value.children].forEach((tagDom, index) => {
          const tagWidth = (tagDom as HTMLElement).clientWidth
          const tag = partialNewValue.value[index]

          tag && state.tagsValueWidthMap.set(tag[props.fieldNames.value], tagWidth)
        })
      }
    }
    const updateRestTagDomWidth = () => {
      if (restTag.value) {
        [...restTag.value.children].forEach((restTagDom, index) => {
          state.restTagWidthMap[index + 1] = (restTagDom as HTMLElement).offsetWidth + 1 // 增加 1px 的容错
        })
        state.isNeedCalcRestTagWidth = false
      }
    }
    const getRestTagWidth = (num: number) => {
      if (num) {
        const digitNum = digit(num)
        return (state.restTagWidthMap)[digitNum] || 0
      }
      return 0
    }
    const reset = () => {
      state.query = ''
      mirror.value && mirror.value.reset()
    }
    const focus = () => {
      mirror.value && mirror.value.focus()
    }
    const blur = () => {
      mirror.value && mirror.value.blur()
      reset()
    }

    // private
    const enter = () => {
      state.hovering = true
    }
    const leave = () => {
      state.hovering = false
    }
    const handleClick = (e: Event) => {
      emit('click', e)
      mirror.value && mirror.value.focus()
    }
    const handleFocus = () => {
      mirror.value && mirror.value.focus()
    }
    const handleInput = (v: string) => {
      state.querying = !!v
    }
    const handleMirrorBlur = () => {
      state.querying = false
    }
    const handleChange = (v: string) => {
      state.query = v
      emit('query', v)
    }
    const handleClearClick = () => {
      emit('clear')
    }
    const handlePrefixClick = () => {
      mirror.value && mirror.value.focus()
    }
    const handleClose = (option: any) => {
      emit('remove', option)
    }

    watch(() => props.value, () => {
      if (responsive.value) {
        initRestCalc()
        computedPartialValue()
        state.triggerCalcFlag = true
      }
    }, { immediate: true, deep: true })
    watch(() => props.maxCount, val => {
      if (isNumber(val)) {
        state.finalMaxCount = val
      }
    })

    onMounted(() => {
      setTimeout(() => {
        if (choices.value) {
          state.maxTagsWidth = choices.value.clientWidth - state.searchLineWidth
        }
        if (responsive.value) {
          updateTagsDomsWidth()
          updateRestTagDomWidth()
          restCalc()
        }
      }, 100)
    })

    onUpdated(() => {
      if (responsive.value) {
        if (state.isNeedCalcRestTagWidth) {
          updateRestTagDomWidth()
        }

        if (state.partialNewValueCalcFlag || state.triggerCalcFlag) {
          state.partialNewValueCalcFlag && updateTagsDomsWidth()
          state.triggerCalcFlag = false
          restCalc()
        }
      }
    })

    const mirrorListeners = useListeners({
      input: handleInput,
      blur: handleMirrorBlur,
    })

    return {
      prefix, prefixMTD,
      ...toRefs(state),
      mirrorListeners,
      showClear,
      hasQuery,
      tags,
      hasMore,
      partialNewValue,
      responsive,
      allTagsNum,
      resetTagsNum,
      resetValue,
      inputPrefix,
      focus, blur, enter, leave, handleClick, handleFocus, handleInput, handleClearClick,
      handlePrefixClick, handleClose, reset, handleChange,
      choices,
      mirror,
      choicesMirror,
      restTag,
    }
  },
  render() {
    const {
      hasPrefix, hasSuffix, inputPrefix, prefixMTD,
      prefixIcon, suffixIcon,
      hasValue, placeholder, hovering,
      readonly, invalid,
      loading, showClear, closable,
      hasQuery, tags, resetValue,
      prefix, tipMaxCount,
      renderTag, formatter,
      collapseTags, hasMore,
      size, genre, disabled,
      responsive, partialNewValue,
      resetTagsNum, fieldNames,
      status, hasFeedback, isNeedCalcRestTagWidth,
      mirrorListeners,
    } = this
    const iterator = (v: any, i: number) => {
      return <mtd-select-tag
        option={v}
        closable={closable}
        size={size}
        key={i}
        disabled={disabled || v.disabled}
        renderTag={renderTag}
        onClose={this.handleClose}
      >
        {formatter ? formatter(v) : (v[fieldNames.label] || v[fieldNames.value])}
      </mtd-select-tag>
    }
    return <div
      class={classNames(this, [
        `${inputPrefix}-wrapper`, `${prefixMTD}-select-multiple-input`, {
          [`${inputPrefix}-group`]: getSlotsInRender(this, 'prepend') || getSlotsInRender(this, 'append'),
          [`${inputPrefix}-prefix`]: hasPrefix,
          [`${inputPrefix}-suffix`]: hasSuffix,
          [`${inputPrefix}-hover`]: !disabled && hovering,
          [`${inputPrefix}-disabled`]: disabled,
          [`${inputPrefix}-invalid`]: invalid,
          [`${inputPrefix}-${size}`]: !!size,
          [`${inputPrefix}-${genre}`]: !!genre,
          [`${inputPrefix}-${status}`]: !!status,
          [`${prefixMTD}-multiple-has-value`]: !!hasValue,
        }])}
      style={styles(this)}
      onMouseenter={this.enter}
      onMouseleave={this.leave}
      onClick={this.handleClick}
    >
      {/* 已选择标签(test) */}
      {responsive && <div class={`${prefixMTD}-select-multiple-input-test`}>
        {hasValue &&
          <div class={`${prefixMTD}-select-choices`} ref="choicesMirror">
            {partialNewValue.map(iterator)}
          </div>
        }
        {isNeedCalcRestTagWidth &&
          <div class={`${prefixMTD}-select-resttags ${prefixMTD}-select-tags-li`} ref="restTag">
            {new Array(10).fill(10).map((num, index) => {
              const testNum = 10 ** index // 1,10,100,1000,...
              return <span class={`${prefix}-tags-text`}>+{testNum}</span>
            })
            }
          </div>
        }
      </div>}
      {hasPrefix && <span class={`${inputPrefix}-prefix-inner`}>
        {getSlotsInRender(this, 'prefix') || <i class={prefixIcon} />}
      </span>}

      <div class={inputPrefix} tabindex="0" onFocus={this.handleFocus}>
        <div style="height: 0; position: relative;">
          <div class={`${prefixMTD}-select-placeholder`}
            style={{
              display: (hasValue || hasQuery) ? 'none' : '',
            }}
          ><span>{placeholder}</span></div>
        </div>

        <div class={`${prefixMTD}-multiple-select-choices`} ref="choices">

          {/* 已选择标签 */}
          {hasValue && tags.map(iterator)}

          {/* 省略标签 */}
          {hasMore &&
            <mtd-multiple-tooltip prefix={prefix} value={resetValue}
              class={`${prefix}-tags-li`} closable={closable}
              maxCount={tipMaxCount} formatter={formatter}
              onClose={this.handleClose}
              style={{ float: tags.length ? 'right' : 'left' }}
            >
              <span class={`${prefix}-tags-text`}>+{resetTagsNum}</span>
            </mtd-multiple-tooltip>
          }

          {/* 搜索框 */}
          <mtd-multiple-mirror
            ref="mirror"
            prefix={prefix}
            shouldCollapse={collapseTags}
            readonly={disabled || readonly}
            {...mirrorListeners}
            onChange={this.handleChange}
          />
        </div>
      </div>
      {hasSuffix &&
        <div class={`${inputPrefix}-suffix-inner`}>
          {loading
            ? <MtdIcon name="loading" />
            : showClear
              ? <mtd-icon
                name="error-circle" class={`${inputPrefix}-clear`}
                onClick={this.handleClearClick}
              />
              : (getSlotsInRender(this, 'suffix') || <MtdIcon name={suffixIcon} />)
          }
          {hasFeedback && status && StatusIconMap[status] &&
            <mtd-icon name={StatusIconMap[status]} class="status-icon" />
          }
        </div>
      }
    </div >
  },
})
