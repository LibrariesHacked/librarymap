import moment from 'moment'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function getDayHours (place, day) {
  const dayProp = day.toLowerCase()
  const staffedHours = (place[dayProp + 'StaffedHours'] !== '' ? place[dayProp + 'StaffedHours'] : null)
  const unstaffedHours = (place[dayProp + 'UnstaffedHours'] !== '' ? place[dayProp + 'UnstaffedHours'] : null)
  return { day: day, staffed: (staffedHours ? staffedHours.split(',').map(h => h.split('-')) : null), unstaffed: (unstaffedHours ? unstaffedHours.split(',').map(h => h.split('-')) : null) }
}

export function getTodayHours (place) {
  const day = moment().format('dddd').toLowerCase()
  return getDayHours(place, day)
}

export function getAllHours (place) {
  const weeklyHours = []
  days.forEach(day => {
    weeklyHours.push(getDayHours(place, day))
  })
  return weeklyHours
}

export function getCurrentlyOpen (place) {
  const now = moment()
  const day = now.format('dddd').toLowerCase()
  const hours = place[day + 'StaffedHours']
  let open = false
  if (hours) {
    hours.split(',').forEach(entry => {
      const start = entry[0]
      const end = entry[1]
      if (now.isBetween(moment(start), moment(end))) open = true
    })
  }
  return open
}
