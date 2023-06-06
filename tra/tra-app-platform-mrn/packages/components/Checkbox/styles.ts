import { StyleSheet, ViewStyle } from '@mrn/react-native'
export type CheckboxStyles = ReturnType<typeof checkboxStyles>

export const checkboxStyles = () =>
  StyleSheet.create({
    wrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    } as ViewStyle,

    iconItem: {} as ViewStyle,

    disabledWrapper: {} as ViewStyle,

    iconRight: {
      marginLeft: 8
    } as ViewStyle
  })
