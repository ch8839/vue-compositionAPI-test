import { AppRegistry } from '@mrn/react-native'

// 休娱订单列表
import EntertainmentOrderList from './src/App'

import TestPage from './src/pages/test/index'

// 这里注册的可以是全集团不冲突的任意名字
AppRegistry.registerComponent(
  'entertainment_order_list',
  () => EntertainmentOrderList
)

AppRegistry.registerComponent(
  'test_page',
  () => TestPage
)
