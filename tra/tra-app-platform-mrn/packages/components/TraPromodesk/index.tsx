import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, Image, TouchableOpacity } from '@mrn/react-native'
import { MCModule } from '@nibfe/doraemon-practice'

import { isDp } from '../utils'
import commonStyles from '../common/styles/default'
import { List } from '../List'
import CouponSlideModal from './components/CouponSlideModal'
import { observer } from '@nibfe/tra-app-platform-core'
import { PromoType, ActionType } from '@nibfe/tra-app-platform-mrn-modules/services/requests/preorder'
import { Checkbox } from '../Checkbox/index'


const Item = List.ListItem

const styles = StyleSheet.create({
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    fontSize: 16
  },
  value: {
    marginLeft: 8,
    fontWeight: '700',
    fontSize: 16,
    color: isDp ? commonStyles.dpPrimary : commonStyles.mtOldPrimary
  },
  priceTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#111111',
    lineHeight: 21,
    // textAlignVertical: 'top'
  },
  priceSubTitle: {
    color: '#999999',
    fontSize: 12,
    lineHeight: 16.5,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111111',
    lineHeight: 21,
    textAlign: 'right',
    textAlignVertical: 'top',
  },
  priceValueExplanation: {
    color: '#999999',
    fontSize: 12,
    lineHeight: 16.5,
  },
  couponTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#777777',
    // lineHeight: 21
  },
  couponValue: {
    fontSize: 15,
    fontWeight: '400',
    color: '#FF6633',
    lineHeight: 21
  },
  memoText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#777777',
    lineHeight: 21,
    marginLeft: 10,
  },
  gray: {
    color: '#777777'
  }
})

