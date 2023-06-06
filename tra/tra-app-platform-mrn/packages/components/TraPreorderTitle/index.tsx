import React from 'react'
import { StyleSheet, Text, View, TouchableHighlight, Image } from '@mrn/react-native'
import { MCModule } from '@nibfe/doraemon-practice'
import { observer } from '@nibfe/tra-app-platform-core'
const styles = StyleSheet.create({
    box: {
        paddingTop: 20,
        paddingBottom: 17,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 19, 
        fontWeight: '600',
        color: '#111111', 
        // lineHeight: 26.5
    }
})
const TraPreorderTitle = observer((props) => {
    const { productName, closeContainer, exitModuleClick } = props
    return (
        <MCModule 
            paddingHorizontal={0} 
            gapTop={0} 
            separatorLineStyle={{display: 'hidden-all'}} 
            card={true} 
            cardStyle={{cornerRadius: 20, marginHorizontal: 0}} 
            cardType={'top'}
            hoverType={'alwaysHover'}
        >
            <View style={styles.box}>
                <Text style={styles.title}>{productName}</Text>
                <TouchableHighlight style={{
                    width: 20,
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }} activeOpacity={1} underlayColor={'#FFFFFF'} onPress={
                    ()=> { 
                        // 右上角x点击点
                        exitModuleClick()
                        closeContainer()
                    }
                }>
                <Image style={{width: 9.5, height: 9.5}} source={{uri: 'https://p0.meituan.net/travelcube/426f762abc0ffd3c60f9d4012e487af8577.png'}} />
            </TouchableHighlight>
            </View>
        </MCModule>
    )
})
export default TraPreorderTitle