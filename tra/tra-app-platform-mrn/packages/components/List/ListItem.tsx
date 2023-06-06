import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  StyleSheet,
  Image
} from '@mrn/react-native'
import { WithThemeStyles, useTheme } from '../common/styles/theme'
import { listStyles, ListStyles } from './styles'
import { Icon } from '@nibfe/gc-ui'

export type ArrowType = 'top' | 'down' | 'right' | 'left' | ''

export interface ListItemProps extends WithThemeStyles<ListStyles> {
  wrap?: Boolean // 是否支持换行
  title?: React.ReactNode // listItem左侧内容
  value?: React.ReactNode // listItem右侧内容
  multipleLine?: Boolean // listItem是否多行
  align?: String //元素垂直对齐，可选 top，middle，bottom
  disabled?: boolean
  arrow?: ArrowType
  hasSeperatorLine?: boolean 
  onPress?: (event: GestureResponderEvent) => void
  onClick?: (event: GestureResponderEvent) => void
  children?: React.ReactNode
}

export const ListItem = (props: ListItemProps) => {
  const {
    wrap = false,
    title = null,
    value = null,
    multipleLine = false,
    align = 'middle',
    disabled = false,
    arrow = '',
    hasSeperatorLine = true,
    onPress,
    children
  } = props

  const styles = useTheme<ListStyles>('List', listStyles, props.styles)

  let numberOfLines = {}
  if (wrap === false) {
    numberOfLines = {
      numberOfLines: 1
    }
  }

  let titleDom = null
  if (title) {
    if (React.isValidElement(title)) {
      titleDom = <View style={[styles.column]}>{title}</View>
    } else {
      titleDom = (
        <Text style={[styles.title, styles.column]} {...numberOfLines}>
          {title}
        </Text>
      )
    }
  } else {
    if (Array.isArray(children)) {
      const tempTitleDom = []
      children.forEach((el, index) => {
        if (React.isValidElement(el)) {
          tempTitleDom.push(el)
        } else {
          tempTitleDom.push(
            <Text
              style={styles.title}
              {...numberOfLines}
              key={`${index}-list-item`}
            >
              {el}
            </Text>
          )
        }
      })
      titleDom = <View style={styles.column}>{tempTitleDom}</View>
    } else {
      if (children && React.isValidElement(children)) {
        titleDom = <View style={[styles.column]}>{children}</View>
      } else {
        titleDom = (
          <View style={styles.column}>
            <Text style={styles.title} {...numberOfLines}>
              {children}
            </Text>
          </View>
        )
      }
    }
  }

  let valueDom = null
  if (value) {
    if (React.isValidElement(value)) {
      valueDom = <View>{value}</View>
    } else {
      valueDom = (
        <Text style={styles.value} {...numberOfLines}>
          {value}
        </Text>
      )
    }
  }

  let alignStyle = {}
  if (align === 'top') {
    alignStyle = {
      alignItems: 'flex-start'
    }
  } else if (align === 'bottom') {
    alignStyle = {
      alignItems: 'flex-end'
    }
  }

  // let underlayColorStyle = !disabled && onPress ? styles.underlayColor : styles.underlayOpacityColor

  let underlayColor = {}

  if (!disabled && onPress) {
    underlayColor = {
      underlayColor: StyleSheet.flatten(styles.underlayColor).backgroundColor,
      activeOpacity: 0.5
    }
  } else {
    underlayColor = {
      activeOpacity: 1
    }
  }

  const arrowName: any = `arrow_${arrow}`
  const arrowIcon = () => {
    if(!!arrow) {
      if(arrow === 'right') {
        return <Image style={{width: 12, height: 12, marginLeft: 5}} source={{uri: 'https://p0.meituan.net/travelcube/9724e5fe13afd7ab4c498fec69ecbc641003.png'}}/>
      } else {
        return (<Icon
          name={arrowName}
          tintColor="rgba(0, 0, 0, 0.24)"
          size={16}
          style={styles.Arrow}
        />)
      }
    } else {
      <View style={styles.Arrow} />
    }
  }
  const itemView = (
    <View style={styles.item}>
      <View style={[styles.line, multipleLine && alignStyle, !hasSeperatorLine && styles.noLine]}>
        {titleDom}
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
          {valueDom}
          {arrowIcon()}
        </View>
      </View>
    </View>
  )

  const onClick = props.onClick
  return (
    <TouchableOpacity
      style={styles.wrapper}
      {...underlayColor}
      onPress={onClick ? onClick : onPress || undefined}
    >
      {itemView}
    </TouchableOpacity>
  )
}