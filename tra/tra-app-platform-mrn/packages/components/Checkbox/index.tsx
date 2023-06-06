import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedback,
  Image
} from '@mrn/react-native'
import { WithThemeStyles, useTheme, ThemeContext } from '../common/styles/theme'
import { checkboxStyles, CheckboxStyles } from './styles'
import { Icon } from '@nibfe/gc-ui'
import { isDp } from '../utils'

export interface CheckboxProps extends WithThemeStyles<CheckboxStyles> {
  // 是否选中
  checked?: boolean
  // 是否禁用
  disabled?: boolean
  // 尺寸大小
  size?: number
  style?: StyleProp<ViewStyle>
  canToggle?: boolean
  children?: any
  onChange?: (isChecked: boolean) => void
  deleteTouchableOuterLayer?: boolean
}

export const Checkbox = (props: CheckboxProps) => {
  const context = useContext(ThemeContext)
  const styles = useTheme<CheckboxStyles>(
    'Checkbox',
    checkboxStyles,
    props.styles
  )
  const { checked, disabled, children, size, canToggle, deleteTouchableOuterLayer } = props

  const [_checked, set_Checked] = useState(checked)
  useEffect(() => {
    set_Checked(checked)
  }, [checked, children])

  const MyIcon = styles => {
    const iconName = (function () {
      return _checked ? (isDp ? 'dp_success_fill' : 'mt_success_fill') : 'common_radio_default'
    })()
    const tintColor = (function () {
      if (_checked) {
        if (disabled) {
          return context.theme.grayDeep
        } else {
          return isDp ? '#FF6633' : ''
        }
      } else {
        return context.theme.grayDeep
      }
    })()
    if(iconName === 'mt_success_fill') {
      return <Image style={{width: size, height: size}} source={{uri: 'https://p0.meituan.net/travelcube/6df6ea6bcfd670d81b21ed6c9415b0782106.png'}} />
    } else if(iconName === 'dp_success_fill') {
      return <Image style={{width: size, height: size}} source={{uri: 'https://p0.meituan.net/travelcube/6aa4974f78f518863e36191b7d036de62121.png'}} />
    } else if(iconName === 'common_radio_default') {
      return <Image style={{width: size, height: size}} source={{uri: 'https://p0.meituan.net/travelcube/e39c1de8900fb728aca8d7e42f2c6b5e1947.png'}} />
    }
    return (
      disabled ? 
      <Icon
        style={[styles.iconItem, disabled && styles.disabledWrapper]}
        name={"collect_background"}
        tintColor={"#F7F7F7"}
        size={size}
      /> :
      <Icon
        style={[styles.iconItem, disabled && styles.disabledWrapper]}
        name={iconName}
        tintColor={tintColor}
        size={size}
      />
    )
  }

  function handleClick() {
    if (disabled || (!canToggle && _checked === true)) {
      return
    }
    let nextCheckedStatus = !_checked
    set_Checked(nextCheckedStatus)

    if (props.onChange) {
      props.onChange(nextCheckedStatus)
    }
  }

  return (
    deleteTouchableOuterLayer ? 
      (<View style={[styles.wrapper]}>
          <MyIcon styles={styles} />
          {typeof children === 'string' ? (
            <Text style={styles.iconRight}>{children}</Text>
          ) : (
            children
          )}
        </View>) 
      : 
      (<TouchableWithoutFeedback onPress={() => handleClick()}>
        <View style={[styles.wrapper]}>
          <MyIcon styles={styles} />
          {typeof children === 'string' ? (
            <Text style={styles.iconRight}>{children}</Text>
          ) : (
            children
          )}
        </View>
      </TouchableWithoutFeedback>)
  )
}

Checkbox.defaultProps = {
  checked: false,
  disabled: false,
  size: 25,
  canToggle: true,
  deleteTouchableOuterLayer: false,
}