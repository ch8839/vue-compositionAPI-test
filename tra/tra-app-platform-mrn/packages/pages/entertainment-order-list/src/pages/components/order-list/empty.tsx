import React, { useMemo, useContext } from 'react'
import { GCUIThemeContext } from '@nibfe/theme-provider-lighter'
import { View, Text, StyleSheet } from '@mrn/react-native'
import { DMImage } from '@nibfe/gc-ui'

export interface Size {
  width: number
  height: number
}

const common_styles = StyleSheet.create({
  imageWrapperStyle: {
    justifyContent: 'center',
    alignItems:'center',
  },
})

const dp_styles = StyleSheet.create({
  ...common_styles,
  wrapperStyle: {
    marginTop: 195,
    minHeight: '100%',
  },
  imageSize: {
    width: 105,
    height: 105,
    marginBottom: 20,
  },
  textStyle: {
    fontWeight: '400',
    fontSize: 15,
    color: '#111111',
    textAlign: 'center',
  }
})

const mt_styles = StyleSheet.create({
  ...common_styles,
  wrapperStyle: {
    marginTop: 124,
    minHeight: '100%',
  },
  imageSize: {
    width: 150,
    height: 181,
  },
  textStyle: {
    fontWeight: '500',
    fontSize: 17,
    color: '#000000',
    textAlign: 'center',
  }
})

const MT_EmptyImg = 'https://p0.meituan.net/travelcube/fb46c5866b130527037fef85bc2b545c102790.png'
const DP_EmptyImg = 'https://p1.meituan.net/travelcube/4361df4996807706e34d15eb7fe777be30891.png'

const EmptyViewComponent = ((props) => {
  const { theme } = useContext(GCUIThemeContext)
  const styles = useMemo(() => {
    return theme.AppThemeType === 1 ? dp_styles : mt_styles
  }, [theme.AppThemeType])
  return (
    <View style={styles.wrapperStyle}>
      <View style={styles.imageWrapperStyle}>
        <DMImage
          source={{ uri: theme.AppThemeType === 1 ? DP_EmptyImg : MT_EmptyImg } }
          style={[
            styles.imageSize,
            props.imageSize
          ]}
        />
      </View>
      <Text style={[styles.textStyle, props.textStyle]}>{ props.text || '您还没有相关订单' }</Text>
    </View>
  )
})

export default EmptyViewComponent

