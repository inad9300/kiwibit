const daysArr = [1, 2, 3, 4, 5, 6, 7]
const msInOneDay = 24 * 60 * 60 * 1_000

export function getWeekDays(refDate: Date) {
  const refTime = refDate.getTime()
  const refDay = refDate.getDay() || 7
  return daysArr.map(d =>
    new Date(refTime - ((refDay - d) * msInOneDay))
  )
}
