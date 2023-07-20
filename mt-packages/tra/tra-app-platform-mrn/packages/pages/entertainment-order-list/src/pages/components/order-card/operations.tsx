import React, { useContext, useMemo } from 'react'
import { GCUIThemeContext } from '@nibfe/theme-provider-lighter'
import { View, Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from '@mrn/react-native'
import { observer } from '@nibfe/tra-app-platform-core'
import { styles } from './styles'

type btnType = 'primary' | 'secondary'

export interface Operation {
  text: string
  style: number // 展示样式：0浅色，1深色
  url: string // 点击按钮后的跳转地址
  // text: string,
  // action?: (button: Operation, event: GestureResponderEvent) => any
  // type?: btnType,
}

export interface Btn {
  text: string,
  action?: (button: Btn, event: GestureResponderEvent) => any
  type?: btnType,
}

export const operationStyles = StyleSheet.create({
  wrapperStyle: {
    paddingTop: 12,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  button: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondary: {
    borderWidth: 0.5,
    borderStyle: 'solid',
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 12,
    color: '#222222',
    lineHeight: 17,
  },
})

const dp_styles = theme => StyleSheet.create({
  primary: {
    backgroundColor: theme.BrandPrimary,
  },
  secondary: {
    borderColor: '#BBBBBB',
  },
  button: {
    paddingHorizontal: 13,
    borderRadius: 50,
    width: 'auto',
    minWidth: 65,
    marginLeft: 8,
    height: 25,
    lineHeight: 25
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 13,
    color: '#111111',
    lineHeight: 17,
  },
  primaryButtonText: {
    color: '#FFFFFF',
  }
})
const mt_styles = theme => StyleSheet.create({
  primary: {
    backgroundColor: theme.BrandPrimary,
  },
  secondary: {
    borderColor: '#E0E0E0',
  },
  button: {
    borderRadius: 6,
    width: 74,
    height: 30,
    lineHeight: 30
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 12,
    color: '#222222',
    lineHeight: 17,
  },
  primaryButtonText: {
    color: '#222222',
  }
})

function themeStyle(theme) {
  return theme.AppThemeType === 1 ? dp_styles(theme) : mt_styles(theme)
}

const OperationButton = (props: Btn & { moduleKey: number }) => {
  const { theme } = useContext(GCUIThemeContext)

  const theme_style = useMemo(() => {
    return themeStyle(theme)
  }, [theme.AppThemeType])

  const { text, moduleKey, action, type } = props
  return (
    <TouchableOpacity
      key={`OperationButton-${moduleKey}`}
      onPress={(event) => {
        action && action(props, event)
      }}
      style={[
        operationStyles.button,
        theme_style.button,
        type === 'primary' ? {} : operationStyles.secondary,
        type === 'primary' ? theme_style.primary : theme_style.secondary,
      ]}
    >
      <View>
        <Text style={[
          operationStyles.buttonText,
          theme_style.buttonText,
          type === 'primary' ? theme_style.primaryButtonText : {}
        ]}>{ text || ''}</Text>
      </View>
    </TouchableOpacity>
  )
}

export const OrderCardOperations = observer((props: {
  list: Operation[],
  triggerOperation: (...args: any[]) => any,
}) => {
  const { list } = props
  if (!list || !list.length) return null
  return (
    <View>
      {/* 分割线 */}
      <View style={styles.moduleSplitterStyle} />
      <View style={[operationStyles.wrapperStyle]}>
        {
          list.map((button, index) => {
            console.log('button: ', button);
            // 默认第一个按钮会是primary，除非特别注明
            let buttonType = 'secondary' as btnType
            if (index === 0) buttonType = 'primary'
            if (button.style === 1) {
              buttonType = 'primary'
            } else {
              buttonType = 'secondary'
            }
            return (
              <OperationButton
                {...button}
                key={index}
                moduleKey={index}
                action={props.triggerOperation}
                type={buttonType}
              />
            )
          })
        }
      </View>
    </View>
  )
})
