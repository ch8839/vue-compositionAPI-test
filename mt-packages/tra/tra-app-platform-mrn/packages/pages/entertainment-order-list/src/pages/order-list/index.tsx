import { NavigationScreenComponent } from '@mrn/react-navigation'
import { getCommonNavigation, getRecommendHeight, getRecommendPaddingTop } from '@nibfe/dm-navigation'
import { MCPage } from '@nibfe/doraemon-practice'
import OrderListPage from '@nibfe/tra-app-platform-mrn-modules/pages/base/order-list/index'
import { Toast } from '@ss/mtd-react-native'
import React, { useCallback } from 'react'
import KNB from '@mrn/mrn-knb'
import { Platform } from '@mrn/react-native'

import {
  Bootstrap, observer, registerBasicInteraction, useCoreContext
} from '@nibfe/tra-app-platform-core'

// 组件
import { OrderDeleteDialog } from '../components/order-list/delete'
import OrderList from '../components/order-list/index'
import { OrderListTabs } from '../components/tabs'

registerBasicInteraction('toast', Toast.open)

// 页面
const Page = observer((props: any) => {
  const $core = useCoreContext() as OrderListPage
  
  console.log('$core: ', $core);

  const fetchData = useCallback(() => {
    if (!$core.envInfo.token) return Promise.resolve({})
    return $core.fetchList()
  }, [$core.envInfo.token])

  return (
    // MCPage API：https://sky.sankuai.com/docs/nibfe/doraemon-practice/docs/API/doraemon-practice.mcpage.html
    <MCPage
      loadingStatus={$core.pageReady ? 'done' : 'loading'}
      scrollEventThrottle={16}
      pageTopGap={0}
      enablePullRefresh
      pullRefreshOffset={70}
      scrollEnabled={!!($core.orderList && $core.orderList.length)}
      modules={[
        [
          {
            moduleKey: 'OrderListTabs',
            module: (
            <OrderListTabs
              tabs={$core.orderTabs}
              selectedIndex={$core.selectedTabIndex}
              onItemSelect={$core.changeTab}
              onInit={$core.handleTabViewLx}
              lxInfo={$core.lxInfo}
            />)
          },
        ],
        [
          {
            moduleKey: 'OrderList',
            module: (
            <OrderList
              data={$core.orderList || []}
              api={fetchData}
              requestParams={{
                filter: $core.filter
              }}
              resetPage={$core.resetPage}
              resetList={$core.resetList}
              jumpToPoi={$core.jumpToPoi}
              jumpToOrder={$core.jumpToOrder}
              triggerOperation={$core.triggerOperation}
              onItemExpose={$core.handleOrderItemViewLx}
              showOrderDeleteDialog={$core.showOrderDeleteDialog}
              showOrderDeleteConfirmDialog={$core.showOrderDeleteConfirmDialog}
              showOrderListBottomText={$core.showOrderListBottomText}
            />)
          },
        ],
        [
          {
            moduleKey: 'OrderDeleteDialog',
            module: (
              <OrderDeleteDialog
                showOrderDeleteConfirmDialog={$core.showOrderDeleteConfirmDialog}
                closeOrderDeleteDialog={$core.closeOrderDeleteDialog}
                currentSelectedOrder={$core.currentSelectedOrder}
                deleteOrder={$core.deleteOrder}
              />
            )
          }
        ]
      ]}
      mptInfo={{
        category: 'gc',
        cid: $core.lxInfo.cid,
        labs: {
          cat_id: '2' // 统一传休娱：2
        }
      }}
    />
  )
})

const WrappedPage: NavigationScreenComponent = Bootstrap(Page, OrderListPage, { deps: ['reloadFlag'], owlConfig: {project: 'rn_gc_entertainmentorderlist', component: 'entertainment_order_list'} })

const handleBack = function() {
  KNB.publish({
    type: 'native',
    action: 'gc_entertainmentOrderList_back',
    success: function () {},
    fail: function () {}
  })
}

// 导航栏设置
// https://km.sankuai.com/page/403361867
WrappedPage.navigationOptions = () => {
  const options: any = {
    title: '我的订单',
    gesturesEnabled: false,
   
    headerStyle: {
      backgroundColor: '#ffffff',
      height: 48,
      borderBottomWidth: 0,
    },
    headerTintColor: '#000000',
    headerTitleStyle: {
      fontWeight: 'normal',
      color: '#111111',
      fontSize: 18,
      flex: 1,
      textAlign: 'center'
    }
  }

  if(global.query?.fromjoytab) {
    Object.assign(options, { 
      backAction: handleBack, 
      headerStyle: {
        backgroundColor: '#ffffff',
        height: Platform.OS === 'ios' ? 48 : getRecommendHeight(true),
        borderBottomWidth: 0,
        paddingTop: getRecommendPaddingTop(true)
      } 
    })
  }
  return getCommonNavigation(options)
}

export default WrappedPage
