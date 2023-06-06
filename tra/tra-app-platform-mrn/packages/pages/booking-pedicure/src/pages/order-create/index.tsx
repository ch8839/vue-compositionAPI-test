import React from 'react'
import { MCPage } from '@nibfe/doraemon-practice'
import { Toast } from '@ss/mtd-react-native'
import { View, TouchableWithoutFeedback, Platform } from '@mrn/react-native'
import PedicureBookingOrderCreate from '@nibfe/tra-app-platform-mrn-modules/pages/transactions-businesses/booking-pedicure/order-create'
import {
  observer,
  Bootstrap,
  useCoreContext,
  registerBasicInteraction,
} from '@nibfe/tra-app-platform-core'
import { getInset } from '@mrn/react-native-safe-area-view'

// 组件
import TraStepper from '@nibfe/tra-app-platform-mrn-components/TraStepper/index' // 数量选择步进器
import TraPromodesk from '@nibfe/tra-app-platform-mrn-components/TraPromodesk' // 优惠模块
import TraMoleculesMobile from '@nibfe/tra-app-platform-mrn-components/TraMoleculesMobile'
import TraField from '@nibfe/tra-app-platform-mrn-components/TraField'
import TraRules from '@nibfe/tra-app-platform-mrn-components/TraRules'
import PriceDec from '@nibfe/tra-app-platform-mrn-components/PriceDec'
import TraBottomSubmit from '@nibfe/tra-app-platform-mrn-components/TraBottomSubmit/index' // 底部按钮组件
import TraPreorderTitle from '@nibfe/tra-app-platform-mrn-components/TraPreorderTitle/index'
import TraPremiumCard from '@nibfe/tra-app-platform-mrn-components/TraPremiumCard/index'
import TraBanner from '@nibfe/tra-app-platform-mrn-components/TraBanner/index'
import TraPayMethod from '@nibfe/tra-app-platform-mrn-components/TraPayMethod/index'
import TraNameGenderField from '@nibfe/tra-app-platform-mrn-components/TraNameGenderField/index'

import TraMorphGap from '@nibfe/tra-app-platform-mrn-components/TraMorphGap'

