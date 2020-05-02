import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { Client } from 'pg'
import { pgConfig } from './pgConfig'

const client = new Client(pgConfig)

client
  .connect()
  .then(async () => {
    const [foods, food_nutrients] = await Promise.all([
      client
        .query({
          rowMode: 'array',
          text: `select id, source_id, external_id, is_public, name, usda_category_id, nf_dd_category_id from foods limit 2`
        })
        .then(res => res.rows),
      client
        .query({
          rowMode: 'array',
          text: `select food_id, nutrient_id, amount from food_nutrients limit 2`
        })
        .then(res => res.rows)
    ])

    writeFileSync(
      resolve(__dirname, 'static-data.ts'),
      `export const foods = ${JSON.stringify(foods)}\n` +
      `export const food_nutrients = ${JSON.stringify(food_nutrients)}`
    )
  })
  .catch(err => console.error('Failed to query food data.', err))
  .finally(() => process.exit(0))
