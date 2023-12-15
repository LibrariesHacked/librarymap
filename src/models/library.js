import axios from 'axios'

import config from '../helpers/config.json'

const libraryTypes = {
  LAL: 'Local authority library',
  'LAL-': 'Local authority run - unstaffed',
  CL: 'Commissioned library',
  CRL: 'Community run library',
  ICL: 'Independent library',
  IL: 'Independent library'
}

export class Library {
  constructor (obj) {
    Object.assign(this, obj)
  }

  fromJson (json) {
    this.id = json.id
    this.localAuthority = json['Local authority']
    this.localAuthorityCode = json['Local authority code']
    this.name = json['Library name']
    this.address1 = json['Address 1']
    this.address2 = json['Address 2']
    this.address3 = json['Address 3']
    this.postcode = json.Postcode
    this.postcodeLongitude = json['Postcode longitude']
    this.postcodeLatitude = json['Postcode latitude']
    this.uprn = json['Unique property reference number']
    this.uprnLongitude = json['Unique property reference number longitude']
    this.uprnLongitude = json['Unique property reference number latitude']
    this.statutory = json.Statutory
    this.type = json['Type of library']
    this.typeDescription = libraryTypes[json['Type of library']]
    this.yearOpened = json['Year opened']
    this.yearClosed = json['Year closed']
    this.mondayStaffedHours = json['Monday staffed hours']
    this.tuesdayStaffedHours = json['Tuesday staffed hours']
    this.wednesdayStaffedHours = json['Wednesday staffed hours']
    this.thursdayStaffedHours = json['Thursday staffed hours']
    this.fridayStaffedHours = json['Friday staffed hours']
    this.saturdayStaffedHours = json['Saturday staffed hours']
    this.sundayStaffedHours = json['Sunday staffed hours']
    this.mondayUnstaffedHours = json['Monday unstaffed hours']
    this.tuesdayUnstaffedHours = json['Tuesday unstaffed hours']
    this.wednesdayUnstaffedHours = json['Wednesday unstaffed hours']
    this.thursdayUnstaffedHours = json['Thursday unstaffed hours']
    this.fridayUnstaffedHours = json['Friday unstaffed hours']
    this.saturdayUnstaffedHours = json['Saturday unstaffed hours']
    this.sundayUnstaffedHours = json['Sunday unstaffed hours']
    this.colocated = json['Co-located']
    this.colocatedWith = json['Co-located with']
    this.notes = json.Notes
    this.url = json.URL
    this.emailAddress = json['Email address']
    this.longitude = json.Longitude
    this.latitude = json.Latitude
    this.distance = json.distance
    this.systemName = getLibrarySystemName(json['Library name'])
    return this
  }
}

export async function getQueryLibraries (
  query,
  searchPosition,
  distance,
  serviceFilter,
  closed
) {
  let url = `${config.api}/libraries?page=${query.page + 1}&limit=${
    query.pageSize
  }&closed=${closed}`

  const sortMappings = {
    name: 'Library name',
    localAuthority: 'Local authority',
    address1: 'Address 1',
    postcode: 'Postcode',
    distance: 'distance'
  }

  if (query.orderBy && query.orderBy.field) {
    url = `${url}&sort=${sortMappings[query.orderBy.field]}&direction=${
      query.orderBy.direction
    }`
  }

  if (searchPosition && searchPosition.length > 1) {
    url = `${url}&longitude=${searchPosition[0]}&latitude=${searchPosition[1]}`
  }

  if (distance && distance !== '') url = `${url}&distance=${distance}`

  if (serviceFilter && serviceFilter.length > 0) {
    url = `${url}&service_codes=${serviceFilter.join('|')}`
  }

  const response = await axios.get(url)

  if (response && response.data && response.data.length > 0) {
    return {
      libraries: response.data.map(s => new Library().fromJson(s)),
      totalRowCount: parseInt(response.headers['x-total-count']),
      currentPage: parseInt(response.headers['x-page'])
    }
  } else {
    return { libraries: [], totalRowCount: 0, currentPage: 1 }
  }
}

export async function getAllLibraries () {
  const response = await axios.get(config.api + '/libraries')
  if (response && response.data && response.data.length > 0) {
    return response.data.map(s => new Library().fromJson(s))
  } else {
    return []
  }
}

export async function getLibraryById (id) {
  const response = await axios.get(config.api + '/libraries/' + id)
  if (response && response.data) {
    return new Library().fromJson(response.data)
  } else {
    return {}
  }
}

export function getLibrarySystemName (name) {
  return name.replace(/[. ,:-]+/g, '-').toLowerCase()
}

export async function getLibraryBySystemName (
  serviceSystemName,
  librarySystemName
) {
  const response = await axios.get(
    `${config.api}/libraries/${serviceSystemName}/${librarySystemName}`
  )
  if (response && response.data) {
    return new Library().fromJson(response.data)
  } else {
    return {}
  }
}
