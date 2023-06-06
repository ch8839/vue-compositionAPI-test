import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, Image, Platform } from '@mrn/react-native'
import { MCModule } from '@nibfe/doraemon-practice'
import { EasyGrid as Grid, Tab } from '@nibfe/gc-ui'
import { isDp } from '@nibfe/tra-app-platform-mrn-components/utils'
import { LinearGradient } from '@mrn/react-native-linear-gradient'
import { observer } from '@nibfe/tra-app-platform-core'
import { GCMRNNativeTouchBarrier } from '@mrn/mrn-module-component'

const styles = StyleSheet.create({
  tab: {
    paddingLeft: 15.5,
  },
  selectedTabItemText: {
    color: isDp ? '#FF6633' : '#111111',
    fontWeight: "600",
  },
  regularTabItemText: {
    color: '#111111'
  },
  tabItemWeekText: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: 'center',
  },
  tabItemDayText: {
    fontSize: 13,
    fontWeight: "400",
    textAlign: 'center',
  },
  scrollViewForGrid: {
    height: 190,
    marginTop: 15,
    paddingHorizontal: 15.5,
    width: '100%'
  },
  grid: {
    width: '100%',
  },
  gridItemView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDp ? '#F4F4F4' : '#F8F9FA',
    borderRadius: 2,
    width: 80,
    height: 68
  },
  gridItemTitleText: {
    fontSize: 15,
    lineHeight: 21,
  },
  gridItemSubtitleText: {
    fontSize: 12,
    lineHeight: 16.5,
    color: '#999999',
    textAlign: 'center',
  },
  gridItemStockText: {
    fontSize: 10,
    lineHeight: 14,
    color: '#FF6633',
    textAlign: 'center',
  },
  gridItemFullyBookedText: {
    color: '#999999',
  },
  icon: {
    width: 13, 
    height: 13,
  },
  selectedGridItemView: {
    backgroundColor: isDp ? '#FFF2EE' : 'rgba(255,150,0,0.04)',
    borderStyle: isDp ? null : 'solid',
    borderColor: isDp ? null : '#FFC300',
    borderWidth: isDp ? 0 : 0.5,
  },
  selectedGridItemText: {
    color: isDp ? '#FF6633' : '#111111',
    fontWeight: '600'
  }
})
// Grid每行4个元素
const colCount = 4
// Tab文案的样式
const getTabItemTextStyle = (index, selectedTabIndex) => {
  if(index === selectedTabIndex) return styles.selectedTabItemText
  return styles.regularTabItemText
}
const TimeSelect = observer((props) => {
  const sysname = Platform.OS
  const { timeSelectData, onClickTime, onChangeDateTab } = props
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [selectedGridIndex, setSelectedGridIndex] = useState(-1)
  if(!timeSelectData) return null
  // 日期选择Tab数据源
  const tabDateSelectList = timeSelectData?.timeSelectList && timeSelectData?.timeSelectList.map(time => {
    return {week: time?.week, day: time?.day, promoIcon: time?.promoIcon, productItemId: time?.scheduledId}
  }) || []
  // 时间选择Grid数据源
  const gridTimeSelectList = timeSelectData?.timeSelectList && timeSelectData?.timeSelectList[selectedTabIndex]?.list
  .reduce(function (prevList, curTimeRange) {
    // curTimeRange.list 有可能为null
    // 正常情况包括：后端查询到全天各个时段都没有库存。
    // 异常情况包括：后端没有获取到当天价格。
    if(Array.isArray(curTimeRange?.list)) return [...prevList, ...curTimeRange?.list]
    return prevList
  },[])
  console.log("gridTimeSelectList: ", gridTimeSelectList)
  const tabItem = (item, _selectedIndex, index) => {
    const tabItemText = getTabItemTextStyle(index, selectedTabIndex)
    return (
        <View style={{marginBottom: 0, flexDirection: 'row'}}>
          <View>
            <Text style={[styles.tabItemWeekText, tabItemText]}>{item?.week}</Text>
            <Text style={[styles.tabItemDayText, tabItemText, {fontWeight: '400'}]}>{item?.day}</Text>
          </View>
          {/* Image组件不接受uri为空的传值，否则会出现传值问题 */}
          {item?.promoIcon ? <Image style={[styles.icon, {marginTop: 2.5, marginLeft: 3}]} source={{uri: item?.promoIcon || ""}}/> : null}
        </View>)
  }
  const gridItem = (item, index) => {
    const gridItemExtra = selectedGridIndex === index ? styles.selectedGridItemView : {}
    const selectedGridItemText = selectedGridIndex === index ? styles.selectedGridItemText : {}
    return (<View style={[styles.gridItemView, gridItemExtra]}>
      {item?.nextDayText ? <View style={{top: 0, left: 0, position: 'absolute', backgroundColor: isDp ? '#71B5DC' : '#26A5F2', padding: 2, borderTopLeftRadius: 2, borderBottomRightRadius: 2}}>
            <Text style={{ fontSize: 9, color: 'white' }}>{item.nextDayText}</Text>
      </View> : null}
      <View>
        <Text style={[styles.gridItemTitleText, selectedGridItemText, item?.status || styles.gridItemFullyBookedText]}>{item?.displayTime}</Text>
        <Text style={[styles.gridItemSubtitleText, selectedGridItemText, item?.status || styles.gridItemFullyBookedText]}>{`¥${item?.price}`}</Text>
        {item?.stockDesc ? <Text style={[styles.gridItemStockText, selectedGridItemText, item?.status || styles.gridItemFullyBookedText]}>{`${item?.stockDesc}`}</Text> : null}
      </View>
      {/* Image组件不接受uri为空的传值，否则会出现传值问题 */}
      {item?.promoIcon ? <Image style={[styles.icon, { position: 'absolute', top: 0, right: 0 }]} source={{uri: item.promoIcon}}/> : null}
    </View>)
  }
  return (
    <MCModule paddingHorizontal={0} gapTop={0} showTopLine={false} separatorLineStyle={{display: 'hidden-all'}}>
      <Tab
        data={ tabDateSelectList } 
        renderTabItem={ tabItem }
        isEqualized={false}
        colGap={20}
        tabWidth={55}
        autoScrollToMiddle={false}
        style={styles.tab}
        selectedIndex={selectedTabIndex}
        slideBar={
            isDp ? <LinearGradient 
            useAngle={true} angle={90} angleCenter={ {x: 0.9, y: 0.9}} 
            colors={['#FF3F27', '#FFB76C']} style={{ width: '100%', height: 3}} />
            :
            <LinearGradient 
            useAngle={true} angle={135} angleCenter={ {x: 0.9, y: 0.9}} 
            colors={['#FFD000', '#FFBD00']} style={{ width: '100%', height: 3}} />
        }
        slideBarStyle={{
          slideBarHeight: 3,
          slideBarIsRounded: isDp ? false : true,
          slideBarPosition: 'bottom'
        }}
        onItemSelect={(_item, index) => {
          // 切换日期Tab
          setSelectedTabIndex(index)
          // 选择的时间点重置
          setSelectedGridIndex(-1)
          console.log("Tab onItemSelect: ", gridTimeSelectList)
          const bookingDate = gridTimeSelectList?.length > 0 && gridTimeSelectList[0].timeStamp
          onChangeDateTab({bottomPriceData: timeSelectData.timeSelectList[index], index, bookingDate})
        }}
      />
      {/* 分割线 */}
      <View style={{
        height: 0.5,
        backgroundColor: '#EEEEF0'
      }}/>
      {/* gridTimeSelectList长度为0时需要兜底展示 */}
      { gridTimeSelectList.length > 0 ? 
        // 安卓环境下有局部滚动事件的组件需要外层套这个GCMRNNativeTouchBarrier，iOS环境下enabled一定要为false，否则14pro无法滚动。
        // 组件具体信息参考此文档：https://km.sankuai.com/page/1343168422
        <GCMRNNativeTouchBarrier
          enabled={sysname === 'android' ? true : false}
        >
          <ScrollView
            nestedScrollEnabled={true}
            style={styles.scrollViewForGrid}
          >
            <Grid
              data={gridTimeSelectList}
              columnNum={colCount}
              colGap={8}
              rowGap={8}
              onPressItem={(item, index) => {
                if(!item?.status) return
                setSelectedGridIndex(index)
                console.log("Grid onPressItem: ", index)
                // 选择的到店时间
                const arriveTime = item.timeStamp
                // 选择的productItemId
                const productItemId = tabDateSelectList[selectedTabIndex]?.productItemId
                const nextDayText = item.nextDayText
                onClickTime({arriveTime, productItemId, nextDayText, index, time: item.displayTime, duration: timeSelectData.duration})
              }}
              renderItem={gridItem}
            />
          </ScrollView>
        </GCMRNNativeTouchBarrier>  :
        <View style={[styles.scrollViewForGrid, {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}>
          <Text>
            该时段已被订满，请选择其它时段
          </Text>
        </View>
      }
      {/* 分割线 */}
      <View style={{
        height: 0.5,
        backgroundColor: '#EEEEF0'
      }}/>
    </MCModule>
  )
})

export default TimeSelect
