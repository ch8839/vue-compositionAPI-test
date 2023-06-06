import React from 'react'
import { env } from '@mrn/mrn-utils'
import {
  APPDP_THEME_GCUI,
  APPMT_THEME_GCUI,
  APPDP_THEME_MTD,
  APPMT_THEME_MTD,
  Provider as ThemeProvider,
} from '@nibfe/theme-provider-lighter'
import { MTDProvider } from '@ss/mtd-react-native'
import { RootStack } from './routers'

interface Props {
  mrn_component: string
  [key: string]: any
}

const isMt = env.appID === '10' || env.platform === 'mtmp'
console.log('env: ', env);

const App: React.FC<Props> = props => {
  const { mrn_component } = props
  global.query = props
  return (
    <ThemeProvider theme={(isMt ? APPMT_THEME_GCUI : APPDP_THEME_GCUI)}>
      <MTDProvider theme={(isMt ? APPMT_THEME_MTD : APPDP_THEME_MTD)}>
        <RootStack initialRouteName={mrn_component} screenProps={props} />
      </MTDProvider>
    </ThemeProvider>
  )
}

export default App