const TraPromodesk = observer(props => {
  const { isTimeSelected, promoDeskInfo, amountDetail, quantity, onPromoDeskChange, reload, isGray, selectedCard, couponListModuleViewLx, couponListModuleClickLx, premiumCardPopupModuleViewLx, premiumCardPopupModuleClickLx, promoDeskModuleClickLx } = props
  // 是否展示优惠台的弹窗
  const [showSlideModal, setShowSlideModal] = useState(false)
  // 当前弹出的弹窗里选择的优惠唯一id
  const [selectedPromoId, setSelectedPromoId] = useState("")
  // 当前弹出的弹窗里选择的优惠类型
  const [slideModalDataType, setSlideModalDataType] = useState("")
  // 点击优惠项
  const onClickItem = item => {
    console.log("进入onClickItem promoType: ", item.promoType)
    if (item.actionType === ActionType.CHECK_BOX) {
      promoDeskModuleClickLx({titleText: item.titleText, selectedPromoId, promoType: item.promoType})
      onPromoDeskChange({ ...item, selectedPromoId: !item.selectedState ? item.promoId : "", operatorPromoType: item.promoType })
    } else if(item.actionType === ActionType.REDIRECT) {
      // 走进了二级券列表优惠的情况
      setShowSlideModal(true)
      // 二级券列表曝光打点
      couponListModuleViewLx && couponListModuleViewLx()
      setSlideModalDataType(item.promoType)
      if (item.availableCouponList && Array.isArray(item.availableCouponList) && item.availableCouponList.length > 0) {
        const defaultSelectedCoupon = item.availableCouponList.find((availableCoupon) => {
          return availableCoupon.selectedState ? true : false
        })
        if (defaultSelectedCoupon) setSelectedPromoId(defaultSelectedCoupon.promoId)
        else setSelectedPromoId("")
        promoDeskModuleClickLx({titleText: item.titleText, selectedPromoId, promoType: item.promoType})
      }
    } else return
  }
  const closeSlideModal = () => {
    setShowSlideModal(false)
    premiumCardPopupModuleClickLx && premiumCardPopupModuleClickLx()
  }
  const clickIcon = (promoType) => {
    console.log("进入clickIcon promoType: ", promoType)
    if (promoType === PromoType.CARD_PROMO_AFTER_BUY_CARD || PromoType.CARD_PROMO_BEFORE_BUY_CARD) {
      setShowSlideModal(true)
      setSlideModalDataType(promoType)
    }
  }
  // 未选择时间的情况(未请求preorder的情况)
  if (!isTimeSelected) return (
    <MCModule
      paddingHorizontal={0}
      gapTop={0}
      separatorLineStyle={{ display: 'hidden-all' }}
    >
      <Item value={<Text style={{ fontSize: 15, lineHeight: 21, color: '#999999' }}>选择到店时间后计算最大优惠</Text>} hasSeperatorLine={false}><Text style={{ fontSize: 15}}>优惠</Text></Item>
    </MCModule>
  )
  // 已选择时间，但preorder优惠请求失败，需要给用户提供重新加载的模块
  if (promoDeskInfo && promoDeskInfo.failRetry) return (
    <MCModule
      paddingHorizontal={0}
      gapTop={0}
      separatorLineStyle={{ display: 'hidden-all' }}
    >
      <TouchableWithoutFeedback onPress={reload}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 20
          }}
        >
          <Image
            source={{
              uri: 'https://p0.meituan.net/travelcube/6ea8b067643c54cf3a6c15c96a02fe50541.png'
            }}
            style={{
              width: 20,
              height: 20
            }}
          />
          <Text style={{ fontSize: 12, color: '#999999', marginLeft: 5 }}>
            {'数据获取失败，点击重新加载'}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </MCModule>
  )
  // promoDeskInfo为空的情况下，返回null(渲染的初始状态)
  // 或已选择时间promoDeskInfo.promoInfoList为null的情况下(后端进入降级场景，没有优惠)，返回null
  if (!promoDeskInfo || !promoDeskInfo?.promoInfoList) return null
  // 展示优惠台的情况
  return (
    <MCModule
      paddingHorizontal={0}
      gapTop={0}
      separatorLineStyle={{ display: 'hidden-all' }}
    >
      <Item hasSeperatorLine={false} value={
        amountDetail?.subTotalAmount ? <Text style={styles.priceValue}>
          {`¥${amountDetail.subTotalAmount}`}
        </Text> : null
      } align={'top'} multipleLine={true}>
        {amountDetail?.price && quantity ? <View>
          <Text style={styles.priceTitle}>
            小计
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.priceSubTitle}>
              {`${isGray ? '门市价' : '美团价'} ¥${amountDetail.price}`}
            </Text>
            <Text style={[styles.priceSubTitle, {color: '#bbbbbb'}]}>｜</Text>
            <Text style={styles.priceSubTitle}>{`${quantity}人`}</Text>
          </View>
        </View> : null}
      </Item>
      {promoDeskInfo?.promoInfoList.map((item, index) => {
        if (!item.display) return null
        return (
          <Item styles={{
            line: {
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 0,
              paddingBottom: 15,
              borderBottomWidth: 0.5,
              borderBottomColor: '#EEEEF0'
            }
          }} hasSeperatorLine={index === promoDeskInfo.length - 1 ? true : false} arrow={item.actionType === ActionType.REDIRECT ? 'right' : ''} onClick={() => { return onClickItem(item) }} value={
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.couponValue, item.labelText === '暂无可用' && styles.gray]}>
                {item.labelText}
              </Text>
              {item.memoText ? <Text style={styles.memoText}>
                {item.memoText}
              </Text> : null}
              {item.actionType === ActionType.CHECK_BOX ?
                <View style={{ marginLeft: 5, justifyContent: 'center' }}>
                  <Checkbox size={24}  deleteTouchableOuterLayer={true} disabled={!item.operatorStatus} checked={item.selectedState ? true : false} 
                  // onChange={(status) => {
                  //   promoDeskModuleClickLx({titleText: item.titleText, selectedPromoId, promoType: item.promoType})
                  //   onPromoDeskChange({ ...item, selectedPromoId: status ? item.promoId : "", operatorPromoType: item.promoType })
                  // }} 
                  />
                </View> : null}
            </View>
          }
          title={
            <TouchableOpacity onPress={() => { clickIcon(item.promoType) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {item?.iconUrl ? <Image style={{ width: 16, height: 16, borderRadius: 2, marginRight: 5 }} source={{ uri: item?.iconUrl }} /> : null}
                <Text style={styles.couponTitle}>
                  {item.titleText}
                </Text>
                <Image style={{ height: 14, width: 14, marginLeft: 5 }} source={{ uri: JSON.parse(item?.promoRuleDesc)?.iconUrl }}></Image>
              </View>
            </TouchableOpacity>
          }
          >
          </Item>
          )
      })}
      <View style={{paddingHorizontal: 15}}>
        <View style={{height: 0.5, backgroundColor: '#EEEEF0'}}/>
      </View>
      <Item
        hasSeperatorLine={false}
        value={
          amountDetail?.payAmount ? <View>
            <Text style={styles.priceValue}>{`¥${amountDetail.payAmount}`}</Text>
            {selectedCard && amountDetail.cardPrice ? <Text style={styles.priceValueExplanation}>{`含会员卡开卡费¥${amountDetail.cardPrice}`}</Text> : null}
          </View> : null
        } align={'top'} multipleLine={true}>
        <Text style={styles.priceTitle}>到手价</Text>
      </Item>
      <CouponSlideModal
        type={slideModalDataType}
        promoInfoList={promoDeskInfo?.promoInfoList}
        amountDetail={amountDetail}
        showSlideModal={showSlideModal}
        setShowSlideModal={setShowSlideModal}
        selectedPromoId={selectedPromoId}
        setSelectedPromoId={setSelectedPromoId}
        closeSlideModal={closeSlideModal}
        onPromoDeskChange={onPromoDeskChange}
        couponListModuleClickLx={couponListModuleClickLx}
        premiumCardPopupModuleViewLx={premiumCardPopupModuleViewLx}
      />
    </MCModule>
  )
})

export default TraPromodesk