import Virtual from './virtual'
import Store from './store'

(Virtual as any).Store = Store
import { withInstall } from '@utils/with-install'
export default withInstall(Virtual)
