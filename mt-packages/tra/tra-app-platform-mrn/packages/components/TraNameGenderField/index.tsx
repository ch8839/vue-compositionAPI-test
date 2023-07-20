import React, { useState } from 'react'
import { StyleSheet, TextInput, View, Text } from '@mrn/react-native'
import { MCModule } from '@nibfe/doraemon-practice'

import { observer } from '@nibfe/tra-app-platform-core'


import { List } from '../List'
import { Checkbox } from '../Checkbox/index'

const Item = List.ListItem
const styles = StyleSheet.create({
  input: {
    textAlignVertical: 'center',
    textAlign: 'right',
    fontSize: 15,
    height: 21,
    // 安卓下padding会有初始值，这里手动置为0，样式才可以和iOS一致
    padding: 0,
    margin: 0
  }
})

const TraNameGenderField = observer(props => {
  const {
    title = '姓名',
    value = '',
    placeholder = ''
  } = props
  const [textValue, setTextValue] = useState(value)
  const [isMale, setIsMale] = useState(true)

  function onInput(value) {
    setTextValue(value)
    props.onChange('name', { value })
  }
  function onCheckboxChange(status) {
    setIsMale(!isMale)
    props.onChange('gender', { value: {
      id: !isMale ? 1 : 2 // 1-女士 2-男士
    } })
  }
  return (
    <MCModule
      paddingHorizontal={0}
      gapTop={0}
      separatorLineStyle={{ display: 'hidden-all' }}
    >
      <Item 
      title={title}
      styles={{wrapper: {
        height: 53.5,
      }}} value={
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={styles.input}
            value={String(textValue)}
            placeholder={placeholder}
            placeholderTextColor={'#BBBBBB'}
            onChangeText={(val: string) => onInput(val)}
          />
          <View style={{marginLeft: 10, flexDirection: 'row', alignItems: 'center'}}>
            <Checkbox size={24} checked={isMale} canToggle={false} onChange={onCheckboxChange}/>
          </View>
          <View style={{ marginLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{ fontSize: 15 }}>先生</Text>
          </View>
          <View style={{marginLeft: 15, flexDirection: 'row', alignItems: 'center'}}>
            <Checkbox size={24} checked={!isMale} canToggle={false} onChange={onCheckboxChange}/>
          </View>
          <View style={{ marginLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{ fontSize: 15 }}>女士</Text>
          </View>
        </View>
      }>
      </Item>
    </MCModule>
  )
})

export default TraNameGenderField