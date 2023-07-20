import { ViewStyle, TextStyle } from '@mrn/react-native'

export default {
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f7f7f7'
  } as ViewStyle,
  header: {
    paddingHorizontal: 16,
    paddingTop: 20
  } as ViewStyle,
  headerText: {
    fontSize: 24,
    color: '#202325',
    fontFamily: 'PingFangSC-Medium',
    lineHeight: 33,
    letterSpacing: 0
  } as TextStyle,
  descriptionWrap: {
    marginTop: 8
  } as ViewStyle,
  description: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'PingFangSC-Regular',
    color: 'rgba(0, 0, 0, 0.6)',
    letterSpacing: 0
  } as ViewStyle,
  descriptionText: {} as TextStyle,
  block: {
    paddingHorizontal: 16,
    paddingTop: 32
  } as ViewStyle,
  blockTitle: {
    marginBottom: 8
  } as ViewStyle,
  blockTitleText: {
    fontSize: 18,
    color: 'rgba(0, 0, 0, 0.87)',
    lineHeight: 25,
    fontFamily: 'PingFangSC-Medium'
  } as TextStyle,
  blockTitleSubText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.87)',
    lineHeight: 25,
    fontFamily: 'PingFangSC-Medium',
    marginVertical: 8
  } as TextStyle,
  blockWrapper: {
    paddingHorizontal: 16
  } as ViewStyle,
  blockContent: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 10
  } as ViewStyle,
  container: {
    paddingTop: 32,
    marginHorizontal: 16
  } as ViewStyle,
  content: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 4
  } as ViewStyle,
  contentText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'PingFangSC-Medium',
    color: 'rgba(0, 0, 0, 0.6)'
  } as TextStyle,
  titleText: {
    fontSize: 12,
    color: '#666'
  } as TextStyle,
  blockRow: {
    marginHorizontal: 16,
    flexDirection: 'row',
    marginBottom: 10
  } as ViewStyle
}
