import React from 'react'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity } from '@mrn/react-native'

// 最佳实践
import { MCModule } from '@nibfe/doraemon-practice'
import { openUrl } from '@mrn/mrn-utils'
import { Checkbox } from '../Checkbox/index'

import { observer } from '@nibfe/tra-app-platform-core'

import { GCMRNTextView } from '@mrn/mrn-module-component'
const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 15,
  },
  mainTextBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
    paddingHorizontal: 15,
  },
  mainTextBoxLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  mainTextBoxRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  mainText: {
    fontSize: 15,
    color: '#111111',
    fontWeight: '400',
  },
  explanationBox: {
    paddingHorizontal: 15,
    marginTop: 4,
  },
  highlight: {
    color: '#FF6633'
  }
})

const TraPremiumCard = observer(props => {
  const { isTimeSelected, cardInfo, onChange, selectedCard, showPremiumPrice } = props
  // 无卡信息或入口为预订价，未选择时间块时该组件不展示
  if(!cardInfo || (!isTimeSelected && !showPremiumPrice)) return null
  // 富文本数据结构卡后端误设计为Array<string>，所以需要转换一下使用
  const transform = (element) => {
    if(element && Array.isArray(element) && element.length > 0) {
      return element.map((item)=>{ return JSON.parse(item) })
    }
    else return []
  }
  console.log("cardInfo: ", cardInfo)
  return (
    <MCModule
      paddingHorizontal={0}
      gapTop={0}
      separatorLineStyle={{ display: 'hidden-all' }}
    >
      <TouchableWithoutFeedback onPress={()=> {
          // 未选择时间并且会员卡入口时点击无反应
          if(!isTimeSelected && showPremiumPrice) return
          onChange(!selectedCard)
        }}>
        <View style={styles.card}>
          {/* 左上的图和“本单赚回卡费”的图 */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingRight: 15}}>
              <Image style={{height: cardInfo?.mainTitle?.height, width: 
                cardInfo?.mainTitle?.width
                }} source={{uri: cardInfo?.mainTitle?.icon}}/>
              <View>
                {cardInfo?.abovePriceTips ? <Image style={{width: cardInfo?.abovePriceTips?.width, height: cardInfo?.abovePriceTips?.height}} source={{uri: cardInfo?.abovePriceTips?.icon}} /> : null}
              </View>
          </View>
          {/* 文字描述以及按钮 */}
          <View style={styles.mainTextBox}>
            <TouchableOpacity onPress={()=>{
                openUrl(cardInfo?.detailUrl)
              }} style={{ flexDirection: 'row', alignItems: 'center'}}>
                <GCMRNTextView textModelList={transform(cardInfo?.cardPromoDesc)} />
                <Image style={{width: 14.5, height: 14.5, marginLeft: 5}} source={{uri: 'https://p1.meituan.net/travelcube/ab9dad4846e6263bee21500980a0cb841770.png'}}/>
            </TouchableOpacity>
            <View style={styles.mainTextBoxRight}>
              <Text style={styles.mainText}>{cardInfo?.priceStr || ''}</Text>
              {!isTimeSelected && showPremiumPrice ?
                <Image style={{height: 23, width: 23, marginLeft: 5}} source={{uri: 'https://p0.meituan.net/travelcube/2aee4d36209b4b5d57426a9fad84716d2032.png'}}/>
                :
                <Checkbox size={24} deleteTouchableOuterLayer={true} checked={selectedCard} onChange={onChange} styles={{wrapper: {marginLeft: 5}}}></Checkbox>
              }
            </View>
          </View>
          <View style={styles.explanationBox}>
            <GCMRNTextView textModelList={transform(cardInfo?.cardRightsDesc)} />
          </View>
        </View>
      </TouchableWithoutFeedback>
      {/* 分割线 */}
      <View style={{paddingHorizontal: 15}}>
        <View style={{height: 0.5, backgroundColor: '#EEEEF0'}}/>
      </View>
    </MCModule>
  )
})

export default TraPremiumCard