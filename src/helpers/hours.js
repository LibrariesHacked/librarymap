import moment from 'moment'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function getDayHours (place, day) {
  const staffedHours = (place[day + 'StaffedHours'] !== '' ? place[day + 'StaffedHours'] : null)
  const unstaffedHours = (place[day + 'UnstaffedHours'] !== '' ? place[day + 'UnstaffedHours'] : null)
  return { staffed: (staffedHours ? staffedHours.split(',').filter(h => h !== '00:00-00:00').map(h => h.split('-')) : null), unstaffed: (unstaffedHours ? unstaffedHours.split(',').filter(h => h !== '00:00-00:00').map(h => h.split('-')) : null) }
}

export function getTodayHours (place) {
  const day = moment().format('dddd').toLowerCase()
  return getDayHours(place, day)
}

export function getAllHours (place) {
  const weeklyHours = {}
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
