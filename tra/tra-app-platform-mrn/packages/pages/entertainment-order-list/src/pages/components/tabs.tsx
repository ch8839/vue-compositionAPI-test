import React, { useContext, useEffect } from 'react'
import { StyleSheet } from '@mrn/react-native'
import { GCUIThemeContext } from '@nibfe/theme-provider-lighter'
import { Tab } from '@nibfe/gc-ui'
import { MCModule } from '@nibfe/doraemon-practice'
import { observer } from '@nibfe/tra-app-platform-core'
import { LinearGradient } from '@mrn/react-native-linear-gradient'

const styles = StyleSheet.create({
  tabContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 88,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 32,
    marginVertical: 15,
    marginTop: 20,
    backgroundColor: 'orange',
  },
  circleContainer: {
    height: 32,
    borderColor: 'orange',
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  descText: {
    backgroundColor: '#f7f7f7',
    marginBottom: 8,
    paddingHorizontal: 16,
    color: 'gray',
    fontSize: 12,
  },
  separator: {
    height: 30,
    backgroundColor: '#f7f7f7',
  },
})

export interface TabItem {
  // tab的唯一Id
  key?: string
  // tab的标签文案
  label?: string
  // 扩展字段，用于业务有复杂数据结构的场景
  extra?: any
}

const LinearSlideBar = () => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={['#FF5C38', '#FF9459']}
      style={{
        height: 5,
      }}>
    </LinearGradient>
  )
}

export const OrderListTabs = observer((props: {
  tabs: TabItem[],
  onItemSelect?: (item: TabItem, index: number) => void
  selectedIndex: number,
  initialIndex?: number,
  lxInfo?: Record<string, string>
  onInit?: () => void
}) => {
  const { theme } = useContext(GCUIThemeContext)

  useEffect(() => {
    props.onInit && props.onInit()
  }, [])

  return (
    <MCModule
      paddingHorizontal={20}
      gapTop={0}
      zPosition={2}
      hoverType="alwaysHover">
      <Tab
        data={props.tabs}
        onItemSelect={props.onItemSelect}
        selectedIndex={props.selectedIndex}
        initialIndex={props.initialIndex || 0}
        tabHeight={45}
        styles={{
          // @ts-ignore
          paddingTop: 10,
          paddingBottom: 10,
          slideBarWrapper: {
            // @ts-ignore
            zIndex: -1,
            marginBottom: 10
          },
        }}
        slideBar={ theme.AppThemeType === 1 ? <LinearSlideBar /> : null } // 点评使用自定义slidebar
        slideBarStyle={{
          slideBarWidth: 'title-width',
          slideBarColor: '#FFD100',
          slideBarHeight: 5,
        }}
        defaultItemStyle={{
          textSize: 15,
          fontWeight: '500',
        }}
        selectedItemStyle={{
          textSize: 18,
          fontWeight: '600',
        }}
      />
    </MCModule>
  )
})
