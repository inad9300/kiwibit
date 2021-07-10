import { createServer, IncomingMessage, ServerResponse } from 'http'
import { readFile } from 'fs'
import { resolve } from 'path'
import { URL } from 'url'
import { log } from './log'

import { findFoodDetails } from './api/findFoodDetails'
import { findFoodsByNameAndUsdaCategory } from './api/findFoodsByNameAndUsdaCategory'
import { getAllIntakeMetadataForNutrient } from './api/getAllIntakeMetadataForNutrient'
import { getAllNutrients } from './api/getAllNutrients'
import { getAllUsdaCategories } from './api/getAllUsdaCategories'
import { getIntakeMetadataForAllNutrients } from './api/getIntakeMetadataForAllNutrients'
import { getIntakeMetadataForNutrient } from './api/getIntakeMetadataForNutrient'
import { getTopFoodsForNutrient } from './api/getTopFoodsForNutrient'

export type Api = typeof api // FIXME Serialization will mess up with types!

const api = {
  findFoodDetails,
  findFoodsByNameAndUsdaCategory,
  getAllIntakeMetadataForNutrient,
  getAllNutrients,
  getAllUsdaCategories,
  getIntakeMetadataForAllNutrients,
  getIntakeMetadataForNutrient,
  getTopFoodsForNutrient,
}

process.on('uncaughtException', err => log.error('Uncaught exception.', err))
process.on('unhandledRejection', err => log.error('Unhandled rejection.', err))

const port = process.env.PORT || 4000
const serverRoot = resolve(__dirname, '../..')

createServer(serve)
  .listen(port, () => log.info(`Server up and running on port ${port}.`))
  .on('error', err => log.error('Server failed to start.', err))

function serve(req: IncomingMessage, res: ServerResponse) {
  req.on('error', err => {
    log.error('Unexpected request error.', err)
    reply(res, Error('Unexpected request error. ' + err.message))
  })

  const { method, url } = req
  if (method === 'GET') {
    log.info('GET', url)
    let { pathname } = new URL('http://localhost' + url!)
    if (pathname === '/')
      pathname = '/index.html'

    readFile(serverRoot + pathname, (err, data) => {
      if (err)
        reply(res, Error('File not found.'))
      else
        res.writeHead(200).end(data)
    })
  }
  else if (method === 'POST') {
    try {
      const fnName = url!.substr('/api/'.length) as keyof typeof api
      const fn = api[fnName] as ((payload: any) => Promise<any>) | undefined
      if (!fn) {
        reply(res, Error(`Unknown API function: "${fnName}".`))
      } else {
        const reqPayloadChunks: Uint8Array[] = []
        req
          .on('data', chunk => reqPayloadChunks.push(chunk))
          .on('end', () => {
            const reqPayload = reqPayloadChunks.length > 0
              ? JSON.parse(Buffer.concat(reqPayloadChunks).toString())
              : undefined
            log.info('POST', url, reqPayload)
            fn(reqPayload)
              .then(resPayload => reply(res, resPayload))
              .catch(err => reply(res, err))
          })
      }
    } catch (err) {
      reply(res, err)
    }
  }
  else {
    reply(res, Error(`Only GET and POST methods allowed. Request was: ${method} ${url}`))
  }
}

function reply(res: ServerResponse, payload: unknown | Error) {
  const isError = payload instanceof Error
  if (isError)
    log.warn('Error returned from API.', payload as Error)

  res
    .writeHead(isError ? 500 : 200, { 'Content-Type': 'application/json; charset=utf-8' })
    .end(JSON.stringify(isError ? { error: (payload as Error).message } : payload))
}
