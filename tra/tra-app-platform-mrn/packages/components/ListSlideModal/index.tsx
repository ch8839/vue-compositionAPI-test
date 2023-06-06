import React from 'react'
import { Text, View, TouchableHighlight, TouchableOpacity, FlatList, Image } from '@mrn/react-native'
import { SlideModal } from '@nibfe/gc-ui'
import { getInset } from '@mrn/react-native-safe-area-view'
import { isDp } from '../utils'
const ListSlideModal = (props) => {
    const { data, showSlideModal, setShowSlideModal, renderItem, title, onClickConfirm, customContent=null} = props
    return (
      <SlideModal visible={showSlideModal} wrapperStyles={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: getInset('bottom'),
          height: 492
        }} header={
          <View style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            // height: 30,
            paddingTop: 15,
            paddingBottom: 20,
          }}>
            <Text style={{
              fontSize: 19,
              fontWeight: '500',
              color: '#111111',
              lineHeight: 26.5
            }}>{title}</Text>
            <TouchableHighlight style={{
              position: 'absolute',
              right: 20.25,
              top: 19.75,
              justifyContent: 'center',
              alignItems: 'center',
              width: 20,
              height: 20
            }} activeOpacity={1} underlayColor={'#FFFFFF'} onPress={
              ()=> { setShowSlideModal(false) }
            }>
              <Image style={{width: 9.5, height: 9.5}} source={{uri: 'https://p0.meituan.net/travelcube/426f762abc0ffd3c60f9d4012e487af8577.png'}} />
            </TouchableHighlight>
          </View>
        }
              modalProps={{
                onPressClose: () => {
                  setShowSlideModal(false)
                }
              }}>
              <View style={{ height: 400, flexDirection: 'column', alignContent: 'space-between'}}>
                  {customContent ? customContent : <FlatList
                        data={data}
                        renderItem={renderItem}
                  />}
                  <TouchableOpacity style={{paddingHorizontal: 15}} onPress={()=>{
                    onClickConfirm()
                  }}>
                    {
                      isDp ? (<View style={{justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: '#FF6633', height: 40}}>
                               <Text style={{color: '#FFFFFF', fontSize: 15, lineHeight: 21}}>确定</Text>
                             </View>)
                      :
                      (<View style={{justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#FF6633', height: 40}}>
                        <Text style={{color: '#FFFFFF', fontSize: 15, lineHeight: 21}}>确定</Text>
                      </View>)
                    }
                    
                  </TouchableOpacity>
              </View>
        </SlideModal>)
}
export default ListSlideModal