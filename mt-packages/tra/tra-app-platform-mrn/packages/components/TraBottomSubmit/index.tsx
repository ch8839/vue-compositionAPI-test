import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image, Platform } from '@mrn/react-native'
import { MCModule } from '@nibfe/doraemon-practice'
import { isDp } from '../utils'
import { observer } from '@nibfe/tra-app-platform-core'
import { GCMRNTextView } from '@mrn/mrn-module-component'
import { LinearGradient} from "@mrn/react-native-linear-gradient"
import { Toast } from '@nibfe/gc-ui'
const styles = StyleSheet.create({
  footerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 15,
  },
  priceWrapper: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center'
  },
  unselectedPriceWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  horizonalAlign: { 
    flexDirection: 'row',
  },
  sign: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f63'
  },
  price: {
    fontSize: 30,
    fontWeight: '600',
    color: '#f63',
    marginLeft: 2,
    marginRight: 6,
  },
  originalPriceText: {
    color: '#777777',
    fontSize: 13,
  },
  unSelectedOriginalPriceBox: {
    flexDirection: 'row',
    height: 15,
  },
  unSelectedOriginalPriceText: {
    color: '#777777',
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  lineThrough: {
    textDecorationLine: 'line-through',
    marginLeft: 2,
  },
  minPrice: {
    color: '#FF6633',
    fontWeight: '600',
    fontSize: 12,
  },
  mtReserveBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: 135,
    borderRadius: 10,
    backgroundColor: '#FF6200'
  },
  mtReserveBtnText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500'
  },
  dpReserveBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6633',
    height: 40,
    width: 120,
    borderRadius: 50
  },
  dpReserveBtnText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 20
  },
  banner: {
    backgroundColor: 'rgba(0,0,0,0.60)',
    // position: 'absolute'
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18.5,
  }
})

