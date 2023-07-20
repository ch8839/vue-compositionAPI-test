'use strict'
const {merge} = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const path = require('path')
const fs = require('fs')
const Components = require('../components.json')
const config = require('../config')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

// components externals
const { fullName } = config
const externals = {}
Object.keys(Components).forEach((key) => {
  externals[`@components/${key}`] = `${fullName}/lib/${key}`
})

// src externals
const utilsList = fs.readdirSync(resolve('src/__utils__'))

const entry = {
  ...Components,
}

utilsList.forEach(function (file) {
  file = path.basename(file, '.ts')
  externals[`@utils/${file}`] = `${fullName}/lib/utils/${file}`
  entry[`utils/${file}`] = resolve(`src/__utils__/${file}`)
})

// webpack config
const base = { ...baseWebpackConfig, entry: entry }

module.exports = merge(base, {
  output: {
    libraryTarget: 'commonjs2',
  },
  externals: externals,
})
