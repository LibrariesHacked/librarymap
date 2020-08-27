import moment from 'moment'

export function getTodayHours (place) {
  const day = moment().format('dddd').toLowerCase()
  const hours = place[day + 'StaffedHours']
  return hours ? hours.split(',') : []
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
