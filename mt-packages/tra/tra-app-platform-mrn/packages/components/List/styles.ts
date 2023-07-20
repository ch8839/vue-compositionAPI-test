import { StyleSheet, ViewStyle, TextStyle } from '@mrn/react-native'
import { Theme } from '../common/styles/theme'

export type ListStyles = ReturnType<typeof listStyles>

export const listStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {} as ViewStyle,
    body: {
      backgroundColor: theme.white
    },

    item: {
      // flexGrow: 1,
      alignItems: 'center',
      flexDirection: 'row',
      paddingLeft: theme.spacingL,
      paddingRight: theme.spacingL,
      backgroundColor: theme.white,
    },

    line: {
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 14.5,
      paddingBottom: 14.5,
      borderBottomWidth: 0.5,
      borderBottomColor: '#EEEEF0'
    },
    // 取消下分割线
    noLine: {
      borderBottomWidth: 0,
    },

    title: {
      color: theme.black,
      fontSize: theme.fontSizeXl,
      // lineHeight: 24,
      // fontFamily: 'PingFangSC-Regular',
      textAlignVertical: 'center'
    } as TextStyle,

    value: {
      color: theme.black,
      fontSize: theme.fontSizeXl,
      textAlign: 'right',
      textAlignVertical: 'center'
    } as TextStyle,

    column: {
      // flex: 1,
      flexDirection: 'column',
      fontSize: 15
    },

    Arrow: {
      marginLeft: 5
    },

    underlayColor: {
      backgroundColor: theme.opacityColor
    }
  })