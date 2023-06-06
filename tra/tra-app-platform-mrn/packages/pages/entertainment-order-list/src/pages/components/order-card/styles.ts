import { StyleSheet } from '@mrn/react-native'

export const styles = StyleSheet.create({
  centerWrapperStyle: {
    flexDirection: 'row',
    alignItems:'center',
  },
  iconStyle: {
    width: 18,
    height: 18,
  },
  textStyle: {
    fontWeight: '400',
    fontSize: 13,
    color: 'rgba(0,0,0,0.90)'
  },
  lightText: {
    color: 'rgba(0,0,0,0.50)'
  },
  smallText: {
    fontSize: 12,
  },
  boldText: {
    fontWeight: '600',
  },
  imgWrapperStyle: {
    width: 60,
    height: 60,
    borderRadius: 3,
    overflow: 'hidden',
  },
  imgStyle: {
    resizeMode: 'contain',
  },
  moduleSplitterStyle: {
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginTop: 12
  },
  moduleWrapperStyle: {
    marginBottom: 12,
  },
  marginRight: {
    marginRight: 8,
  },
  smallMarginRight: {
    marginRight: 4,
  },
  marginBottom: {
    marginBottom: 8,
  },
  smallMarginBottom: {
    marginBottom: 6,
  },
})
