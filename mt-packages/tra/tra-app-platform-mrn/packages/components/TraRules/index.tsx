import React from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback } from '@mrn/react-native'
import { MCModule } from '@nibfe/doraemon-practice'
import commonStyles from '../common/styles/default'
import { isDp } from '../utils'

import { observer } from '@nibfe/tra-app-platform-core'


const styles = StyleSheet.create({
  ruleWrapper: {
    paddingHorizontal: 15,
    paddingTop: 15
  },
  title: {
    fontSize: 15,
    color: commonStyles.black,
    marginBottom: 10
  },
  ruleList: {
    flexDirection: 'row',
    marginBottom: 6,
  },

  ruleItem: {
    fontSize: 12,
    marginLeft: 6,
  },

  dot: {
    width: 3,
    height: 3,
    backgroundColor: commonStyles.black,
    borderRadius: 1.5,
    alignSelf: 'flex-start',
    marginTop: 8.5, // 12 + (20-12)/2 - 3/2
  },

  itemText: {
    lineHeight: 20
  },

  strongText: {
    color: isDp ? '#FF6633' : '#FE8C00'
  }
})

const TraRules = observer(props => {
  const { rules } = props
  const { title = '', ruleList = [] } = rules

  return (
    <MCModule
      paddingHorizontal={0}
      gapTop={0}
      separatorLineStyle={{ display: 'hidden-all' }}
    > 
      <TouchableWithoutFeedback>
        <View style={styles.ruleWrapper}>
          <Text style={styles.title}>{title}</Text>
          {ruleList.map((line, lineIndex) => {
            return (
              <View key={lineIndex} style={styles.ruleList}>
                <View style={styles.dot} />
                <Text style={styles.ruleItem}>
                  {line.map((item, index) => {
                    return (
                      <Text
                        key={index}
                        numberOfLines={Number.MAX_VALUE}
                        style={[
                          styles.itemText,
                          item.strong && styles.strongText
                        ]}
                      >
                        {item.text}
                      </Text>
                    )
                  })}
                </Text>
              </View>
            )
          })}
        </View>
      </TouchableWithoutFeedback>
    </MCModule>
  )
})

export default TraRules