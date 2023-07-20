import React from 'react'
import { Text, View, TouchableHighlight, TouchableOpacity, Image, Platform } from '@mrn/react-native'
import { SlideModal } from '@nibfe/gc-ui'
import Big from 'big.js'
import { LinearGradient} from "@mrn/react-native-linear-gradient"
import { getInset } from '@mrn/react-native-safe-area-view'
import { isDp } from '../../../utils'

const PremiumSlideModal = (props) => {
    const sysname = Platform.OS
    const { data, showSlideModal, closeSlideModal } = props
    const { promoAmount, discount, bookingPromo, subTotalAmount } = data
    return <SlideModal visible={showSlideModal} wrapperStyles={{
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 487,
      }} header={
        <View style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          height: 40,
          paddingTop: 15,
        }}>
          <Text style={{
            fontSize: 19,
            fontWeight: '500',
            color: '#111111',
            lineHeight: 26.5
          }}>会员专享优惠明细</Text>
          <TouchableHighlight style={{
            position: 'absolute',
            right: 20.25,
            top: 19.75,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center'
          }} activeOpacity={1} underlayColor={'#FFFFFF'} onPress={
            ()=> { closeSlideModal() }
          }>
            <Image style={{width: 9.5, height: 9.5}} source={{uri: 'https://p0.meituan.net/travelcube/426f762abc0ffd3c60f9d4012e487af8577.png'}} />
          </TouchableHighlight>
        </View>
      }
            modalProps={{
              onPressClose: () => {
                closeSlideModal()
              }
            }}>
        
          <View style={{ height: 400, flexDirection: 'column', alignContent: 'space-between'}}>
            <View style={{ flex: 1 , flexDirection: 'column', alignItems: 'center', marginTop: 30}}>
                <View style={{ height: 72, width: 128, flexDirection: 'column' }}>
                    <View style={{ height: 48, backgroundColor: '#FAF5EC', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 4, borderTopRightRadius: 4}}>
                        <Text style={{ fontWeight: '500', fontSize: 16, color: '#8C5819'
                        // lineHeight: 22.5
                        }}>
                            ¥<Text style={{ fontSize: 30, 
                                // lineHeight: 42
                                }}>{promoAmount}</Text>
                        </Text>
                    </View>
                    <LinearGradient colors={['#F8E6CA', '#EAD0A8']} 
                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                    style={{ height: 24, backgroundColor: '#343434', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 4, borderBottomRightRadius: 4}}>
                      <Text style={{ color: '#8C5819', fontSize: 13}}>
                              会员专享优惠
                      </Text>
                    </LinearGradient>
                </View>
                <View style={{ width: 351, height: 127.5, borderWidth: 0.5, borderRadius: 4, borderColor: '#E1E1E1', marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    {/* 上框中间的三角形 */}
                    <View style={[{
                        alignSelf: 'flex-start',
                        position: 'absolute',
                    }, sysname === 'ios' ? {
                        top: -18,
                        width: 0,
                        height: 0,
                        borderTopWidth: 10,
                        borderTopColor: 'transparent',
                        borderRightWidth: 10,
                        borderRightColor: 'transparent',
                        borderLeftWidth: 10,
                        borderLeftColor: 'transparent',
                        borderBottomWidth: 8,
                        borderBottomColor: '#E1E1E1',
                        // 安卓侧的兼容写法
                    } : {
                        top: -8,
                        width: 16,
                        height: 8,
                        borderRightWidth: 8,
                        borderRightColor: 'transparent',
                        borderLeftWidth: 8,
                        borderLeftColor: 'transparent',
                        borderBottomWidth: 8,
                        borderBottomColor: '#E1E1E1',
                    }]} />
                    {/* 上框中间的三角形 */}
                    <View style={[{
                        alignSelf: 'flex-start',
                        position: 'absolute',
                    }, sysname === 'ios' ? {
                        top: -17.1,
                        width: 0,
                        height: 0,
                        borderTopWidth: 10,
                        borderTopColor: 'transparent',
                        borderRightWidth: 10,
                        borderRightColor: 'transparent',
                        borderLeftWidth: 10,
                        borderLeftColor: 'transparent',
                        borderBottomWidth: 8,
                        borderBottomColor: '#FFFFFF',
                        // 安卓侧的兼容写法
                    } : {
                        top: -6.97,
                        width: 16,
                        height: 8,
                        borderRightWidth: 8,
                        borderRightColor: 'transparent',
                        borderLeftWidth: 8,
                        borderLeftColor: 'transparent',
                        borderBottomWidth: 8,
                        borderBottomColor: '#FFFFFF',
                    }]} />
                    <View style={{height: 69.5, backgroundColor: '#FFF2EE', flexDirection: 'row', paddingHorizontal: 15, borderRadius: 4}}>
                        <View style={{ justifyContent: 'center', alignContent: 'center' }}>
                            <Text style={{ fontWeight: '600', fontSize: 12}}>¥<Text style={{ fontSize: 19}}>{subTotalAmount}</Text></Text>
                            <Text style={{ color: '#777777', fontSize: 13, fontWeight: '400', textAlign: 'center'}}>小计</Text>
                        </View>
                        <View style={{ paddingHorizontal: 15, justifyContent: 'center' }}>
                            <Text style={{ textAlign: 'center', fontSize: 12, lineHeight: 16.5 }}>-</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignContent: 'center' }}>
                            <Text style={{ fontWeight: '600', fontSize: 12, textAlign: 'center'}}>¥<Text style={{ fontSize: 19}}>{bookingPromo}</Text></Text>
                            <Text style={{ color: '#777777', fontSize: 13, fontWeight: '400'}}>预订优惠</Text>
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 15, justifyContent: 'center' }}>
                        <Text>×</Text>
                    </View>
                    <View style={{ height: 69.5, backgroundColor: '#FAF5EC', justifyContent: 'center', alignContent: 'center', paddingHorizontal: 15, borderRadius: 4 }}>
                        <Text style={{ fontWeight: '600', fontSize: 19, textAlign: 'center', color: '#8C5819'}}>{`1-${discount || ""}`}</Text>
                        {discount ? <Text style={{ color: '#8C5819', fontSize: 13, fontWeight: '400'}}>{`会员专享${Big(discount).times(10)}折`}</Text> : null}
                    </View>
                </View>
            </View>
            <TouchableOpacity style={{paddingHorizontal: 15, 
            // paddingBottom: getInset('bottom')
          }} 
            onPress={()=>{
              closeSlideModal()
            }}>
              {isDp ?
              <View style={{justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: '#FF6633', height: 40}}>
                  <Text style={{color: '#FFFFFF', fontSize: 15, lineHeight: 21}}>知道了</Text>
              </View> : 
              <View style={{justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#FF6633', height: 40}}>
                  <Text style={{color: '#FFFFFF', fontSize: 15, lineHeight: 21}}>知道了</Text>
              </View>
              }
            </TouchableOpacity>
          </View>
      </SlideModal>
}
export default PremiumSlideModal