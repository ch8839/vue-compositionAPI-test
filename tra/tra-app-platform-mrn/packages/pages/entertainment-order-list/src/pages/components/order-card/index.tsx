import React, { useCallback, useRef } from 'react'
import { View, Text, TouchableOpacity, Animated, PanResponder, Platform } from '@mrn/react-native'
import { observer, toJS } from '@nibfe/tra-app-platform-core'
import { Dialog } from '@nibfe/mrn-materials-lego'
import { CardBasicInfo } from './basic-info'

const isIos = Platform.OS === 'ios'

const OrderCardWrapper = observer((props) => {
  const pan = useRef(new Animated.ValueXY()).current;
  console.log('OrderCardWrapper: ', props);
  const WIDTH = 75;

  /**
   * @description: 执行动画修改 pan 的值
   * @param {number} num
   */
  const _startAnimated = num => {
    Animated.spring(pan, {
      toValue: num, // 设置动画的属性值
      useNativeDriver: true,
    }).start();
  };

  _startAnimated(0)

  const panResponder = useRef(
    PanResponder.create({
      // 这个API用来判断触发手势的时机
      onMoveShouldSetPanResponder: (event, gestureState) => {
        if (!isIos) return false; // 只有IOS下才有左滑手势
        if (gestureState.dx <= - 5 || gestureState.dx > 5) {
          // 这里IOS和安卓的手势逻辑不通，安卓不会冒泡
          return true
        } else {
          return false
        }
      },
      onPanResponderGrant: () => {
        // console.log('pan.x._value: ', pan.x);
      },
      onPanResponderMove: (event, gestureState) => {
        console.log('move: ', gestureState.dx);
        // 向右滑动
        if (gestureState.dx > 0) {
          _startAnimated(0);
        } else if(gestureState.dx <= - WIDTH) {
          // 向左滑动
          _startAnimated(- WIDTH);
        }
      },
      onPanResponderRelease: () => {}
    })
  ).current;

  return (
    <Animated.View
      style={[
        {
          backgroundColor: '#fff',
          marginBottom: 10,
          borderRadius: 7,
          minHeight: 100,
          position: 'relative',
          transform: [{ translateX: pan.x }]
        }
      ]}
      {...panResponder.panHandlers}
    >
      { props.children }
    </Animated.View>
  )
})

export const OrderCard = observer((props) => {
  console.log('props:OrderCard', props);

  return (
    <OrderCardWrapper>
      <CardBasicInfo {...props} />
      { // IOS下才有左滑删除
      isIos && <TouchableOpacity style={{
        position: 'absolute',
        right: -90,
        width: 75,
        minHeight:100,
        height: '100%',
        backgroundColor: '#EA4E3D',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      onPress={() => {
        props.showOrderDeleteDialog(props, props.index)
      }}
      >
        <Text 
          style={{
            color: '#ffffff',
            textAlign: 'center',
            includeFontPadding: false,
            textAlignVertical: 'center',
            fontSize: 15,
            fontWeight: '600'
          }}
        >删除</Text>
      </TouchableOpacity>}
    </OrderCardWrapper>
  )
})
