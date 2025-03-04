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
    throw {
      status: 405,
      message: 'Only `POST` requests',
    }
  }

  if (hasFilter && hasSort) {
    response.json(
      await xata.db.series
        .filter(filter)
        .sort(sort.column, sort.direction)
        .getAll()
    )

    return
  } else if (hasSort) {
    response.json(
      await xata.db.series.sort(sort.column, sort.direction).getAll()
    )
  } else if (hasFilter) {
    response.json(await xata.db.series.filter(filter).getAll())
  } else {
    response.json(await xata.db.series.getAll())
  }
}
