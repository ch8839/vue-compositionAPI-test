import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from '@mrn/react-native'

const styles = StyleSheet.create({
  footerStyle: {
    paddingTop: 5,
    paddingBottom: 15,
    backgroundColor: 'transparent',
  },
  textStyle: {
    color: 'rgba(0, 0, 0, 0.35)',
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
  }
})

const Footer = (({type = 'all', text = '', showOrderListBottomText = true}) => {
  const hintText = useMemo(() => {
    if (!showOrderListBottomText) return ''
    return type === 'all' ? `其他订单请查看应用首页“我的”-“我的订单”` : `仅展示2年内订单，其他订单请查看应用首页“我的”-“我的订单”`
  }, [showOrderListBottomText, type])
  let textComp = text ? (<Text style={styles.textStyle}>{ text || '' }</Text>) : (<Text style={styles.textStyle}>
    { hintText }
  </Text>)
  return (
    <View style={styles.footerStyle}>
      {textComp}
    </View>
  )
})

export default Footer
