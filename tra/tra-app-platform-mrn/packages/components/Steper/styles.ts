import { StyleSheet, ViewStyle, Platform } from '@mrn/react-native'
import { Theme } from '../common/styles/theme'

const sysname = Platform.OS
export type StepperStyles = ReturnType<typeof stepperStyles>

export const stepperStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: 98,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    } as ViewStyle,

    operationButton: {
      width: 27,
      height: 27,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
    },
    dpBorder: {
      borderColor: '#E1E1E1',
      borderWidth: 0.5
    },
    mtBorder: {
      borderColor: 'rgba(0,0,0,0.12)',
      borderWidth: 1
    },
    increaseInputBorder: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderLeftWidth: 0
    },
    decreaseInputBorder: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRightWidth: 0,
    },
    dpStyle: {
      borderRadius: 13,
      height: 26,
    },

    mtStyle: {
      borderRadius: 6,
      height: 30,
    },

    disabledStyle: {
      backgroundColor: theme.gray
    },

    rowLine: {
      width: 10.7,
      height: 2,
      backgroundColor: theme.white
    },

    columnLine: {
      width: 10.7,
      height: 2,
      transform: [{ rotate: '90deg' }],
      backgroundColor: theme.white
    },
    dpLine: {
      backgroundColor: '#FF6633'
    },
    mtLine: {
      backgroundColor: '#111111'
    },
    disabledLine: {
      backgroundColor: 'rgba(0,0,0,0.12)'
    },

    inputBox: {
      flex: 1,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      height: 30
    },

    input: {
      flex: 1,
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: sysname === 'ios' ? 17 : 13,
      color: theme.black,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 0,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 0,
      borderBottomWidth: 0,
    },
    disabledColor: {
      color: '#BBBBBB'
    },
    dpInputBox: {
      paddingVertical: 5,
      height: 26,
    }
  })