import 'isomorphic-fetch'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getXataClient } from '../../_lib/xata.codegen'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const xata = getXataClient()
  const { filter, sort } = request.body ?? {}

  const hasFilter = !!filter
  const hasSort = !!sort

  if (request.method !== 'POST') {
    response.status(405).end('Only `POST` requests')
  }

  try {
    if (hasFilter && hasSort) {
      response.json(
        await xata.db.movies
          .filter(filter)
          .sort(sort.column, sort.direction)
          .getAll()
      )
    } else if (hasSort) {
      response.json(
        await xata.db.movies.sort(sort.column, sort.direction).getAll()
      )

      return
    } else if (hasFilter) {
      response.json(await xata.db.movies.filter(filter).getAll())

      return
    } else {
      response.json(await xata.db.movies.getAll())

      return
    }
  } catch (error) {
    response.status(400).json(error)

    return
  }
}
