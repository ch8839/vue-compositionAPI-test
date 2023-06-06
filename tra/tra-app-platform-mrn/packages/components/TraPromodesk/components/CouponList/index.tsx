import React, {useState} from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from '@mrn/react-native'
import { Checkbox } from '../../../Checkbox'
import { Icon } from '@nibfe/gc-ui'
import { Dash } from '@nibfe/react-native-dash'
const styles = StyleSheet.create({
    card: {
        // flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderWidth: 0.5, 
        borderRadius: 3, 
        borderColor: '#F6F6F6',
        paddingRight: 15,
        backgroundColor: '#FFFFFF',
        shadowOpacity: 0.1,
        shadowColor: '#000000',
        elevation: 2,
        shadowOffset: {width: 0, height: 2},
        marginBottom: 15,
        marginHorizontal: 15,
        minHeight: 91,
    },
    unavailableCard: {
        flex: 1, 
        flexDirection: 'column', 
        borderWidth: 0.5, 
        borderRadius: 3, 
        borderColor: '#F6F6F6',
        backgroundColor: '#FFFFFF',
        shadowOpacity: 0.1,
        shadowColor: '#000000',
        elevation: 2,
        shadowOffset: {width: 0, height: 2},
        marginBottom: 15,
        marginHorizontal: 15,
        minHeight: 126,
    },
    cardTitle: {
        fontSize: 11,
        color: '#777777',
    },
    unavailableReasonBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'baseline',
        paddingTop: 9.75,
        paddingBottom: 10,
        paddingLeft: 15.85,
        minHeight: 34.75,
    },
    unavailableReason: {
        color: '#999999',
        fontSize: 11,
        includeFontPadding: false,
        textAlignVertical: 'center',
        marginLeft: 4,
    },
    arrow: {
        width: 10,
        height: 10,
    }
})
const PlatformCouponList = props => {
    const { availableCouponList, unavailableCouponList, selectedPromoId, setSelectedPromoId } = props
    const [showUnavailableReason, setShowUnavailableReason] = useState(new Array(unavailableCouponList.length).fill(false))
    const [availableCardHeight, setAvailableCardHeight] = useState(91)
    const [unavailableCardHeight, setUnavailableCardHeight] = useState(91)
    const couponList = []
    if(availableCouponList.length > 0) {
        couponList.push({isTitle: true})
        couponList.push(...availableCouponList)
    }
    if(unavailableCouponList.length > 0) {
        couponList.push({isTitle: true})
        couponList.push(...unavailableCouponList)
    }
    // 可用券和不可用的券的分界
    const splitIndex = availableCouponList.length === 0 ? -1 : availableCouponList.length
    // 可用券项
    const availableCouponItem = (item, index) => {
        if(item.isTitle) return <View style={{marginLeft: 15, marginBottom: 10}}><Text style={styles.cardTitle}>{`可用优惠券(${availableCouponList.length})`}</Text></View>
        const timeTextArr= item.timeText && JSON.parse(item.timeText)
        return (
        <View style={[styles.card]} onLayout={(e)=>{
            const { height } = e.nativeEvent.layout
            setAvailableCardHeight(height)
        }}>
            <View style={{ flex: 1, width: 300, flexDirection: 'row', borderWidth: 0}}>
                <View style={{width: 90, flexDirection: 'column', alignItems: 'center', 
                marginTop: 20, 
                justifyContent: 'space-between',
                position: 'relative'
                }}>
                    <Text style={{ fontSize: 24, color: '#111111', fontWeight: '500'}}>
                        {item.amount} <Text style={{ fontSize: 11, color: '#111111', fontWeight: '400'}}>{item.amountText}</Text>
                    </Text>
                    <Text style={{ fontSize: 11, color: '#777777', fontWeight: '400', 
                    marginBottom: 15
                }}>{item.limitText}</Text>
                </View>
                {/* 分割虚线 */}
                <Dash dashColor={'#F0F0F0'} dashGap={3} dashLength={3} 
                      dashThickness={StyleSheet.hairlineWidth*2} 
                style={{ 
                        flexDirection: 'column', 
                        position: 'absolute', 
                        left: 90.25,
                        top: 5,
                        overflow: 'hidden',
                        height: availableCardHeight - 10 // 10 = dashline的paddingTop + dashline的paddingBottom
                }}/>
                <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 15, 
                justifyContent: 'space-between'
                }}>
                    <Text style={{ fontSize: 15, marginTop: 15 }}>{item.titleText}</Text>
                    <View style={{
                            marginBottom: 15,
                            flexDirection: 'row',
                            flexWrap: 'wrap'
                        }}>
                        {
                            item.timeText && timeTextArr.map(
                                (singleTimeText, index) => {
                                    return <Text style={{ color: '#FF6633', fontSize: 11, textAlignVertical: 'center'}}>{`${singleTimeText}${index === timeTextArr.length - 1 ? '' : '、'}`}</Text>
                                })
                        }
                        {/* <Text style={{ color: '#FF6633', fontSize: 11, textAlignVertical: 'center'}}>{"商家立减后满9999元可用qq、"}</Text>
                        <Text style={{ color: '#FF6633', fontSize: 11, textAlignVertical: 'center'}}>{"商家立减后满9999元可用、"}</Text>
                        <Text style={{ color: '#FF6633', fontSize: 11, textAlignVertical: 'center'}}>{"商家立减后满9999元可用、"}</Text>
                        <Text style={{ color: '#FF6633', fontSize: 11, textAlignVertical: 'center'}}>{"商家立减后满9999元可用、"}</Text> */}
                    </View>
                    
                </View>
            </View>
            <Checkbox size={24} 
                    onChange={
                        (selectedStatus)=>{
                            if(selectedStatus === false) setSelectedPromoId("")
                            else setSelectedPromoId(item.promoId)
                        }
                    } 
                    checked={selectedPromoId === item.promoId ? true : false}>
            </Checkbox>
        </View>)
    }
    // const availableCouponItem = (item, index) => { return null }
    // 不可用券项
    const unavailableCouponItem = (item, index) => {
        if(item.isTitle) return <View style={{marginLeft: 15, marginBottom: 10, marginTop: availableCouponList.length > 0 ? 5 : 0}}><Text style={styles.cardTitle}>{`此订单不可使用优惠券(${unavailableCouponList.length})`}</Text></View>
        const timeTextArr = item.timeText && JSON.parse(item.timeText)
        return (
            <View style={[styles.unavailableCard]}>
                <View style={{ flexDirection: 'row', borderWidth: 0, 
                    // paddingVertical: 5,
                    minHeight: 91,
                }} onLayout={(e)=>{
                    const { height } = e.nativeEvent.layout
                    setUnavailableCardHeight(height)
                }}>
                    <View style={{width: 90, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', marginTop: 20
                    }}>
                        <Text style={{ fontSize: 24, color: '#999999', fontWeight: '500'}}>
                            {item.amount} <Text style={{ fontSize: 11, color: '#999999', fontWeight: '400'}}>{item.amountText}</Text>
                        </Text>
                        <Text style={{ fontSize: 11, color: '#999999', fontWeight: '400', 
                        marginBottom: 15
                        }}>{item.limitText}</Text>
                    </View>
                    {/* 分割虚线 */}
                    <Dash dashColor={'#F0F0F0'} dashGap={3} dashLength={3} dashThickness={StyleSheet.hairlineWidth*2}  
                        style={{ 
                            flexDirection: 'column', 
                            position: 'absolute', 
                            top: 5,
                            left: 90.25,
                            overflow: 'hidden',
                            height: unavailableCardHeight - 10 // 10 = dashline的paddingTop + dashline的paddingBottom
                    }}/>
                    <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 15, justifyContent: 'space-between' }}>
                        <Text style={{ color: '#999999', fontSize: 15, marginTop: 15 }}>{item.titleText}</Text>
                        <View style={{ 
                            marginBottom: 15,
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                        }}>
                        {
                            item.timeText && timeTextArr.map(
                                (singleTimeText) => {
                                    return <Text style={{ color: '#999999', fontSize: 11}}>{`${singleTimeText}${index === timeTextArr.length - 1 || timeTextArr.length === 1 ? '' : '、'}`}</Text>
                                })
                        }
                            {/* <Text style={{ color: '#FF6633', fontSize: 11, textAlignVertical: 'center'}}>{"、商家立减后满9999元可用mm、"}</Text>
                            <Text style={{ color: '#FF6633', fontSize: 11, textAlignVertical: 'center'}}>{"商家立减后满9999元可用、"}</Text>
                            <Text style={{ color: '#FF6633', fontSize: 11, textAlignVertical: 'center'}}>{"商家立减后满9999元可用、"}</Text>
                            <Text style={{ color: '#FF6633', fontSize: 11, textAlignVertical: 'center'}}>{"商家立减后满9999元可用、"}</Text>
                            <Text style={{ color: '#FF6633', fontSize: 11, textAlignVertical: 'center'}}>{"商家立减后满9999元可用、"}</Text> */}
                        </View>
                    </View>
                </View>
                <View style={{height: 0.5, width: '100%', backgroundColor: '#EEEEF0'}}/>
                <TouchableOpacity style={styles.unavailableReasonBox}
                onPress={()=>{
                    showUnavailableReason[index] = !showUnavailableReason[index]
                    setShowUnavailableReason(showUnavailableReason.slice())
                }}>
                    <View style={{flexDirection: 'column'}}>
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                            <Icon name={'warning'} size={11.5} tintColor={'#999999'} />
                            <Text style={styles.unavailableReason}>不可用原因</Text>
                        </View>
                        { showUnavailableReason[index] && item.ruleText ? 
                            <View style={{ flexDirection: 'column', marginTop: 2, marginLeft: 15}}>
                                {JSON.parse(item.ruleText).map((rule)=>{
                                    return (
                                            <Text style={{ fontSize: 11, color: '#999999' }}>{rule}</Text>
                                        )
                                })}
                        </View> : null }
                    </View>
                    <View style={{ marginRight: 15, width: 11, height: 11, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        { showUnavailableReason[index] ?  <Image 
                        style={[styles.arrow, 
                            {top: 1, position: 'absolute'}
                        ]} 
                        source={{uri: 'https://p1.meituan.net/travelcube/2ee68a3fc7edbf9e9531cd07b8f3afd1805.png' }} /> :  <Image style={styles.arrow} source={{uri: 'https://p0.meituan.net/travelcube/269112387eea1797ef788d82821910ec811.png' }} /> }
                    </View>
                </TouchableOpacity>
            </View>)
    }
    return (
        <FlatList
            data={couponList}
            renderItem={ ({item, index}) => {
                if(index <= splitIndex) return availableCouponItem(item, index)
                return unavailableCouponItem(item, index)
            }
            }
        />
    )
}
export default PlatformCouponList