// 足疗定制组件
import TimeSelect from '../components/time-select'
registerBasicInteraction('toast', Toast.open)
const sysname = Platform.OS
// 页面
const Page = observer((props: any) => {
  const $core = useCoreContext() as PedicureBookingOrderCreate
  global.query = props.query
  return (
    <View style={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }}>
      <TouchableWithoutFeedback onPress={()=>{$core.closeContainer()}}>
        <View style={{ 
          height: '15%',
          backgroundColor: 'transparent'}}></View>
      </TouchableWithoutFeedback>
      <View
        style={{
          height: '85%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
          paddingBottom: sysname ===  'ios' ? getInset('bottom') : 0
        }}
      >
          <MCPage
                loadingStatus={$core.pageReady ? 'done' : 'loading'}
                pageTopGap={0}
                scrollEnabled={true}
                contentBackgroundColor="transparent"
                paddingHorizontal={0}
                style={
                  {backgroundColor: "#f6f6f6"}
                }
                mptInfo={{
                  category: 'gc',
                  cid: $core.lxInfo.cid,
                  // 新浮层提单页，进入页面时获取不到spuId和skuId
                  labs: {
                    cat_id: 52, // 足疗的品类id
                    poi_id: props?.query?.shopid,
                    custom: {product_id: props?.query?.serviceid,}
                  }
                }}
                modules={[
                  {
                    moduleKey: 'TraPreorderTitle',
                    module: (
                      <TraPreorderTitle
                        productName={$core?.usedTimeSelectData?.serviceTitle || ''}
                        closeContainer={$core.closeContainer}
                        exitModuleClick={$core.exitModuleClick}
                      />
                    )
                  },
                  {
                    moduleKey: 'TimeSelect',
                    module: (
                      <TimeSelect 
                        timeSelectData={$core.usedTimeSelectData}
                        onChangeDateTab={$core.onChangeDateTab}
                        onClickTime={$core.onClickTime}
                      />
                    )
                  },
                  {
                    moduleKey: 'TraStepper',
                    module: (
                      <TraStepper
                        quantityConfig={$core.quantityConfig}
                        submitFormChange={$core.submitFormChange}
                        toMaxToastText={'已达到本时段最大可订人数'}
                        disabledText={'请先选择时间'}
                        disabled={!$core.isTimeSelected}
                        readOnly={false}
                      />
                    )
                  },
                  {
                    moduleKey: 'TraMorphGap1',
                    module: <TraMorphGap />
                  },
                  {
                    moduleKey: 'TraPremiumCard',
                    module: (<TraPremiumCard
                      isTimeSelected={$core.isTimeSelected} 
                      cardInfo={$core.cardInfo}
                      selectedCard={$core.selectedCard}
                      showPremiumPrice={$core.showPremiumPrice}
                      onChange={$core.onCardSelectStatusChange} 
                    />)
                  },
                  {
                    moduleKey: 'TraPromodesk',
                    module: (<TraPromodesk 
                      isTimeSelected={$core.isTimeSelected} 
                      amountDetail={$core.amountDetail}
                      promoDeskInfo={$core.promoDeskInfo} 
                      quantity={$core.quantity} 
                      onPromoDeskChange={$core.onPromoDeskChange}
                      reload={$core.requestPreorder}
                      isGray={$core.isGray}
                      selectedCard={$core.selectedCard}
                      couponListModuleViewLx={$core.couponListModuleViewLx}
                      couponListModuleClickLx={$core.couponListModuleClickLx}
                      premiumCardPopupModuleViewLx={$core.premiumCardPopupModuleViewLx}
                      premiumCardPopupModuleClickLx={$core.premiumCardPopupModuleClickLx}
                      promoDeskModuleClickLx={$core.promoDeskModuleClickLx}
                    />)
                  },
                  {
                    moduleKey: 'TraMorphGap2',
                    module: $core.isTimeSelected && <TraMorphGap />
                  },
                  {
                    moduleKey: 'TraPayMethod',
                    module: <TraPayMethod 
                    isTimeSelected={$core.isTimeSelected}
                    fastPay={$core.fastPay}
                    changePayType={$core.fastPay?.changePayType} />
                  },
                  {
                    moduleKey: 'TraPhoneInfo',
                    module: (
                      $core.isTimeSelected && <TraMoleculesMobile
                        value={$core.userInfo.mobile}
                        virtualNumber={$core.virtualNumberInfo.show}
                        useVirtualNumber={$core.virtualNumberInfo.use}
                        masked={true}
                        onBlur={value => {
                          $core.userInfo.mobile = value
                        }}
                        toggleProtect={value => $core.toggleProtect(value)}
                        goVirtualNumberDetailModuleClick={() => $core.goVirtualNumberDetailModuleClick()}
                        phoneInputBoxModuleClick={$core.phoneInputBoxModuleClick}
                      />
                    )
                  },
                  {
                    moduleKey: 'TraNameGenderField',
                    module: (
                      $core.isTimeSelected && <TraNameGenderField
                        title={'姓名'}
                        placeholder={'请输入您的姓名'}
                        onChange={(key, item) => $core.submitFormChange(key, item)}
                      />
                    )
                  }
                  ,
                  {
                    moduleKey: 'TraField',
                    module: (
                      $core.isTimeSelected && <TraField
                        {...$core.remarkConfig}
                        onChange={(key, item) => $core.submitFormChange(key, item)}
                      />
                    )
                  },
                  {
                    moduleKey: 'TraMorphGap3',
                    module: $core.isTimeSelected && <TraMorphGap />
                  },
                  {
                    moduleKey: 'TraBookingRule',
                    module: $core.isTimeSelected && <TraRules rules={$core.bookingRuleInfo} />
                  },
                  {
                    moduleKey: 'TraRefundRule',
                    module: $core.isTimeSelected && <TraRules rules={$core.refundRuleInfo} />
                  },
                  {
                    moduleKey: 'PriceDec',
                    module: $core.isTimeSelected && <PriceDec />
                  },
              {
                moduleKey: 'TraBottomSubmit',
                module: (
                  <TraBottomSubmit
                    envInfo={$core.envInfo}
                    amountDetail={$core.amountDetail}
                    handleOrderSubmit={$core.handleOrderSubmit}
                    bottomPriceData={$core.bottomPriceData}
                    isTimeSelected={$core.isTimeSelected}
                    payType={$core.fastPay?.payType}
                    showPremiumPrice={$core.showPremiumPrice}
                    upperBanner={<TraBanner 
                      bottomBannerTextParts={$core.bottomBannerTextParts}  
                      isTimeSelected={$core.isTimeSelected}
                      defaultBottomBannerText={$core?.usedTimeSelectData?.defaultBottomBannerText}
                    />}
                  />
                )
              },
          ]}
        />  
      </View>
    </View>
  )
})
const WrappedPage = Bootstrap(Page, PedicureBookingOrderCreate, { deps: ['reloadFlag'], owlConfig: {project: 'rn_gc_bookingpedicure', component: 'booking_pedicure_order_create'} })
// 导航栏设置
// https://km.sankuai.com/page/403361867
// WrappedPage.navigationOptions = () => {
//   return getCommonNavigation({
//     title: '提交订单',
//     gesturesEnabled: false,
//     headerStyle: {
//       backgroundColor: '#ffffff',
//       height: 48,
//       borderBottomWidth: 0
//     },
//     headerTintColor: '#000000',
//     headerTitleStyle: {
//       fontWeight: 'normal',
//       color: '#111111',
//       fontSize: 18,
//       flex: 1,
//       textAlign: 'center'
//     }
//   })
// }
export default WrappedPage
