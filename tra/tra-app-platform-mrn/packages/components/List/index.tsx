import React from 'react'
import { View } from 'react-native'
import { WithThemeStyles, useTheme } from '../common/styles/theme'
import { listStyles, ListStyles } from './styles'

import { ListItem } from './ListItem'

export interface ListProps extends WithThemeStyles<ListStyles> {
  children?: React.ReactNode
}

const List = (props: ListProps) => {
  const { children } = props

  const styles = useTheme<ListStyles>('List', listStyles, props.styles)

  return (
    <View>
      <View style={styles.body}>{children ? children : null}</View>
    </View>
  )
}

List.ListItem = ListItem

export { List }
