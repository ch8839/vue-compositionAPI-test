import React from 'react'
import { MCModule } from '@nibfe/doraemon-practice'
import { Text } from '@mrn/react-native'
import { Stepper } from '../Steper'
import { List } from '../List'

import { observer } from '@nibfe/tra-app-platform-core'

const Item = List.ListItem

const TraStepper = observer(props => {
  const { quantityConfig, submitFormChange, toMaxToastText, disabled, disabledText, readOnly } = props
  const { min, max, title, value } = quantityConfig

  return (
    <MCModule
      paddingHorizontal={0}
      gapTop={0}
      separatorLineStyle={{ display: 'hidden-all' }}
    >
      <Item
        styles={{
          wrapper: {
            height: 50
          }
        }}
        title={<Text style={{fontSize: 15}}>{title}</Text>}
        hasSeperatorLine={false}
        value={
          <Stepper
            max={max}
            min={min}
            value={value}
            onChange={idx => {
              submitFormChange('quantity', { value: idx })
            }}
            toMaxToastText={toMaxToastText}
            disabledText={disabledText}
            disabled={disabled}
            readOnly={readOnly}
          />
        }
      >
      </Item>
    </MCModule>
  )
})

export default TraStepper