const fs = require('fs')
const path = require('path')
const svgrPlugin = require('esbuild-plugin-svgr')
// const assetsManifest = require('esbuild-plugin-assets-manifest')
const replaceInFile = require('replace-in-file')
const _ = require('lodash')

const baseDir = process.cwd()
module.exports.buildIndexHtml = path.join(baseDir, 'build/index.html')
module.exports.publicDir = path.join(baseDir, 'public')
module.exports.buildDir = path.join(baseDir, 'build')

const DEBUG = process.env.NODE_ENV === 'development' || true
const args = process.argv
module.exports.WATCH = args.includes('--watch') || args.includes('-w')
if (DEBUG) {
  console.log('======== DEBUG   DEBUG   DEBUG   DEBUG   DEBUG ========')
}

module.exports.esbuildOptions = {
  tsconfig: path.join(baseDir, 'tsconfig.json'),
  entryPoints: [
    path.join(baseDir, 'src', 'index.tsx'),
  ],
  entryNames: 'js/[name].[hash]',
  assetNames: 'media/[name].[hash]',
  bundle: true,
  outdir: this.buildDir,
  outbase: 'src',
  define: {
    ESBUILD_DEBUG: DEBUG
  },
  minify: DEBUG === false,
  sourcemap: DEBUG === true,
  // target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  loader: {
    '.js': 'jsx',
    '.png': 'file',
    '.jpg': 'file',
    '.woff': 'file',
    '.eot': 'file',
  },
  metafile: true,
//  publicPath: '/static/',
  plugins: [
    svgrPlugin(),
    // assetsManifest({
    //   filename: 'manifest.json',
    //   path: 'build'
    // })
  ],
}

module.exports.finalizeIndexHtml = function(buildData) {
  console.log('BUILDING SPA: copying ./public/* to build output...')
  fs.cpSync(this.publicDir, this.buildDir, {
    dereference: true,
    recursive: true
  })
  console.log('BUILDING SPA: copying ./public/* to build output... OK')

  let publicURL = process.env.PUBLIC_URL || ''
  let indexJsName = ''
  if (buildData.devServer) {
    indexJsName = 'js/index.js'
  } else {
    const outputs = buildData.metafile.outputs
    _.each(outputs, (val, key) => {
      if (key.indexOf('index.') >= 0) {
        if (key.endsWith('.js')) {
          indexJsName = key.replace('build/', '')
        }
      }
    })
    if (indexJsName === '') {
      console.error('esbuild: Failed to find index.js in metafile output', outputs)
      throw Error()
    }
  }

  console.log('BUILDING SPA: update index.js reference in build/index.html...', indexJsName)
  replaceInFile({
    files: this.buildIndexHtml,
    from: [/%PUBLIC_URL%/g, /index.js/g],
    to: [publicURL, indexJsName],
  })
    .then((results) => {
      console.log('replaceInFile: Replaced', publicURL, indexJsName)
      console.log('BUILDING SPA: update index.js reference in build/index.html... OK')
    })
    .catch((error) => {
      console.error('replaceInFile: Error occurred:', error)
      console.log('BUILDING SPA: update index.js reference in build/index.html... FAILED')
    })
}

