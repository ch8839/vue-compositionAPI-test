import React, { useContext, useMemo } from 'react'
import { GCUIThemeContext } from '@nibfe/theme-provider-lighter'
import { observer } from '@nibfe/tra-app-platform-core'
import { View, Text, TouchableWithoutFeedback } from '@mrn/react-native'
import { DMImage, Icon } from '@nibfe/gc-ui'
import { StyleSheet, Platform } from '@mrn/react-native'
import { GCMRNTextView, JsonContentModel } from '@mrn/mrn-module-component'
import { OrderCardQRCode } from './qrcode'
import { OrderCardOperations, Operation } from './operations'

const isIos = Platform.OS === 'ios'

import { styles } from './styles'

const ShopIcon = require('../../../assets/shop_icon.png')
const ORDER_LIST_ORDER_PIC_SIZE = '/220.186/' // 头图处理

function handleOrderPicSize(oldUrl = ''): string {
  let url = oldUrl
  if (!url) return ''
  return url.replace('/w.h/', ORDER_LIST_ORDER_PIC_SIZE)
}

export interface ShopInfo {
  shopName?: string
  shopId?: string | number
  canJumpHeader?: boolean
}

export interface OrderInfo {
  orderId: string | number
  orderStatus: string,
  receiptId: string // todo
  orderPic: string
  orderDesc: (JsonContentModel & {
    strong?: boolean,
    dark?: boolean,
    split?: boolean,
  })[][]
}

const defaultContentModel = {
  textsize: 12,
  textcolor: '#7f000000',
}

export const CardBasicInfo = observer((props: {
  index: number
  shopInfo: ShopInfo,
  orderInfo: OrderInfo,
  operations: Operation[],
  receiptList?: string[],
  jumpToPoi: (...args: any[]) => any,
  jumpToOrder: (...args: any[]) => any,
  triggerOperation: (...args: any[]) => any,
  showOrderDeleteDialog: (...args: any[]) => any,
}) => {
  const { theme } = useContext(GCUIThemeContext)
  const { jumpToPoi, jumpToOrder, showOrderDeleteDialog, shopInfo } = props

  const themeStyle = useMemo(() => {
    return StyleSheet.create({
      primaryText: {
        color: theme.AppThemeType === 1 ? theme.BrandPrimary : 'rgba(0,0,0,0.50)',
      },
      title: {
        fontWeight: theme.AppThemeType === 1 ? '400' : '600',
        fontSize: theme.AppThemeType === 1 ? 13 : 15,
        color: theme.AppThemeType === 1 ? '#111' : 'rgba(0,0,0,0.90)',
        lineHeight: theme.AppThemeType === 1 ? 18.5 : 21,
      },
      iconStyle: {
        width: theme.AppThemeType === 1 ? 16 : 18,
        height: theme.AppThemeType === 1 ? 16 : 18
      }
    })
  }, [theme.AppThemeType])

  // 门店信息
  const ShopInfo = props.shopInfo && props.shopInfo.shopName ? (
      <TouchableWithoutFeedback onPress={() => {
        console.log('👋 click', jumpToPoi)
        jumpToPoi && jumpToPoi(props, props.index)
      }}>
        <View style={[styles.centerWrapperStyle, { justifyContent: 'flex-start'}]}>
          <DMImage
            source={ShopIcon}
            style={[themeStyle.iconStyle, styles.smallMarginRight]}
          />
          <Text style={[themeStyle.title, styles.smallMarginRight, {maxWidth: 240}]} ellipsizeMode='tail' numberOfLines={1}>{ props.shopInfo.shopName }</Text>
          {
            props.shopInfo.canJumpHeader ? <Icon
              name={'arrow_right'}
              size={10}
              tintColor={'rgba(0,0,0,0.90)'}
            /> : null
          }

        </View>
      </TouchableWithoutFeedback>
    ) : null
  // 订单状态
  const OrderStatus = props.orderInfo && props.orderInfo.orderId ?
    <Text style={[styles.textStyle, themeStyle.primaryText]}>{ props.orderInfo.orderStatus }</Text> : null
  // 订单信息
  const OrderInfo = props.orderInfo ? (
    <View>
      <View style={[styles.centerWrapperStyle, { alignItems: 'flex-start'}]}>
        {/* 订单头图 */}
        <View style={[styles.imgWrapperStyle, styles.marginRight]}>
          <DMImage
            source={{
              uri: handleOrderPicSize(props.orderInfo.orderPic),
            }}
            style={[{ width: '100%', height: '100%' }]}
            resizeMode={'cover'}
          />
        </View>
        {/* 订单信息 */}
        <View style={{maxWidth: '82%', overflow: 'hidden'}}>
          {
            (props.orderInfo.orderDesc || []).map((content, index) => {
              if (typeof content === 'string') {
                const formatContent = [{...defaultContentModel, text: content}]
                return (
                  <GCMRNTextView style={styles.smallMarginBottom} key={index} textModelList={formatContent || []} paragraphStyle={{numberOfLines: 1}} />
                )
              } else {
                const formatContent = content && content.map((customContentModel) => {
                  let contentModel = {...defaultContentModel, ...customContentModel}
                  if (contentModel.strong) contentModel.textstyle = 'Bold'
                  if (contentModel.dark) contentModel.textcolor = '#e5000000'
                  if (contentModel.split) {
                    contentModel = { text: ' ｜ ', textcolor: '#1e000000', kerning: 0,  textsize: 11 }
                  }
                  delete contentModel.strong
                  delete contentModel.dark
                  delete contentModel.split
                  return contentModel
                }) || [] as JsonContentModel[]
                return (
                  <GCMRNTextView style={styles.smallMarginBottom} key={index} textModelList={formatContent || []} paragraphStyle={{numberOfLines: 1}} />
                )
              }
            })
          }
        </View>
      </View>
    </View>
  ) : null

  return (
    <View style={{paddingHorizontal: 12, paddingVertical: 12}}>
      <View style={[styles.centerWrapperStyle, { justifyContent: 'space-between'}, styles.moduleWrapperStyle]}>
        { ShopInfo }
        { OrderStatus }
      </View>
      <TouchableWithoutFeedback onPress={() => {
        jumpToOrder && jumpToOrder(props, props.index)
      }}
      onLongPress={() => {
        if (isIos) return; // 只有安卓下长按触发删除
        showOrderDeleteDialog(props, props.index)
      }}>
        <View>
          { OrderInfo }
          {/* 二维码模块 */}
          <OrderCardQRCode value={props.receiptList && props.receiptList.length && props.receiptList[0]} />
        </View>
      </TouchableWithoutFeedback>
      {/* 操作模块 */}
      <OrderCardOperations list={props.operations} triggerOperation={(operationInfo: Operation) => {
        props.triggerOperation && props.triggerOperation(operationInfo, props, props.index)
      }} />
    </View>
  )
})

