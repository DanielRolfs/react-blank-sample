// call this with `node start.js`

const setup = require('./esbuild.setup')
const esbuild = require('esbuild')

//const DEBUG = process.env.NODE_ENV === 'development'
const isInteractive = process.stdout.isTTY

const buildOptions = setup.esbuildOptions
buildOptions.entryNames = 'js/[name]'
buildOptions.assetNames = 'media/[name]'

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
const HOST = process.env.HOST || '0.0.0.0'

console.log('>>>>>>>>>>>>>< PORT', DEFAULT_PORT, HOST)

console.log('STARTING SPA on dev server...')
esbuild.serve({
  servedir: setup.buildDir,
  port: DEFAULT_PORT,
  host: HOST
}, setup.esbuildOptions).then((server) => {
  setup.finalizeIndexHtml({devServer: true})

  // The result tells us where esbuild's local server is
  // const {host, port} = server

  // Then start a proxy server on port 3000
  // const proxy = http.createServer((req, res) => {
  //   const options = {
  //     hostname: host,
  //     port: port,
  //     path: req.url,
  //     method: req.method,
  //     headers: req.headers,
  //   }

  //   // Forward each incoming request to esbuild
  //   const proxyReq = http.request(options, (proxyRes) => {
  //     // If esbuild returns "not found", send a custom 404 page
  //     if (proxyRes.statusCode === 404) {
  //       res.writeHead(404, { 'Content-Type': 'text/html' })
  //       res.end('<h1>A custom 404 page</h1>')
  //       return
  //     }
  //
  //     // Otherwise, forward the response from esbuild to the client
  //     res.writeHead(proxyRes.statusCode, proxyRes.headers)
  //     proxyRes.pipe(res, { end: true })
  //   })
  //
  //   // Forward the body of the request to esbuild
  //   req.pipe(proxyReq, { end: true })
  // }).listen(DEFAULT_PORT, HOST)
  console.log('STARTING SPA on dev server... RUNNING on', HOST, DEFAULT_PORT)

  const closeDown = function() {
    // proxy.close((error) => {
    //   console.log(error)
    // })
    server.stop()
    process.exit()
  };

  // Call "stop" on the web server when you're done
  ['SIGINT', 'SIGTERM'].forEach(function(sig) {
    process.on(sig, closeDown)
  })

  if (isInteractive || process.env.CI !== 'true') {
    // Gracefully exit when stdin ends
    process.stdin.on('end', closeDown)
    process.stdin.resume()
  }
}).catch((error) => {
  console.error(error)
  console.log('STARTING SPA on dev server... FAILED')
  process.exit(1)
})
