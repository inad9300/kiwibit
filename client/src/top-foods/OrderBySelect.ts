import { Select } from '../components/Select'

// TODO Find better name.
export function OrderBySelect() {
  const select = Select<{ text: string, value: 'weight' | 'energy' }>(
    'Per',
    o => o.value,
    o => o.text
  )

  select.setOptions([
    { text: '100 grams', value: 'weight' },
    { text: '100 calories', value: 'energy' }
  ])

  return select
}
