const cp = require('child_process');
const path = require('path')
const glob = require('glob')
const inquirer = require('inquirer')
const shell = require("shelljs");

const cwd = path.resolve(__dirname, '../')

console.log('cwd: ', cwd);

// 额外参数
const extraArgv = process.argv.slice(2)
console.log('extraArgv: ', extraArgv);

const PACKAGE_REG = `./packages/pages/*`
const PAGE_REG = '/src/pages/*'

/**
 * 获取命令行中指定路径参数
 * 支持 --pkg 和 --p
 * 两个都有时优先取第一个
 */
function getTargetPkg() {
  const argv = process.argv.slice(2)
  for (let i = 0; i < argv.length; i++) {
    const p = argv[i]
    const reg = /(?:--pkg=)([\s\S]+)/
    const res = p.match(reg)
    if (res) return res[1]
  }
}

/**
 * page 或者 pkg 的过滤函数
 * @param {*} paths : 所有检索到的路径
 * @param {*} userInput : 用户输入的路径 「,」号分隔
 * @returns 未改写的路径的过滤结果
 */
function pageAndPkgFilter(paths, userInput) {
  if (paths.length === 0) return []
  // 用户指定 page/pkg 入口的过滤
  if (userInput) {
    /**
     * 如果末尾有 , 则去除
     * 去除头尾空格
     */
    const inputArr = userInput
      .split(',')
      .filter(i => !!i)
      .map(i => i.trim())

    return inputArr.reduce((pre, cur) => {
      //  /${Name} 才是唯一识别的id
      const filters = paths.filter(p => p.indexOf(`/${cur}`) >= 0)
      const arr = pre.concat(filters)
      // 简单字符串去重
      return Array.from(new Set(arr))
    }, [])
  }
  return paths
}

/**
 * 获取当前项目下所有的 package/page  路径信息
 */
function getPackagePaths() {
  const paths = glob.sync(PACKAGE_REG, {
    cwd: process.cwd().replace(/\/packages\/[\s\S]*/, '')
  })
  console.log('paths: ', paths)
  // 绝对路径匹配时需要去掉相对路径的 ./
  const trans = p => p.replace(/\.[\\/]([\s\S]+)\/$/, '$1')
  let pkgPaths = paths.map(trans)
  // 建立 package 和 page 的映射关系
  let tree = {}
  paths.forEach(p => {
    // 组合 page 的路径匹配规则
    const pattern = p + PAGE_REG
    const key = trans(p)
    tree[key] = glob.sync(pattern)
  })
  // 用户指定 pkg 入口的过滤
  const targetPkg = getTargetPkg()
  pkgPaths = pageAndPkgFilter(pkgPaths, targetPkg)

  if (targetPkg) {
    console.log(targetPkg, ' 启用了 --pkg ');
  }

  return {
    isPackage: pkgPaths.length > 0,
    pkgPaths: pkgPaths || [],
    tree,
  }
}

const paths = getPackagePaths()
console.log('paths: ', paths);

const choicePaths = paths.pkgPaths.map(p => p.replace(/\.[\\/]/, ''))

const questions = [
  {
    type: 'list',
    name: 'pkg',
    message: '请选择要启动的 package :',
    choices: choicePaths,
  },
]

paths.pkgPaths.forEach(path => {
  cp.execSync(`cd ${path} && yarn`)
})
cp.execSync(`cd packages/components && node ../../node_modules/@nibfe/slink/bin/slink.js`)
cp.execSync(`cd packages/modules && node ../../node_modules/@nibfe/slink/bin/slink.js`)

inquirer.prompt(questions).then(res => {
  cp.exec(`cd ${res.pkg} && node node_modules/@nibfe/slink/bin/slink.js '@nibfe/tra-app-platform-mrn-components' '@nibfe/tra-app-platform-mrn-modules'`, (err, stdout, stderr) => {
    console.log(stdout);
  });
  // shell.exec(`cd ${res.pkg} && yarn start`)
  // cp.exec(`cd ${res.pkg} && node node_modules/@mrn/mrn-cli/bin/cli.js`)
})
