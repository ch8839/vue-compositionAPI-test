import {
  computed,
  defineComponent,
  PropType,
  reactive,
  ref,
  toRefs,
  watch,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdSliderButton from './button'
import MtdSliderRangeButton from './range-button'
import {
  Marks,
  Thresholds,
  MarkText,
  FormatTooltip,
} from './types'
import { isArray } from '@utils/type'

import { useFormItem } from '@components/form-item/useFormItem'

export default defineComponent({
  name: 'MtdSlider',
  components: {
    MtdSliderButton,
    MtdSliderRangeButton,
  },
  inheritAttrs: true,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    size: {
      type: String,
    },
    marks: {
      type: Object as PropType<Marks>,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    modelValue: {
      type: [Number, Array] as PropType<number | number[]>,
      default: 0,
    },
    range: {
      type: Boolean,
      default: false,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    gradients: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    step: Number,
    steps: Array as PropType<number[]>,
    thresholds: {
      type: Object as PropType<Thresholds>,
    },
    fixedValue: {
      type: Number,
    },
    fixedRange: {
      type: Boolean,
    },
    noShade: {
      type: Boolean,
      default: false,
    },
    formatTooltip: Function as PropType<FormatTooltip>,
  },
  emits: ['change', 'after-change', 'input', 'update:modelValue'],

  setup(props, ctx) {
    const { emit } = ctx
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('slider'))

    const sliderWrapperRef = ref<HTMLElement | null>(null)

    const state = reactive({
      dragging: false,
      tip: false,
      internalValue: [] as number[],
      rangeWidth: 0,
      dragStartValue: 0,
      tempInternalValue: [] as number[],
    })

    const formItemHook = useFormItem(props, ctx)
    const m_disabled = formItemHook.disabled

    //@Created

    //@Computed
    const minValue = computed(() => {
      return Math.max(Math.min(...state.internalValue), props.min)
    })
    const maxValue = computed(() => {
      return Math.min(Math.max(...state.internalValue), props.max)
    })
    const bars = computed(() => {
      const min = props.range ? minValue.value : props.min
      return {
        w: getPercent(maxValue.value - min, 0),
        x: props.range ? getPercent(minValue.value) : 0,
      }
    })
    const dots = computed(() => {
      if ((!props.step || props.step < 0) && !props.steps) {
        return
      }
      let arr: number[] = props.step ? [] : props.steps!
      if (props.step) {
        let n = props.min + props.step
        while (n < props.max) {
          arr.push(n)
          n = n + props.step
        }
      }
      arr = arr.filter((v) => {
        return v > props.min && v < props.max
      })
      return arr
    })
    const markTexts = computed(() => {
      let arr: MarkText[]
      if (props.marks) {
        arr = Object.keys(props.marks).map((m: string) => {
          return {
            value: Number(m),
            label: props.marks![m] || m,
          }
        })
      } else {
        let temp: number[] = [props.min, props.max]
        if (props.fixedValue) {
          temp = [...[props.fixedValue], ...temp]
        }
        if (dots.value) {
          temp = [...dots.value, ...temp]
        }
        if (props.thresholds) {
          temp = [...props.thresholds.values, ...temp]
        }
        arr = temp.map((v) => {
          return { value: v, label: v + '' }
        })
      }
      arr = arr
        .sort((a, b) => a.value - b.value)
        .filter(
          (v, i) =>
            (!arr[i + 1] || v.value !== arr[i + 1].value) &&
            v.value >= props.min &&
            v.value <= props.max,
        )
      return arr
    })
    const wholeLength = computed<number>(() => {
      return props.max - props.min
    })
    const curFixedValue = computed(() => {
      return props.fixedValue || props.min
    })
    const wrapperClass = computed(() => {
      return [
        prefix.value,
        [
          {
            [`${prefix.value}-disabled`]: m_disabled.value,
            [`${prefix.value}-vertical`]: props.vertical,
            [`${prefix.value}-${props.size}`]: props.size,
            [`${prefix.value}-no-shade`]: props.noShade,
            [`${prefix.value}-marks`]: props.marks,
          },
        ],
      ]
    })
    const trackStyle = computed(() => {
      const result: any = {}
      if (props.thresholds) {
        const { values, colors } = props.thresholds
        let linearGradientValue: string[] = []
        if (props.gradients) {
          linearGradientValue = values.map((val, index) => {
            return `${colors[index]} ${getPercent(val)}`
          })
        } else {
          const percentArr = values.map(val => getPercent(val))
          percentArr.forEach((percent, index, arr) => {
            const color = colors[index]
            const percentStart = index > 0 ? arr[index - 1] : '0%'
            const percentEnd = percent
            linearGradientValue.push(`${color} ${percentStart}`)
            linearGradientValue.push(`${color} ${percentEnd}`)
          })
        }

        result.backgroundImage = `linear-gradient(to ${props.vertical ? 'top' : 'right'}, ${linearGradientValue})`
      }

      result[props.vertical ? 'height' : 'width'] = '100%'

      return result
    })

    //@Watch
    watch(() => props.modelValue, () => {
      syncValue()
    }, { immediate: true })
    watch(() => props.range, () => {
      syncValue()
    })

    //@Methods
    function syncValue() {
      state.internalValue = isArray(props.modelValue)
        ? [...props.modelValue]
        : [props.modelValue || 0]
      if (props.range) {
        state.internalValue.length = 2
        if (props.fixedRange && isArray(props.modelValue)) {
          state.rangeWidth = Math.abs(props.modelValue[1] - props.modelValue[0])
        }
      } else {
        state.internalValue.length = 1
      }
      for (let i = 0; i < state.internalValue.length; i++) {
        // can't use .map()
        const v = state.internalValue[i]
        state.internalValue[i] = !v && v !== 0 ? props.min : v
      }
    }
    function getPercent(value: number, m_b?: number) {
      const begin: number = m_b === undefined ? props.min : m_b
      let n = ((value - begin) * 100) / wholeLength.value
      if (n < 0) {
        n = 0
      } else if (n > 100) {
        n = 100
      }
      return `${n}%`
    }
    function handleClick(e: MouseEvent) {
      if (state.dragging || (props.range && props.fixedRange)) {
        return
      }
      props.vertical ? setPositionY(e) : setPositionX(e)
      handleChange()
    }
    function handleButtonDragging(e: MouseEvent, type?: number) {
      state.dragging = true
      props.vertical ? setPositionY(e, type) : setPositionX(e, type)
    }
    function handleDragRangeButtonStart(e: MouseEvent) {
      state.dragStartValue = -1 // 标志需要将这个值进行一次更新
      props.vertical ? setPositionY(e) : setPositionX(e)
    }
    function handleDragEnd() {
      state.dragging = false
      state.dragStartValue = 0
      state.tempInternalValue = []
    }
    function parseValue(value: number) {
      return parseInt(value + '') // todo 解决精度问题
    }
    function setValue(offset: number, type?: number) {

      if (props.fixedRange && props.range) {
        setRangeValue(offset)
        return
      }

      const dot = getNearestStop(offset)
      const value =
        dot !== undefined
          ? dot
          : parseValue(props.min + offset * wholeLength.value)

      const index =
        type === undefined ? getNearestButtonType(value) : type

      state.internalValue = [...state.internalValue] // 触发响应式
      state.internalValue[index] = value
    }
    function setRangeValue(offset: number) {
      const dot = getNearestStop(offset)
      const value =
        dot !== undefined
          ? dot
          : parseValue(props.min + offset * wholeLength.value)

      if (state.dragStartValue === -1) {
        state.dragStartValue = value
        state.tempInternalValue = state.internalValue
      } else {
        const offsetValue = value - state.dragStartValue
        const newInternalValue_min =
          Math.min(
            Math.max(Math.min(...state.tempInternalValue) + offsetValue, props.min),
            props.max - state.rangeWidth,
          )
        const newInternalValue_max = newInternalValue_min + state.rangeWidth
        state.internalValue = [newInternalValue_min, newInternalValue_max]
      }

    }
    function setPositionX(e: MouseEvent, type?: number) {
      if (m_disabled.value) {
        return
      }
      const sliderWrapper = sliderWrapperRef.value
      const { left: start, right: end } = sliderWrapper!.getBoundingClientRect()
      const clientWidth = sliderWrapper!.clientWidth

      const fixedValue =
        start +
        Math.round(
          ((curFixedValue.value - props.min) / wholeLength.value) * clientWidth,
        )

      const current = e.clientX
      let offset
      if (current <= fixedValue) {
        offset = (curFixedValue.value - props.min) / wholeLength.value
      } else if (e.clientX >= end) {
        offset = 1
      } else {
        offset = (current - start) / clientWidth
      }
      setValue(offset, type)
    }
    function setPositionY(e: MouseEvent, type?: number) {
      if (m_disabled.value) {
        return
      }
      const sliderWrapper = sliderWrapperRef.value
      const { bottom: start, top: end } = sliderWrapper!.getBoundingClientRect()
      const clientHeight = sliderWrapper!.clientHeight

      const fixedValue =
        start -
        Math.round(
          ((curFixedValue.value - props.min) / wholeLength.value) * clientHeight,
        )
      const current = e.clientY
      let offset
      if (current >= fixedValue) {
        offset = (curFixedValue.value - props.min) / wholeLength.value
      } else if (current <= end) {
        offset = 1
      } else {
        offset = (start - current) / clientHeight
      }
      setValue(offset, type)
    }
    function getNearestButtonType(value: number) {
      const vs = state.internalValue.map((v, i) => {
        return {
          index: i,
          diff: Math.abs(v - value),
        }
      })
      vs.sort((a, b) => a.diff - b.diff)
      return vs[0] ? vs[0].index : 1
    }
    function getNearestStop(offset: number) {
      if (!dots.value) {
        return undefined
      }
      const value = offset * wholeLength.value + props.min
      const orders = [props.min, props.max, value, ...dots.value].sort(
        (a, b) => a - b,
      )
      const index = orders.indexOf(value)
      const next = index === orders.length ? props.max : orders[index + 1]
      const pre = index === 0 ? props.min : orders[index - 1]
      return Math.abs(next - value) > Math.abs(pre - value) ? pre : next
    }

    function handleInput(isChange = false) {
      const value = state.internalValue.sort((a, b) => a - b)
      if (
        value.some(
          (v, i) =>
            v !== props.modelValue && v !== (props.modelValue as number[])[i],
        )
      ) {
        const v = props.range ? value : value[0]
        emit('input', v)
        emit('update:modelValue', v)

        if (isChange) {
          formItemHook.m_handleChange(v)
        }
      }
      syncValue()
    }

    function handleChange() {
      handleInput(true)
    }

    const computedCollection = {
      wrapperClass, bars, dots, minValue, maxValue, wholeLength, markTexts, trackStyle,
    }
    const methodsCollection = {
      handleClick, getPercent, handleChange, handleButtonDragging, handleDragEnd, handleDragRangeButtonStart, handleInput,
    }

    return {
      ...toRefs(state),
      ...computedCollection,
      ...methodsCollection,
      prefix, sliderWrapperRef,
    }
  },
  render() {
    const {
      prefix, wrapperClass, vertical, bars, thresholds, fixedValue, internalValue,
      formatTooltip, dots, range, minValue, maxValue, min, wholeLength, marks,
      markTexts, trackStyle, fixedRange,
    } = this

    return <div class={wrapperClass} ref="sliderWrapperRef" onClick={this.handleClick}>

      <div
        class={`${prefix}-bar-bgc`}
      />

      {(!thresholds) &&
        <div
          class={`${prefix}-bar`}
          style={vertical
            ? { height: bars.w, bottom: bars.x }
            : { width: bars.w, left: bars.x }
          }
        />
      }

      {fixedValue &&
        <div
          class={`${prefix}-fixed-bar`}
          style={vertical
            ? { height: this.getPercent(fixedValue) }
            : { width: this.getPercent(fixedValue) }
          } />
      }
      {!fixedRange
        ? internalValue.map((item, i) => {
          return <mtd-slider-button
            key={'button-' + i}
            value={item}
            type={i}
            vertical={vertical}
            format-tooltip={formatTooltip}
            get-percent={this.getPercent}
            onChange={this.handleChange}
            onInput={this.handleInput}
            onDragging={this.handleButtonDragging}
            onDrag-end={this.handleDragEnd}
          >
            {getSlotsInRender(this, 'handler')}
          </mtd-slider-button>
        })
        : <mtd-slider-range-button
          value={internalValue}
          vertical={vertical}
          bars={bars}
          thresholds={!!thresholds}
          format-tooltip={formatTooltip}
          get-percent={this.getPercent}
          onChange={this.handleChange}
          onInput={this.handleInput}
          onDrag-start={this.handleDragRangeButtonStart}
          onDragging={this.handleButtonDragging}
          onDrag-end={this.handleDragEnd}
        >
          {getSlotsInRender(this, 'handler')}
        </mtd-slider-range-button>
      }

      {dots && dots.map(item => {
        return <div
          key={'stop-' + item}
          class={`${prefix}-stop`}
          style={vertical
            ? { bottom: this.getPercent(item) }
            : { left: this.getPercent(item) }
          } />
      })}

      {thresholds && <div class={`${prefix}-tracks`} >
        {range && <div
          class={`${prefix}-track ${prefix}-track-left`}
          style={
            vertical
              ? { height: `${((minValue - min) * 100) / wholeLength}%` }
              : { width: `${((minValue - min) * 100) / wholeLength}%` }
          }
        />}

        <div class={`${prefix}-track`} style={trackStyle} />

        <div
          class={`${prefix}-track ${prefix}-track-right`}
          style={
            vertical
              ? { height: `${100 - ((maxValue - min) * 100) / wholeLength}%` }
              : { width: `${100 - ((maxValue - min) * 100) / wholeLength}%` }
          }
        />
      </div>}

      <div
        class={`${prefix}-mark`}
        style={vertical ? { height: '100%' } : { width: '100%' }}
      >
        {marks && markTexts.map((item, index) => <span
          class={`${prefix}-mark-text`}
          key={'mark-' + index}
          style={
            vertical
              ? { bottom: `${((item.value - min) * 100) / wholeLength}%` }
              : { left: `${((item.value - min) * 100) / wholeLength}%` }
          }
        >{item.label}</span>)}
      </div >

    </div >
  },
})
