export function getDatePartAsString(d: Date) {
  return d.toISOString().split('T')[0]
}
