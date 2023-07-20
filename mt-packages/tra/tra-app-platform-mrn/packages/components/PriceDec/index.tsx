import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from '@mrn/react-native'
import { MCModule } from '@nibfe/doraemon-practice'
import commonStyles from '../common/styles/default'
import { openUrl } from '@mrn/mrn-utils'
import { observer } from '@nibfe/tra-app-platform-core'

import { Icon } from '@nibfe/gc-ui'
const styles = StyleSheet.create({
  decWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    paddingLeft: 15
  },
  decText: {
    color: '#111111',
    fontSize: 15,
  }
})

const PriceDec = observer(() => {
  function goPriceDescription() {
    const url =
      'https://shangou.meituan.net/v1/mss_24c1e05b968a4937bf34e2f4ff68639e/shangou-fe-maker-html/sg/html/1608212005811_f2ba81/index.html'
    openUrl(url)
  }

  const decText = '价格说明'

  return (
    <MCModule paddingHorizontal={0} gapTop={0} separatorLineStyle={{ display: 'hidden-all'}}>
      <TouchableOpacity onPress={() => goPriceDescription()}>
        <View style={styles.decWrapper}>
          <Text style={styles.decText}>{decText}</Text>
          <Image style={{ width: 14.5, height: 14.5, marginLeft: 5}} source={{uri: 'https://p1.meituan.net/travelcube/ab9dad4846e6263bee21500980a0cb841770.png'}}/>
        </View>
      </TouchableOpacity>
    </MCModule>
  )
})

export default PriceDec