const fs = require('fs')
const path = require('path')
const { execSync, spawn } = require('child_process')
const debounce = require('lodash.debounce')
const byline = require('byline')
const map = require('map-stream')

const srcPath = path.resolve(__dirname, path.join('..', 'src'))

pipe(spawn('npm', ['run', 'serve-docs']))
fs.watch(srcPath, debounce(() => {
  console.log('rebuilding docs...')
  execSync('npm run build-docs')

  pipe(spawn('npm', ['run', 'lint']))
}, 500))


function pipe (src) {
  noNpmErr(src.stdout).pipe(process.stdout)
  noNpmErr(src.stderr).pipe(process.stderr)
  return src
}

function noNpmErr (stream) {
  return byline(stream).pipe(map((line, cb) =>
   /^npm ERR\!/.test(line) ? cb(null, '') : cb(null, `${line}\n`)
  ))
}
