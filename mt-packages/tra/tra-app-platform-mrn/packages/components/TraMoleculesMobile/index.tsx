import React, { useState, useContext, useRef, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TextStyle,
  Image,
  Keyboard,
  Platform
} from '@mrn/react-native'
import { MCModule } from '@nibfe/doraemon-practice'
import { openUrl } from '@mrn/mrn-utils'

import { isDp } from '../utils'
import { ThemeContext } from '../common/styles/theme'

import { Checkbox } from '../Checkbox'
import { List } from '../List'

import { observer } from '@nibfe/tra-app-platform-core'

const Item = List.ListItem

const TraMoleculesMobile = observer(props => {
  const textInputRef = useRef(null)
  const context = useContext(ThemeContext)
  const styles = StyleSheet.create({
    mobileProtectionWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      // marginBottom: 4
    },
    mobileProtectionTitle: {
      fontSize: 15,
      color: '#111111'
    },
    mobileProtectionDesc: {
      color: context.theme.grayDeeep,
      fontSize: context.theme.fontSizeS,
      lineHeight: 18
    } as TextStyle
  })

  const { value, masked, virtualNumber, useVirtualNumber, phoneInputBoxModuleClick } = props
  // 未加密的手机号码
  let unMaskedValue = value
  // 初始化时把手机号中间4位加密
  let formatValue = maskPhoneNum(masked, value)
  const [currentValue, setCurrentValue] = useState(formatValue)

  function format(value: string) {
    let valStr = value.toString()
    if (!valStr || valStr.length < 7) return value
    return `${valStr.slice(0, 3)}****${valStr.slice(7, 11)}`
  }

  function maskPhoneNum(masked, val) {
    return masked ? format(val) : val
  } 
  function goVirtualNumberDetail() {
    const url = isDp
      ? 'https://m.dianping.com/awp/hfe/block/5b7925ea285c/116556/index.html'
      : 'https://i.meituan.com/awp/hfe/block/5b7925ea285c/116556/index.html'
    openUrl(url)
    if (props.goVirtualNumberDetailModuleClick) {
      props.goVirtualNumberDetailModuleClick()
    }
  }

  function onInput(val) {
    setCurrentValue(val)
  }
  // 解决了安卓隐藏“数字”键盘后
  // 1.输入框没有失去焦点的问题。
  // 2.再次点击输入框没有再次弹出键盘的问题。
  // 详情见：https://github.com/facebook/react-native/issues/30746
  Platform.OS === 'android' && useEffect(() => {
    const keyboardListener = Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss();
    });

    return () => {
      keyboardListener.remove();
    };
  }, []);
  return (
    <MCModule
      paddingHorizontal={0}
      gapTop={0}
      separatorLineStyle={{ display: 'hidden-all' }}
    >
      <Item
        title={"手机号码"}
        styles={{wrapper: {
          height: 50
        }}}
        onClick={()=>{
          if(textInputRef?.current && !textInputRef?.current?.isFocused()) {
            textInputRef?.current?.focus()
          }
        }}
        value={
            <TextInput
              // 注意：安卓会有额外的padding，必须手动将padding置为0
              ref={textInputRef}
              style={{padding: 0, color: '#111111', fontSize: 15}}
              returnKeyType='done'
              value={String(currentValue)}
              keyboardType="numeric"
              onChangeText={(val: string | number) => onInput(val as any)}
              onFocus={()=>{
                // 输入框获得焦点时，展示真实号码
                setCurrentValue(unMaskedValue)
                phoneInputBoxModuleClick()
              }}
              onBlur={()=>{
                // 输入框失焦时，重新把手机号中间4位加密
                unMaskedValue = currentValue
                let formatValue = maskPhoneNum(masked, currentValue)
                setCurrentValue(formatValue)
                props.onBlur(currentValue) 
              }}
            />
        }
      />
      {virtualNumber && (
        <Item
          styles={{wrapper: {height: 91.5}}}
          multipleLine
          align="top"
          value={
            useVirtualNumber == undefined ? null : (
              <Checkbox
                size={24}
                checked={useVirtualNumber}
                onChange={value => props.toggleProtect(value)}
              />
            )
          }
        >
          <TouchableOpacity style={styles.mobileProtectionWrapper} onPress={() => goVirtualNumberDetail()}>
            <Text style={styles.mobileProtectionTitle}>号码保护中</Text>
            <Image style={{width: 14.5, height: 14.5, marginLeft: 5}} source={{uri: 'https://p1.meituan.net/travelcube/ab9dad4846e6263bee21500980a0cb841770.png'}}/>
          </TouchableOpacity>
          <View style={{ 
            marginTop: 4
            }}>
            <Text style={styles.mobileProtectionDesc}>
              对商家隐藏您的真实手机号，保护您的隐私。
            </Text>
            <Text style={styles.mobileProtectionDesc}>
              为保障服务质量，开启号码保护后您的通话可能会被录音。
            </Text>
          </View>
        </Item>
      )}
    </MCModule>
  )
})

export default TraMoleculesMobile