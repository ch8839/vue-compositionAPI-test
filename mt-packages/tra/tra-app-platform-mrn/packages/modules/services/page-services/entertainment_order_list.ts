import serviceFactory from '../factory'
import { getOrderList, deleteOrder, OrderListInfo, OrderItem, Operation } from '../requests/entertainment_order_list'

const orderListService = serviceFactory({
  getOrderList,
  deleteOrder
})

export default orderListService

export type {
  OrderListInfo,
  OrderItem,
  Operation,
}
