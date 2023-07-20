import React, { useCallback, useMemo } from 'react'
import { MCListModule, MCListModuleProps } from '@nibfe/doraemon-practice'
import { useResultList } from '@nibfe/mc-list-component'
import { observer } from '@nibfe/tra-app-platform-core'

import EmptyViewComponent from './empty'
import Footer from './footer'
import { OrderCard } from '../order-card/index'

export interface OrderItemData {
  shopInfo: {
    shopName: string,
    shopId?: string | number
  }
  orderInfo: {
    orderPic: string
    orderId: string | number
    orderStatus: string,
    orderDesc: unknown[],
    orderDetailUrl: string
  }
  receiptList: string[], // 券码信息
  operations: Array<any>
  productInfo?: {
    skuName: string
    skuId?: string
  }
}

export interface RequestParams {
  filter: string | number,
}

const List = observer((props: Partial<MCListModuleProps<OrderItemData>> & {
  api: (...args: any) => Promise<any>,
  requestParams: RequestParams,
  jumpToOrder?: (...args: any) => any,
  jumpToPoi?: (...args: any) => any,
  showOrderDeleteDialog?: (...args: any) => any,
  deleteOrder?: (...args: any) => any,
  triggerOperation?: (...args: any) => any,
  resetPage?: (...args: any) => any,
  resetList?: (...args: any) => any,
  onItemExpose?: (...args: any) => any,
  showOrderDeleteConfirmDialog?: boolean
  showOrderListBottomText?: boolean
}) => {
  // 使用 useResultList 处理loading，loadingmore等视图状态相关，但不使用其数据相关逻辑
  const responseTransformer = useCallback(
    (res, lastStartIndex: number) => {
      if (res.orderList.length > 0) {
        const list = res.orderList || []
        return {
          list,
          isEnd: !list.length,
        }
      } else {
        return {
          list: [],
          isEnd: true,
        }
      }
    },
    [],
  )

  // filter 改变，重新加载数据（其实不会真的使用这里的请求参数，参数还是用modules模型里的
  const apiParams = useMemo(() => {
    return {}
  }, [props.requestParams.filter])

  const {
    items,
    loadingStatus,
    loadingMoreStatus,
    refreshStatus,
    isEmpty,
    load,
    refresh,
    loadMore,
  } = useResultList({
    api: props.api,
    // @ts-ignore
    apiParams,
    // requestTransformer,
    // @ts-ignore
    responseTransformer,
  })

  const renderItem = useCallback((item, index) => {
    return  (
      <OrderCard
        {...item}
        index={index}
        jumpToPoi={props.jumpToPoi}
        jumpToOrder={props.jumpToOrder}
        deleteOrder={props.deleteOrder}
        showOrderDeleteDialog={props.showOrderDeleteDialog}
        triggerOperation={props.triggerOperation}
      />
    )
  }, [])
  const keyExtractor = useCallback((item) => {
    return item.orderInfo?.orderId
  }, [])

  return (
    <MCListModule
      data={props.data}
      renderItem={renderItem}
      loadingStatus={loadingStatus}
      loadingMoreStatus={loadingMoreStatus}
      onRefresh={() => {
        props.resetList()
        props.resetPage()
        return refresh()
      }}
      onNeedLoadMore={loadMore}
      onRetryForLoadingFail={load}
      onRetryForLoadingMoreFail={loadMore}
      isEmpty={isEmpty}
      keyExtractor={keyExtractor}
      footerView={<Footer type={'all'} showOrderListBottomText={props.showOrderListBottomText} />}
      footerViewStyle={{
        backgroundColor: 'transparent'
      }}
      emptyView={<EmptyViewComponent />}
      // 隐藏分割线
      separatorLineStyle={{
        display: 'hidden-all'
      }}
      isLoadingMoreCellHideBackground={true}
      backgroundColor={'transparent'}
      onItemExpose={props.onItemExpose}
      paddingHorizontal={10}
      {...props}
    />
  )
})

export default List
