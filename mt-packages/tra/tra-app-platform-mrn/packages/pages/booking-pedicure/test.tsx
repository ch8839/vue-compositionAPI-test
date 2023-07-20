import React from 'react'
import { Button, View, Text, StyleSheet, TouchableOpacity } from '@mrn/react-native'
import { pageRouterClose } from '@mrn/mrn-utils'

const styles = StyleSheet.create({
  root: {
    flex:1,
    backgroundColor:'transparent',//业务页面透明
    alignItems: 'center',// 内容居中
    justifyContent: 'center'
  },
  container: {
    width:200,//弹框样式的大小
    height:200,
    borderRadius:10,//弹框圆角
    borderWidth:1,
    backgroundColor: '#fff',//弹框背景色
    alignItems: 'center',
    justifyContent: 'center'
  }
})
export default class App extends React.Component {
  render() {
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => pageRouterClose()}>
            <Text>Clicked: 1 times</Text>
          </TouchableOpacity>
          <Text>Clicked: 2 times</Text>
          <Text>Clicked: 3 times</Text>
          <Text>Clicked: 4 times</Text>
        </View>
      </View>
    )
  }
}
