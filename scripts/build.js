// call this with `node build.js`

const setup = require('./esbuild.setup')
const esbuild = require('esbuild')

// const DEBUG = process.env.NODE_ENV === 'development'

console.log('BUILDING SPA: running esbuild...')
esbuild.build(setup.esbuildOptions).then((data) => {
  console.log('BUILDING SPA: running esbuild... OK')
  setup.finalizeIndexHtml(data)
})
