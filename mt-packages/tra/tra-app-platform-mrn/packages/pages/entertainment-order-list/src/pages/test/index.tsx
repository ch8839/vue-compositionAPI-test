import React, { useCallback, useMemo } from 'react'
import { MCPage, MCModule } from '@nibfe/doraemon-practice'
import { getCommonNavigation } from '@nibfe/dm-navigation'
import { NavigationScreenComponent } from '@mrn/react-navigation'
import { Toast } from '@ss/mtd-react-native'
import OrderListPage from '@nibfe/tra-app-platform-mrn-modules/pages/base/order-list/index'
import { OrderCard } from '../components/order-card/index'
import { MCListModule, MCListModuleProps } from '@nibfe/doraemon-practice'
import { openUrl } from '@mrn/mrn-utils'

import EmptyViewComponent from '../components/order-list/empty'
import Footer from '../components/order-list/footer'

import {
  observer,
  Bootstrap,
  useCoreContext,
  registerBasicInteraction,
} from '@nibfe/tra-app-platform-core'

// 组件
import { View, Text, TouchableOpacity } from '@mrn/react-native'

// modules
class TestPageClass {
  reloadFlag = Math.random()

  envInfo = {} as any
  pageLoading = false
  pageReady = false

  list = [
    {
      name: '123'
    },
    {
      name: '456'
    },
    {
      name: '789'
    },
  ]

  orderList = [
    {
      canDelete: 1,
      deleteUrl: "https://mapi.51ping.com/dztrade/general/orderextra/hide",
      operations: [],
      orderInfo: {
        orderDesc: ["预订时间：2023-02-20 03:00", "交易密室仅拼场3"],
        orderDetailUrl: "imeituan://www.meituan.com/web?url=https%3A%2F%2Fg.51ping.com%2Ffuse%2FSJZYJTCpf%3Forderid%3D4908945638994120170%26sourcetype%3D1",
        orderId: "4908945638994120170",
        orderPic: "https://img.meituan.net/ugcpic/88a82d5e6022f86fad6e83564610198e121303.png",
        orderStatus: "已取消"
      },
      partnerId: 68,
      receiptList: [],
      shopInfo: {shopName: "交易自动化专用-密室预订门店"},
      userId: 37381817,
      index: 1
    },
    {
      canDelete: 1,
      deleteUrl: "https://mapi.51ping.com/dztrade/general/orderextra/hide",
      operations: [],
      orderInfo: {
        orderDesc: ["预订时间：2023-02-20 03:00", "交易密室仅拼场3"],
        orderDetailUrl: "imeituan://www.meituan.com/web?url=https%3A%2F%2Fg.51ping.com%2Ffuse%2FSJZYJTCpf%3Forderid%3D4908945638994120170%26sourcetype%3D1",
        orderId: "4908945638994120170",
        orderPic: "https://img.meituan.net/ugcpic/88a82d5e6022f86fad6e83564610198e121303.png",
        orderStatus: "已取消"
      },
      partnerId: 68,
      receiptList: [],
      shopInfo: {shopName: "交易自动化专用-密室预订门店"},
      userId: 37381817,
      index: 2
    },
  ]

  beforeInit() {}
  pageInit() {}
  afterInit() {}
  pageDestory() {}

  addListItem() {
    this.list.push({
      name: 'test'
    })
  }

  addOrderListItem() {
    this.orderList = JSON.parse(JSON.stringify(this.orderList.concat({
      canDelete: 1,
      deleteUrl: "https://mapi.51ping.com/dztrade/general/orderextra/hide",
      operations: [],
      orderInfo: {
        orderDesc: ["预订时间：2023-02-20 03:00", "交易密室仅拼场3"],
        orderDetailUrl: "imeituan://www.meituan.com/web?url=https%3A%2F%2Fg.51ping.com%2Ffuse%2FSJZYJTCpf%3Forderid%3D4908945638994120170%26sourcetype%3D1",
        orderId: "4908945638994120170",
        orderPic: "https://img.meituan.net/ugcpic/88a82d5e6022f86fad6e83564610198e121303.png",
        orderStatus: "已取消"
      },
      partnerId: 68,
      receiptList: [],
      shopInfo: {shopName: "交易自动化专用-密室预订门店"},
      userId: 37381817,
      index: Math.random()
    })))
  }
}

// 页面
const Page = observer((props: any) => {
  const $core = useCoreContext() as TestPageClass

  const keyExtractor = useCallback((item) => {
    return item.index
  }, [])

  const renderItem = useCallback((item, index) => {
    return  (
      <OrderCard
        {...item}
      />
    )
  }, [])

  // 列表组件
  const List = observer(() => {
    return (
      <MCListModule
        data={orderListData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        footerView={<Footer type={'all'} />}
        footerViewStyle={{
          backgroundColor: 'transparent'
        }}
        emptyView={<EmptyViewComponent />}
        // 隐藏分割线
        separatorLineStyle={{
          display: 'hidden-all'
        }}
        isEmpty={false}
        isLoadingMoreCellHideBackground={true}
        backgroundColor={'transparent'}
      />
    )
  })

  const orderListData = useMemo(() => {
    if (!($core.orderList && $core.orderList.length)) return []
    return $core.orderList
  }, [$core.orderList])
  
  console.log('$core: ', $core);
  console.log('props: ', props)
  return (
    <MCPage
      modules={[
        [
          {
            moduleKey: 'OrderTest',
            module: (
              <MCModule>
                <View>
                  <Text>测试一下get方法</Text>
                  <Text>测试一下装饰器</Text>
                  <Text>测试一下装饰器</Text>
                  <Text>测试一下装饰器</Text>
                  <Text>测试一下装饰器</Text>
                  <Text>测试一下装饰器</Text>
                  {/* <Text onPress={$core.addListItem}>增加list</Text>
                  <Text>测试一下订单列表</Text>
                  <Text>测试一下订单列表</Text>
                  <Text>测试一下订单列表</Text>
                  <Text>测试一下订单列表</Text>
                  <Text onPress={$core.addOrderListItem}>增加OrderList</Text>
                  <View>
                      {$core.list.map(line => {
                        return (
                          <Text>{line.name}</Text>
                        )
                      })}
                  </View> */}
                  <TouchableOpacity onPress={()=>{
                    openUrl("imeituan://www.meituan.com/mrn?mrn_biz=gc&mrn_entry=booking-pedicure&mrn_component=booking_pedicure_order_create&arriveTime=1673717400000&cooperationbiztype=100088&product=dpapp&crossday=false&timeslot=2023-01-15%2001%3A30%3A00&promosource=0&productitemid=407588421&pushEnabled=0&shopid=431999691&shopuuid=k9LZx81eWZ7I4ZWH&disablepromodesk=false&usediscountprice=false&_mtcq=0",{}, {
                      isForResult:false,
                      limitToPackage:true,
                      overridePendingTransition:true,
                      enterAnim:"mrn_anim_enter_from_bottom",
                      exitAnim:"mrn_anim_exit_from_top",
                      isTransparent:true,
                      hideLoading:true, //仅在 isTransparent 为 true 时生效，去除透明容器的 loading 动画
                    })
                   }}>
                    <Text>测试透明容器</Text>
                  </TouchableOpacity>
                </View>
              </MCModule>
            )
          }
        ],
        [
          {
            moduleKey: 'OrderList',
            module: (
              <List />
            )
          }
        ]
      ]} />
  )
})

const WrappedPage: NavigationScreenComponent = Bootstrap(Page, TestPageClass, { deps: ['reloadFlag'] })


export default WrappedPage
