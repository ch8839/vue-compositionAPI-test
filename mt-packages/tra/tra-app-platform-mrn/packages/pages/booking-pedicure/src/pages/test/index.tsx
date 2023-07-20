import React from 'react'

// 组件
import { View, Text } from '@mrn/react-native'

// 页面
const Page = props => {
  console.log('props: ', props)
  return (
    <View>
      <Text>测试一下get方法</Text>
      <Text>测试一下装饰器</Text>
    </View>
  )
}

export default Page
