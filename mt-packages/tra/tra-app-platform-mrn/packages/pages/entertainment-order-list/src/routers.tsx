import React from 'react'
import { createStackNavigator } from '@mrn/react-navigation'
import OrderList from './pages/order-list/index'

interface Props {
  initialRouteName: string
  screenProps?: { [key: string]: any }
}

export const RootStack: React.FC<Props> = props => {
  const { initialRouteName, screenProps } = props
  const Navigator = createStackNavigator(
    {
      'entertainment_order_list': {
        screen: OrderList
      },
    },
    {
      initialRouteName: initialRouteName || 'entertainment_order_list',
      initialRouteParams: screenProps
    }
  )
  return <Navigator screenProps={{ ...screenProps }} />
}
