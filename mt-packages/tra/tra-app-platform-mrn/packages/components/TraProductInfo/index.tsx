import React from 'react'
import { View, Text, StyleSheet } from '@mrn/react-native'

// 最佳实践
import { MCModule } from '@nibfe/doraemon-practice'
import { List } from '../List'

const Item = List.ListItem

const styles = StyleSheet.create({
  shopName: {
    fontSize: 12,
    color: '#646464',
    marginBottom: 5,
    overflow: 'hidden'
  },

  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    lineHeight: 23,
    marginBottom: 5
  },

  productInfoAdd: {
    // marginTop: 6
  },

  productInfoAddItem: {
    flexDirection: 'row',
    fontSize: 12,
    color: '#111',
    lineHeight: 1
  },

  addText: {},

  split: {
    fontSize: 12,
    color: '#ddd',
    marginVertical: 0,
    marginHorizontal: 4
  }
})

const TraProductInfo = props => {
  const { shopInfo, productInfo } = props

  const shopName = shopInfo.shopBranchName
    ? `${shopInfo.shopName}(${shopInfo.shopBranchName})`
    : shopInfo.shopName

  const { productName, price, additional } = productInfo
  const displayPrice = price ? `¥${price}` : ''

  return (
    <MCModule
      paddingHorizontal={0}
      gapTop={0}
      separatorLineStyle={{ display: 'hidden-all' }}
    >
      <Item
        value={displayPrice}
        styles={{
          value: {
            fontSize: 17,
            fontWeight: 'bold',
            color: '#111',
            lineHeight: 23
          }
        }}
      >
        <Text style={styles.shopName}>{shopName || ''}</Text>
        <Text>123121232333</Text>
        <Text style={styles.productName}>{productName || ''}</Text>

        <View style={styles.productInfoAdd}>
          {additional.map(line => {
            return (
              <View style={styles.productInfoAddItem}>
                {line.map(content => {
                  return content.type == 'split' ? (
                    <Text style={styles.split}>|</Text>
                  ) : (
                    <Text style={styles.addText}>{content.text}</Text>
                  )
                })}
              </View>
            )
          })}
        </View>
      </Item>
    </MCModule>
  )
}

export default TraProductInfo