const TraBottomSubmit = observer((props) => {
  const { handleOrderSubmit, upperBanner, isTimeSelected, showPremiumPrice, bottomPriceData, amountDetail, payType } = props
  const isMt = !isDp
  const payText = payType === 2 ? '立即支付' : '极速支付'
  const bottomTagBackground = bottomPriceData?.dzTagVO?.background
  const bottomTagBorderColor = bottomPriceData?.dzTagVO?.borderColor
  const bottomTagBorderRadius = bottomPriceData?.dzTagVO?.borderRadius
  const bottomTagHasBorder = bottomPriceData?.dzTagVO?.hasBorder
  const bottomTagPrePicUrl = bottomPriceData?.dzTagVO?.prePic?.picUrl
  const bottomTagAfterPicUrl = bottomPriceData?.dzTagVO?.afterPic?.picUrl
  const bottomTagPrePicHeight = bottomPriceData?.dzTagVO?.prePic?.picHeight || 16
  const bottomTagPrePicWidth = bottomTagPrePicHeight * (bottomPriceData?.dzTagVO?.prePic?.aspectRadio || 1)
  const bottomTagAfterPicHeight = bottomPriceData?.dzTagVO?.afterPic?.picHeight || 16
  const bottomTagAfterPicWidth = bottomTagAfterPicHeight * (bottomPriceData?.dzTagVO?.afterPic?.aspectRadio || 1)
  const bottomTagNoGapBetweenPicText = bottomPriceData?.dzTagVO?.noGapBetweenPicText
  return (
    <MCModule hoverType="alwaysHoverBottom">
      {upperBanner}
      <View style={styles.footerWrapper}>
        {isTimeSelected ? 
        // 此时仅展示现价和划线价
        (<View style={styles.priceWrapper}>
          {/* Text组件内包Text组件可以解决底对齐的需求 */}
          {/* 现价 */}
          <Text>
            <Text style={styles.sign}>¥</Text>
            <View style={{width: 2}} />
            <Text style={styles.price}>{amountDetail?.payAmount}</Text>
            <View style={{width: 5}} />
            {amountDetail?.payAmount !== amountDetail?.subTotalAmount ? <Text style={[styles.originalPriceText]}>¥</Text> : null}
            {amountDetail?.payAmount !== amountDetail?.subTotalAmount ? <Text style={[styles.originalPriceText, styles.lineThrough]}>{amountDetail?.totalAmount}</Text> : null}
          </Text>
        </View>) : 
        (<View style={styles.unselectedPriceWrapper}>
          <View style={[styles.horizonalAlign, {alignItems: !showPremiumPrice && bottomPriceData?.vipDisplayPriceShare ?  'center' : 'flex-end' }]}>
            <GCMRNTextView text={bottomPriceData?.displayPrice} />
            <View style={{ flexDirection: 'row', marginLeft: 5, alignItems: 'center'}}>
              {/* 会员价价格标签 */}
              { !showPremiumPrice && bottomPriceData?.vipDisplayPriceShare ? <LinearGradient colors={['#F8E6CA', '#EAD0A8']} style={{
                  padding: 2,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                <Text style={{ color: '#572B00', fontSize: 10}}>{bottomPriceData?.vipDisplayPriceShare}</Text>
              </LinearGradient> : null}
              {/* 会员价文案标签 */}
              { !showPremiumPrice && bottomPriceData?.vipDisplayPriceShare ? <View style={{ height: 16, width: 35, backgroundColor: '#F6EFE0', justifyContent: 'center', alignItems: 'center', padding: 2 }}><Text style={{ fontSize: 9, fontWeight: '500', color: '#8C5819'}}>会员价</Text></View> : null}
              {/* 划线价 */}
              {bottomPriceData?.marketPrice ? 
                <View style={[styles.unSelectedOriginalPriceBox, {marginBottom: !showPremiumPrice && bottomPriceData?.vipDisplayPriceShare ? 0 : 2}]}>
                  <Text style={[styles.unSelectedOriginalPriceText, {marginLeft: !showPremiumPrice && bottomPriceData?.vipDisplayPriceShare ? 5 : 0}]}>¥</Text>
                  <Text style={[styles.unSelectedOriginalPriceText, styles.lineThrough]}>{bottomPriceData?.marketPrice}</Text>
                </View> 
              : null}
              
            </View>
          </View>
          {/* 最底下的标签 */}
          {bottomPriceData?.dzTagVO ? <View style={{
            backgroundColor: bottomTagBackground,
            borderColor: bottomTagBorderColor,
            borderRadius: bottomTagBorderRadius,
            borderWidth: bottomTagHasBorder ? StyleSheet.hairlineWidth : 0,
            paddingLeft: bottomTagPrePicUrl ? 0 : 4,
            paddingRight: bottomTagAfterPicUrl ? 0 : 4,
            height: 16,
            alignSelf: 'flex-start',
            flexDirection: 'row',
          }}>
            {bottomTagPrePicUrl ?
            <View style={{
              // 这里需要设置overflow: 'hidden'之后圆角才能生效。见https://reactnative.dev/docs/view-style-props的borderRadius处。
              overflow: 'hidden',
              width: bottomTagPrePicWidth, 
              height: bottomTagPrePicHeight,
              right: Platform.OS === 'ios' && bottomTagHasBorder ? StyleSheet.hairlineWidth : 0,
              bottom: Platform.OS === 'ios' && bottomTagHasBorder ? StyleSheet.hairlineWidth : 0,
              borderTopLeftRadius: bottomTagBorderRadius,
              borderBottomLeftRadius: bottomTagBorderRadius,
            }}>
              <Image style={{
                width: '100%',
                height: '100%',
              }} 
                source={{ uri: bottomTagPrePicUrl}}
              />
            </View>
            : null
            }
            <Text style={{
              color: bottomPriceData?.dzTagVO?.textColor,
              fontSize: 10,
              alignSelf: 'center',
              marginLeft: bottomTagNoGapBetweenPicText ? 0 : 4,
            }}>
              {bottomPriceData?.dzTagVO?.text || ''}
            </Text>
            {bottomTagAfterPicUrl ? 
            <Image style={{ width: bottomTagAfterPicWidth, 
            height: bottomTagAfterPicHeight}} 
            source={{ uri: bottomTagAfterPicUrl}}
            /> : null}
          </View> : null}
        </View>)
        }
        <TouchableOpacity onPress={()=> {
            if(isTimeSelected) handleOrderSubmit()
            else {
              Toast.open("未选择到店时间，暂时无法支付")
            }
          }}>
          {isMt ? (
            <View style={styles.mtReserveBtn}>
              <Text style={styles.mtReserveBtnText}>{payText}</Text>
            </View>
          ) : (
            <View style={styles.dpReserveBtn}>
              <Text style={styles.dpReserveBtnText}>{payText}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </MCModule>
  )
})

export default TraBottomSubmit