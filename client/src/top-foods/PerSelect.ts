import { Select } from '../components/Select'

export function PerSelect() {
  return Select<{ text: string, value: 'weight' | 'energy' }>(
    'Per',
    o => o.value,
    o => o.text
  )
  .with(it => {
    it.setOptions([
      { text: '100 grams', value: 'weight' },
      { text: '100 calories', value: 'energy' }
    ])
  })
}
