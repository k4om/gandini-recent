import path from 'node:path'
import { readdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

const METHODS = [
  'get',
  'post',
  'put',
  'patch',
  'delete'
]

function fileToRoute(filePath) {
  let route = filePath
    .replace(/\\/g, '/')
    .replace(/\.js$/, '')

  const parts = route.split('/')

  return parts
    .map(part => {
      if (part === 'index') return ''
      if (part.startsWith('[') && part.endsWith(']')) {
        return `:${part.slice(1, -1)}`
      }
      return part
    })
    .filter(Boolean)
    .join('/')
}

async function scan(dir, base = '') {
  const entries = await readdir(dir, {
    withFileTypes: true
  })

  let files = []

  for (const entry of entries) {
    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(
        ...(await scan(full, path.join(base, entry.name)))
      )
    } else {
      files.push({
        file: full,
        route: path.join(base, entry.name)
      })
    }
  }

  return files
}

async function load(fastify) {
  const apiDir = path.resolve('src/rest-api/endpoints')

  const files = await scan(apiDir)

  for (const item of files) {
    const filename = path.basename(item.file, '.js')

    const method = METHODS.find(m =>
      filename.endsWith(`.${m}`)
    )

    if (!method) continue

    const routeFile = item.route
      .replace(`.${method}`, '')

    const url = '/api/' + fileToRoute(routeFile)

    const module = await import(
      pathToFileURL(item.file)
    )

    const handler = module.default

    if (typeof handler !== 'function') {
      throw new Error(
        `${item.file} must export default function`
      )
    }

    fastify[method](
      url,
      handler
    )

    fastify.log.info(
      `API ${method.toUpperCase()} ${url}`
    )
  }
}

export default { load }