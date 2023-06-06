import React from 'react'
import { View, Text, StyleSheet } from '@mrn/react-native'
import QRCode, { QRCodeProps } from 'react-native-qrcode-svg'
import { observer } from '@nibfe/tra-app-platform-core'
import { styles } from './styles'

export const qrcodeStyles = StyleSheet.create({
  centerWrapperStyle: {
    alignItems:'center',
  },
  textStyle: {
    lineHeight: 16.5,
    color: 'rgba(0,0,0,0.35)'
  }
})


export interface OrderQRCodeProps extends QRCodeProps {
  text?: string,
}

export const OrderCardQRCode = observer((props: OrderQRCodeProps) => {
  if (!props.value) return null
  const text = `${props.text || '验证码'}：${props.value}`
  return (
    <View style={[styles.moduleWrapperStyle, qrcodeStyles.centerWrapperStyle]}>
      <View style={[styles.smallMarginBottom]}>
        <QRCode {...props} {...{ size: 110 }} />
      </View>
      <Text style={[styles.textStyle, styles.smallText, qrcodeStyles.textStyle]}>{text}</Text>
    </View>
  )
})
