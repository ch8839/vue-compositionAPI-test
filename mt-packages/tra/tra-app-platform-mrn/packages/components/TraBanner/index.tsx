import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from '@mrn/react-native'
import { observer } from '@nibfe/tra-app-platform-core'

const styles = StyleSheet.create({
    banner: {   
        backgroundColor: 'rgba(0,0,0,0.60)',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bannerText: {
      color: '#FFFFFF',
      fontSize: 13,
      lineHeight: 18.5,
    }
  })
const TraBanner = observer((props) => {
    const { bottomBannerTextParts, isTimeSelected, defaultBottomBannerText } = props
    let bottomBannerTextNode: any
    if(isTimeSelected && bottomBannerTextParts) bottomBannerTextNode = (
        <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
        <View>
            <Text style={{ color: '#FFFFFF', fontSize: 13, lineHeight: 18.5}}>{`${bottomBannerTextParts.week}${bottomBannerTextParts.day} ${bottomBannerTextParts.time}`}</Text>
        </View>
        <View style={{ width: 0.5, marginHorizontal: 6, paddingVertical: 10}}>
            <View style={{ backgroundColor: '#BBBBBB', width: '100%', height: '100%' }}></View>  
        </View>
        <View>
            <Text style={{ color: '#FFFFFF', fontSize: 13 }}>{`${bottomBannerTextParts.duration}`}</Text>
        </View>
        <View style={{ width: 0.5, marginHorizontal: 6, paddingVertical: 10}}>
            <View style={{ backgroundColor: '#BBBBBB', width: '100%', height: '100%' }}></View>  
        </View>
        <View>
            <Text style={{ color: '#FFFFFF', fontSize: 13, lineHeight: 18.5}}>{`${bottomBannerTextParts.number || '1人'}`}</Text>
        </View>
        </View>)
    else bottomBannerTextNode = defaultBottomBannerText
    return (
        <View style={styles.banner}>
            {typeof(bottomBannerTextNode) === 'string' ? <Text style={styles.bannerText}>{bottomBannerTextNode}</Text> : bottomBannerTextNode} 
        </View>
    )
})

export default TraBanner