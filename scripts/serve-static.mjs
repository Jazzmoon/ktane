// Zero-dependency static server for the emergency `dist/` build:
//   node scripts/serve-static.mjs [dir=dist] [port=4173]
// Any real static host (nginx, Caddy, S3, …) works just as well.
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'

const root = resolve(process.argv[2] ?? 'dist')
const port = Number(process.argv[3] ?? process.env.PORT ?? 4173)
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname)
  let file = normalize(join(root, path))
  if (file !== root && !file.startsWith(root + sep)) return res.writeHead(403).end()
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html')
    await stat(file)
  } catch {
    file = join(root, 'index.html') // single-page fallback
  }
  const immutable = file.startsWith(join(root, 'assets') + sep)
  res.writeHead(200, {
    'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
    'cache-control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
  })
  createReadStream(file).pipe(res)
}).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}`))
