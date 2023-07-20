import ConfigProvider from './config-provider'
import { withInstall } from '@utils/with-install'
import useConfig, { ConfigContext as Context } from './hooks'

export type ConfigContext = Context

export { useConfig }
export default withInstall(ConfigProvider)
