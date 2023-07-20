const { prompt } = require('enquirer')
const path = require('path')
const fs = require('fs')
const camelCase = require('camelcase')
const ComponentsFile = require('../components.json')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const execSync = require('child_process').execSync

const namespace = 'mtd'
const themes = 'theme-chalk'
process.on('exit', () => {
  console.log()
})

function resolve (...dirs) {
  return path.join(__dirname, '..', ...dirs)
}

function saveFile (file, content) {
  const dir = path.dirname(file)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  fs.writeFileSync(file, content + '\n')
  console.log('create file: ', file, ' success')
}

function uppercamelcase () {
  const cased = camelCase.apply(camelCase, arguments)
  return cased.charAt(0).toUpperCase() + cased.slice(1)
}

async function askComponent () {
  const { componentName } = await prompt({
    type: 'input',
    name: 'componentName',
    message: '输入组件小写英文名，单词间使用 `-` 连接',
  })

  if (ComponentsFile[componentName]) {
    console.error(`${componentName} 已存在.`)
    process.exit(1)
  }

  const { chineseName } = await prompt({
    type: 'input',
    name: 'chineseName',
    message: '输入组件中文名',
  })
  return { componentName, chineseName }
}

async function createComponent () {
  const { componentName, chineseName } = await askComponent()

  const exportName = uppercamelcase(componentName)
  const componentClassName = `${namespace}-${componentName}`

  function resolvePackage (...dirs) {
    return resolve('src', componentName, ...dirs)
  }

  // 添加到 components.json
  ComponentsFile[componentName] = `components/${componentName}`
  saveFile(
    resolve('components.json'),
    JSON.stringify(ComponentsFile, null, '  '),
  )

  // 初始化组件相关文件
  const Files = [
    {
      file: resolvePackage('api.json'),
      content: JSON.stringify({
        'props': {
          'name': 'value',
          'desc': '输入框的内容',
          'type': 'string',
          'optionalValue': '',
          'default': '',
          'version': '',
        },
        'slots': [{
          'name': '示例',
          'desc': '-',
        }],
        'events': [{
          'name': '示例',
          'desc': '示例',
          'args': '(a: A, b: B)',
        }],
        'methods': [{
          'name': 'focus()',
          'desc': '示例',
          'args': '',
        }],
      }, null, '\t'),
    },
    {
      file: resolvePackage('index.md'),
      content: `# ${chineseName} / ${exportName}
## 基础样式


## 类型与用法


## API
<api-doc name="${exportName}" :doc="require('./api.json')"></api-doc>
`,
    },
    {
      file: resolvePackage('index.ts'),
      content: `import ${exportName} from './${componentName}'
import { withInstall } from '@utils/with-install'
export default withInstall(${exportName})`,
    },
    //     {
    //       file: resolvePackage('tests', `${componentName}.spec.js`),
    //       content: `import { mount } from '@tests/utils'
    // import ${exportName} from '../index'

    // describe('${exportName}', function () {
    //   it('create', () => {
    //     const wrapper = mount(${exportName})
    //     expect(wrapper.exists()).toBe(true)
    //   })
    // })`
    //     },
    {
      file: resolvePackage(`${componentName}.tsx`),
      content: `import {
  defineComponent,
  PropType,
  computed,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

export default defineComponent({
  name: '${uppercamelcase(componentClassName)}',
  inheritAttrs: true,
  props: {

  },
  emits: [],
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('${componentName}'))
    return {
      prefix,
    }
  },
  render () {
    const {
      prefix,
    } = this
    return <div></div>
  },
})
  `,
    },
    {
      file: resolve('src', themes, `${componentName}.scss`),
      content: `@import "./common/var.scss";
@import "./mixins/mixins.scss";

@include c(${componentName}){\n}`,
    },
  ]
  Files.forEach(file => {
    saveFile(file.file, file.content)
  })

  // create entry file
  require('./css')
  require('./entry')

  console.log('DONE!')
}

createComponent()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* function createNavConfig () {
  // 添加到 nav.config.json
  const navConfigFile = require('../../examples/nav.config.json')

  function findComponentConfig (navConfig) {
    return navConfig.find((nav) => nav.path === '/components')
  }

  const componentNavs = findComponentConfig(navConfigFile)
  // 添加到最后一个 group 中
  const { groups } = componentNavs
  groups[groups.length - 1].list.push({
    path: componentName,
    name: exportName,
    cnName: chineseName,
  })

  saveFile(
    resolve('examples/nav.config.json'),
    JSON.stringify(navConfigFile, null, '  '),
  )
} */
