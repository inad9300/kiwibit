const msInOneDay = 24 * 60 * 60 * 1_000

// Source: https://stackoverflow.com/a/6117889/2018219
export function getWeekNumber(d: Date) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const msFromYearStart = d.getTime() - yearStart.getTime()
  const weekNo = Math.ceil((msFromYearStart / msInOneDay + 1) / 7)
  return [weekNo, d.getUTCFullYear()]
}
