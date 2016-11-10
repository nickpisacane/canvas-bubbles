const fs = require('fs')
const path = require('path')
const { execSync, spawn } = require('child_process')
const debounce = require('lodash.debounce')

const srcPath = path.resolve(__dirname, path.join('..', 'src'))

fs.watch(srcPath, debounce(() => {
  console.log('rebuilding docs...')
  execSync('npm run build-docs')
}, 500))

spawn('npm', ['run', 'serve-docs'])
  .stdout.on('data', data => process.stdout.write(data))
