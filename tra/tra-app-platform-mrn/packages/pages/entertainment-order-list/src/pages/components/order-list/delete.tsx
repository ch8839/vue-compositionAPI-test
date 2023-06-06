import React, { useCallback } from 'react'
import { View, Text } from '@mrn/react-native'
import { MCModule } from '@nibfe/doraemon-practice'
import { observer } from '@nibfe/tra-app-platform-core'
import { Dialog } from '@nibfe/mrn-materials-lego'
import { OrderItem } from '@nibfe/tra-app-platform-mrn-modules/services/page-services/entertainment_order_list'

export const OrderDeleteDialog = observer((props: {
  showOrderDeleteConfirmDialog: boolean
  currentSelectedOrder: Partial<OrderItem>
  deleteOrder: (...args: any) => Promise<any>
  closeOrderDeleteDialog: () => void
}) => {
  console.log('props:1233 ', props);
  return (
    <MCModule>
      <Dialog
        visible={props.showOrderDeleteConfirmDialog}
        title={'确认删除此订单?'}
        type={'content'}
        content={'订单删除后将无法恢复'}
        cancelTitle={'取消'}
        confirmTitle={'删除'}
        onConfirmClicked={() => {
          props.deleteOrder(props.currentSelectedOrder)
        }}
        onCancelClicked={() => {
          props.closeOrderDeleteDialog()
        }}
        onCloseClicked={() => {
          props.closeOrderDeleteDialog()
        }}
      />
    </MCModule>
  )
})
