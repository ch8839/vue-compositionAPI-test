import ConfigProvider from './config-provider'
import { withInstall } from '@utils/with-install'
import useConfig, { ConfigContext as Context } from './hooks'
import { config } from './config'

export type ConfigContext = Context

export { useConfig, config }
export default withInstall(ConfigProvider)
