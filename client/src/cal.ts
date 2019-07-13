export const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const usFmt = new Intl.DateTimeFormat('en-US', {weekday: 'long'})

export function currentWeekDay() {
    return usFmt.format(new Date().getDay())
}
