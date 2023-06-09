const Components = require('../components.json')
const path = require('path')
const fs = require('fs')
const uppercamelcase = require('uppercamelcase')
const pkg = require('../../../package.json')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const OUTPUT_PATH = resolve('src/index.ts')

const importComponentTemplate = []
const installTemplate = []
const listTemplate = []
Object.keys(Components).forEach(name => {
  const componentName = uppercamelcase(name)
  const path = `@components/${name}`
  importComponentTemplate.push(
    `import ${componentName} from '${path}'`,
  )

  listTemplate.push(componentName)

  if (['message', 'notification', 'confirm'].includes(name)) {
    return
  }
  installTemplate.push(componentName)
})

const importStr = importComponentTemplate.join('\n')
// 为最后一行加上尾逗号，防止报错
const installStr = installTemplate.join(',\n  ') + ','
const listStr = listTemplate.join(',\n  ') + ','

const template = `/* Automatically generated by './generator/entry.js' */
import { App, install as installCompnents } from '@ss/mtd-adapter'

${importStr}
import { config } from '@components/config-provider'

const components: any[] = [ // eslint-disable-line
  ${installStr}
]

const $mtd = {
  confirm: Confirm,
  notify: Notification,
  message: Message,
}

export function install(app: App) {
  installCompnents(app as any, components, $mtd)
}

export {
  ${listStr}
}

export default {
  version: '${pkg.version}',
  install,
  config,
}
`
fs.writeFileSync(OUTPUT_PATH, template)
console.log('[build entry] DONE:', OUTPUT_PATH)
