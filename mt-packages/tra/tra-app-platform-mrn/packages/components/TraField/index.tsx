import React, { useState, useRef } from 'react'
import { StyleSheet, TextInput, View, Text } from '@mrn/react-native'
import { MCModule } from '@nibfe/doraemon-practice'

import { observer } from '@nibfe/tra-app-platform-core'


import { List } from '../List'

const Item = List.ListItem


const styles = StyleSheet.create({
  input: {
    fontSize: 15,
    height: 21,
    padding: 0,
    margin: 0,
    marginTop: 4,
  }
})

const TraField = observer(props => {
  const textInputRef = useRef(null)
  const {
    traKey = 'remark',
    title = '备注',
    value = '',
    placeholder = ''
  } = props
  const [textValue, setTextValue] = useState(value)

  function onInput(value) {
    setTextValue(value)
    props.onChange(traKey, { value })
  }
  return (
    <MCModule
      paddingHorizontal={0}
      gapTop={0}
      separatorLineStyle={{ display: 'hidden-all' }}
    >
      <Item
        hasSeperatorLine={false}
        onClick={()=>{
          if(textInputRef?.current && !textInputRef?.current?.isFocused()) {
            textInputRef?.current?.focus()
          }
        }}
      >
        <View>
          <Text style={{ fontSize: 15, color: '#111111' }}>{title}</Text>
          <TextInput
            ref={textInputRef}
            style={styles.input}
            value={String(textValue)}
            placeholder={placeholder}
            onChangeText={(val: string) => onInput(val)}
            placeholderTextColor={'#BBBBBB'}
          />
        </View>
      </Item>
    </MCModule>
  )
})

export default TraField