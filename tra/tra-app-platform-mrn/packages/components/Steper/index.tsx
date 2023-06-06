import React, { useState, useEffect, useMemo, useRef } from 'react'
import { View, TouchableOpacity, TextInput, Image } from '@mrn/react-native'
import { isDp } from '../utils'
import { WithThemeStyles, useTheme } from '../common/styles/theme'
import { stepperStyles, StepperStyles } from './styles'
import { Toast } from '@nibfe/gc-ui'
import { useDebounce } from '../hooks/index'

export interface StepperProps extends WithThemeStyles<StepperStyles> {
  value: number | string // 步进器值
  min?: number //最小值
  max?: number //最大值
  step?: number //步长
  precision?: number //精度
  readOnly?: boolean //是否不可编辑
  disabled?: boolean //是否禁用
  asyncChange?: boolean //是否异步改变
  onChange?: (value: number) => void
  onBlur?: (value: number) => void
  minLimit?: () => void
  maxLimit?: () => void
  toMaxToastText?: string
  disabledText?: string
}

// 初始化步进器值
function initValue(newValue, min, max, precision) {
  let val = format(newValue, precision)
  if (val < min) return min
  if (val > max) return max
  return val
}

function format(newValue, precision) {
  const regExp =
    precision > 0
      ? /^(([0-9])|([1-9]([0-9]+)))(\.?([0-9]*))$/
      : /^(0|[1-9][0-9]*)$/
  if (regExp.test(newValue) || newValue == '') {
    return newValue
  } else {
    return checkPrecision(newValue, precision)
  }
}

function checkPrecision(val, precision) {
  return typeof val === 'number' ? parseFloat(val.toFixed(precision)) : val
}

export const Stepper = (props: StepperProps) => {
  const styles = useTheme<StepperStyles>('Stepper', stepperStyles, props.styles)

  const {
    value = 1,
    min = 0,
    max = 100,
    step = 1,
    precision = 0,
    readOnly = true,
    disabled = false,
    asyncChange = false,
    toMaxToastText = '',
    disabledText = ''
  } = props
  const firstUpdate = useRef(true)
  let formatValue = initValue(value, min, max, precision)
  // 即时给用户反馈的数量值
  const [currentValue, setCurrentValue] = useState(formatValue)
  // 请求后端接口的数量值（有防抖特性）
  const [debouncedValue, setDebouncedValue] = useState(formatValue)
  useEffect(() => {
    // 避开初始化时触发的useEffect
    if(firstUpdate.current) {
      return
    }
    let formatValue = initValue(value, min, max, precision)
    setCurrentValue(formatValue)
  }, [value, min, max, precision])
  useEffect(() => {
    if(firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    const timer = setTimeout(() => {
      let debouncedValueNum = +debouncedValue
      debouncedValueNum = check(debouncedValueNum)
      !disabled && emitChange(debouncedValueNum)
    }, 600)

    return () => {
      clearTimeout(timer)
    }
  }, [debouncedValue])
  
  const decreaseDisable = useMemo(() => {
    return disabled || +currentValue <= +min
  }, [disabled, currentValue, min])

  const increaseDisable = useMemo(() => {
    return disabled || +currentValue >= +max
  }, [disabled, currentValue, max])

  function check(val) {
    val = isNaN(val) ? min : val
    val = checkPrecision(val, precision)
    val = checkMin(val)
    val = checkMax(val)
    return val
  }

  function checkMin(val) {
    if (val < min) {
      props.minLimit && props.minLimit()
      return (val = +min)
    }
    return val
  }

  function checkMax(val) {
    if (val > max) {
      props.maxLimit && props.maxLimit()
      return (val = +max)
    }
    return val
  }

  function handleChange(type) {
    if(disabled && disabledText) { 
      Toast.open(disabledText) 
      return
    }
    if (type == 'increase') {
      let changeValue = +currentValue + Number(step)
      changeValue = checkPrecision(changeValue, precision)
      changeValue = checkMax(changeValue)
      if(changeValue == max && toMaxToastText) Toast.open(toMaxToastText)
      !disabled && setCurrentValue(changeValue)
      !disabled && setDebouncedValue(changeValue)
    } else {
      let changeValue = +currentValue - Number(step)
      changeValue = checkPrecision(changeValue, precision)
      changeValue = checkMin(changeValue)
      !disabled && setCurrentValue(changeValue)
      !disabled && setDebouncedValue(changeValue)
    }
  }

  function onInput(value) {
    setCurrentValue(value)
    setDebouncedValue(value)
  }

  function onBlur() {}

  function emitChange(currentValue) {
    if (asyncChange) {
      props.onChange(currentValue)
    } else {
      setCurrentValue(currentValue)
      props.onChange(currentValue)
    }
  }

  const DecreaseComponent = (
    <TouchableOpacity
      onPress={() => handleChange('decrease')}
      // disabled={decreaseDisable}
    >
        <View
          style={[
            styles.operationButton,
            isDp ? styles.dpStyle : styles.mtStyle,
            isDp ? styles.dpBorder : styles.mtBorder,
            styles.decreaseInputBorder
          ]}
        >
          {decreaseDisable ? <Image style={{width: 10, height: 2}} 
          source={{uri: isDp ? 'https://p0.meituan.net/travelcube/348b7d9d368dc0176a9b9aa2baebeb4b104.png' 
          : 'https://p1.meituan.net/travelcube/38daa76e802c5e1e256889f350a91038106.png'}}/> 
            : 
            <View
              style={[styles.rowLine, isDp? styles.dpLine : styles.mtLine, decreaseDisable ? styles.disabledLine : null]}
            />
          }
        </View>
      
    </TouchableOpacity>
  )
  const IncreaseComponent = (
    <TouchableOpacity
      onPress={() => handleChange('increase')}
    >
      <View
        style={[
          styles.operationButton,
          isDp ? styles.dpStyle : styles.mtStyle,
          isDp ? styles.dpBorder : styles.mtBorder,
          styles.increaseInputBorder
        ]}
      >
        {increaseDisable ? 
          <Image style={{width: 10, height: 10}} source={{uri: isDp ? 'https://p0.meituan.net/travelcube/f5c153bdf5773fa6303d8f068c38845e219.png' : 'https://p0.meituan.net/travelcube/84e6833ea1ef6b17188dd50f8d349da5216.png'}}/>
          :
          <View
            style={[styles.rowLine, isDp? styles.dpLine : styles.mtLine, increaseDisable ? styles.disabledLine : null]}
          >
            <View
              style={[
                styles.columnLine,
                isDp? styles.dpLine : styles.mtLine,
                increaseDisable ? styles.disabledLine : null
              ]}
            />
          </View>
        }
      </View>
    </TouchableOpacity>
  )

  const InputComponent = (
    <View style={[isDp ? styles.dpBorder : styles.mtBorder, styles.inputBox, isDp ? styles.dpInputBox : {}]}>
      <TextInput
        style={[isDp ? styles.dpBorder : styles.mtBorder, styles.input, disabled && styles.disabledColor]}
        value={String(currentValue)}
        keyboardType="numeric"
        returnKeyType="done"
        onChangeText={(val: string | number) => onInput(val as any)}
        onBlur={onBlur}
        editable={!readOnly && !disabled}
      />
    </View>
  )
  return (
    <View style={styles.container}>
      {DecreaseComponent}
      {InputComponent}
      {IncreaseComponent}
    </View>
  )
}