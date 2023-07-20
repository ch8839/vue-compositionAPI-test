import { AppRegistry } from '@mrn/react-native'

// 足疗预订下单页
import PedicureBookingOrderCreate from './src/App'
// import PedicureBookingOrderCreate from './src/pages/order-create/pedicure/index'

// 测试页面
import TestPage from './test'

// 这里注册的可以是全集团不冲突的任意名字
AppRegistry.registerComponent(
  'booking_pedicure_order_create',
  () => PedicureBookingOrderCreate
)

AppRegistry.registerComponent(
  'test_page',
  () => TestPage
)
