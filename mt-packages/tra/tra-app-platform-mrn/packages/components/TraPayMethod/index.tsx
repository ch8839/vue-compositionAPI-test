import React, {useCallback, useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from '@mrn/react-native'
import { MCModule } from '@nibfe/doraemon-practice'
import { openUrl } from '@mrn/mrn-utils'

import { isDp } from '../utils'
import commonStyles from '../common/styles/default'
import { List } from '../List'
import { observer } from '@nibfe/tra-app-platform-core'
import ListSlideModal from '../ListSlideModal'
import { Checkbox } from '../Checkbox'

const Item = List.ListItem
const payMethodInfo = [{
    "payType": 1,
    "text":'极速支付',
}, {
    "payType": 2,
    "text":'普通支付',
}]
const TraPayMethod = observer((props)=>{
    const { isTimeSelected, changePayType, fastPay } = props
    const { payType, oneClickPayDisplayDTOInfo } = fastPay
    const { disPlayStatus, needGuideMarkSwitch, useStatus, guideMessage } = oneClickPayDisplayDTOInfo
    const [selectedPayType, setSelectedPayType ] = useState(payType)
    const [showSlideModal, setShowSlideModal] = useState(false)
    const [switchOn, setSwitchOn] = useState(needGuideMarkSwitch ? needGuideMarkSwitch : false)
    const getSwitch = useCallback((useStatus, switchOn, isDp)=>{
        let uri = ''
        if(!useStatus) {
            uri = 'https://p1.meituan.net/travelcube/ae9acaa2c5d6ba3eb3ec27254d08c6976659.png'
        }
        if(switchOn) {
            if(isDp) uri = 'https://p0.meituan.net/travelcube/e5a1d5ddbf6d4a8c274157715104229d11285.png'
            else uri = 'https://p0.meituan.net/travelcube/605b2749ed020bac5896cdc93de6b0207022.png'
        }
        else {
            uri = 'https://p1.meituan.net/travelcube/1f676845d7320a0c51e23db6398cc9bb6701.png'
        }
        return (<Image style={{height: 35, width: 52}} source={{uri}}/>)
    } ,[])
    // 测试极速支付未开通模块用
    // return (
    //     <MCModule
    //         paddingHorizontal={0}
    //         gapTop={0}
    //         separatorLineStyle={{ display: 'hidden-all' }}
    //     >
    //     <Item value={
    //                 <TouchableOpacity onPress={()=>{
    //                     setSwitchOn(!switchOn)
    //                     changePayType({payType: !switchOn ? 1 : 2})
    //                 }}>
    //                     {getSwitch(useStatus, switchOn, isDp)}
    //                 </TouchableOpacity>
    //             }>
    //                 <View>
    //                     <View style={{flexDirection: 'row', alignItems: 'center'}}>
    //                         <Text style={{fontSize: 15, color: '#111111'}} >极速支付</Text>
    //                         <TouchableOpacity onPress={()=>{
    //                             openUrl('https://npay.meituan.com/resource/pay-deduction-part/guide.html#/')
    //                         }}>
    //                             <Image style={{width: 14.5, height: 14.5, marginLeft: 5}} source={{uri: 'https://p1.meituan.net/travelcube/ab9dad4846e6263bee21500980a0cb841770.png'}}/>
    //                         </TouchableOpacity>
    //                     </View>
    //                     <Text style={{ fontSize: 12, color: '#777777', marginTop: 4}}>开启极速支付，一键完成下单并支付，方便快捷</Text>
    //                 </View>
    //             </Item>
    //     </MCModule>)
    if(disPlayStatus == 0 || !isTimeSelected) return null
    const payMethodTextComponent = () => {
        if(payType==1) {
            return (<View style={{ flexDirection: 'row' }}><Text style={{ fontSize: 15, color: '#999999', marginRight: 10, textAlignVertical: 'center' }}>有机会享优惠</Text><Text style={{ fontSize: 15}}>{payMethodInfo.find(item=> item.payType === payType)?.text}</Text></View>)
        }
        else if(payType==2) {
            return <Text style={{ fontSize: 15}}>{payMethodInfo.find(item=> item.payType === payType)?.text}</Text>
        }
    }
    const payMehtodItemComponent = () => {
        if(disPlayStatus == 1) {
            return (
                <Item value={
                    <TouchableOpacity onPress={()=>{
                        setSwitchOn(!switchOn)
                        changePayType({payType: !switchOn ? 1 : 2})
                    }}>
                        {getSwitch(useStatus, switchOn, isDp)}
                    </TouchableOpacity>
                }>
                    <View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{fontSize: 15, color: '#111111'}} >极速支付</Text>
                            <TouchableOpacity onPress={()=>{
                                openUrl('https://npay.meituan.com/resource/pay-deduction-part/guide.html#/')
                            }}>
                                <Image style={{width: 14.5, height: 14.5, marginLeft: 5}} source={{uri: 'https://p1.meituan.net/travelcube/ab9dad4846e6263bee21500980a0cb841770.png'}}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 12, color: '#777777', marginTop: 4}}>开启极速支付，一键完成下单并支付，方便快捷</Text>
                    </View>
                </Item>)
        } 
        if(disPlayStatus == 2 || !isTimeSelected) {
            return (
            <Item value={
                payMethodTextComponent()
            }
                onClick={()=>{
                    if(!isTimeSelected) return
                    setShowSlideModal(true)
                    if(selectedPayType !== payType) { 
                        setSelectedPayType(payType) 
                    }
                }}
                arrow={isTimeSelected ? "right" : ''}
            >
                <Text style={{fontSize: 15, color: '#111111'}}>支付方式</Text>
            </Item>)
        }
    }
    return (
        <MCModule
            paddingHorizontal={0}
            gapTop={0}
            separatorLineStyle={{ display: 'hidden-all' }}
        >
            { payMehtodItemComponent() }
            <ListSlideModal
                title={"支付方式"}
                data={payMethodInfo}
                renderItem={
                    ({item, index})=>{
                        return (
                          <Item value={
                            <View style={{flex: 1, flexDirection: 'row'}}><Checkbox size={24} checked={item.payType === selectedPayType ? true : false} canToggle={false} deleteTouchableOuterLayer={true}></Checkbox></View>
                          }
                          onClick={()=>{setSelectedPayType(item.payType)}}
                          >
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 15, lineHeight: 21, fontWeight: '400', color: '#111111'}}>{item.text}</Text>
                                {item.payType == 1 ? <Text style={{ fontSize: 15, color: '#999999' }}>有机会享优惠</Text> : null}
                            </View>
                          </Item>
                        )
                    }
                }
                onClickConfirm={
                    ()=>{
                        changePayType({payType: selectedPayType})
                        setShowSlideModal(false)
                    }
                }
                showSlideModal={showSlideModal}
                setShowSlideModal={setShowSlideModal}
            ></ListSlideModal>
        </MCModule>
    )
})
export default TraPayMethod