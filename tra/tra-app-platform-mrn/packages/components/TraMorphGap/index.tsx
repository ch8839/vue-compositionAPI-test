import React from 'react'
import { View, StyleSheet } from '@mrn/react-native'

// 最佳实践
import { MCModule } from '@nibfe/doraemon-practice'

const styles = StyleSheet.create({
  gap: {
    backgroundColor: '#f6f6f6',
    height: 10
  }
})

const TraMorphGap = () => {
  return (
    <MCModule paddingHorizontal={0} gapTop={0} separatorLineStyle={{display: 'hidden-all'}}>
      <View style={styles.gap} />
    </MCModule>
  )
}

export default TraMorphGap
