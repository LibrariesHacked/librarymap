import axios from 'axios'

const config = require('../helpers/config.json')

export class Service {
  constructor (obj) {
    Object.assign(this, obj)
  }

  fromJson (json) {
    this.code = json.code
    this.name = json.name
    this.niceName = json.nice_name
    this.systemName = getServiceSystemName(json.name)
    this.geojson =
      json.geojson && json.geojson !== '' ? JSON.parse(json.geojson) : null
    this.bbox =
      json.bbox && json.bbox !== '' ? JSON.parse(json.bbox) : null

    return this
  }
}

export class ServiceExtended {
  constructor (obj) {
    Object.assign(this, obj)
  }

  fromJson (json) {
    this.feesChargesUrl = json['Fees and charges URL']
    this.eventsUrl = json['Events URL']
    this.serviceUrl = json['Service URL']
    this.uLibraryName = json['uLibrary name']
    this.librariesUrl = json['Libraries URL']
    this.ebookUrl = json['Ebook URL']
    this.code = json.Code
    this.catalogueUrl = json['Catalogue URL']
    this.audiobookUrl = json['Audiobook URL']
    this.homeServiceUrl = json['Home service URL']
    this.greenLibrary = json['Green library'] && json['Green library'] === 'Yes'
    this.overdriveName = json['Overdrive name']
    this.childrensServiceUrl = json['Childrens service URL']
    this.instagramName = json['Instagram name']
    this.twitterHandle = json['Twitter handle']
    this.youTubeId = json['YouTube ID']
    this.name = json.Name
    this.facebookPageName = json['Facebook page name']
    this.onlineCatalogueSystem = json['Online catalogue system']
    this.libraryManagementSystemSupplier =
      json['Library management system supplier']
    this.childFine = json['Child fine']
    this.ebookInfoUrl = json['Ebook info URL']
    this.audiobookInfoUrl = json['Audiobook info URL']
    this.adultFine = json['Adult fine']
    this.libraryManagementSystem = json['Library management system']
    this.email = json.Email
    this.audiobookSupplier = json['Audiobook supplier']
    this.ulibraryOffer = json['uLibrary offer']
    this.fineInterval = json['Fine interval']
    this.rbdigitalName = json['RBDigital name']
    this.computerAccessUrl = json['Computer access URL']
    this.emagazinesInfoUrl = json['Emagazines info URL']
    this.newMemberUrl = json['New member URL']
    this.rbdigitalOffer = json['RBDigital offer']
    this.libraryNotification = json['Library notification']
    this.ebookSupplier = json['Ebook supplier']

    return this
  }
}

export async function getServices () {
  const response = await axios.get(config.servicesUrl)
  if (response && response.data && response.data.length > 0) {
    return response.data.map(s => new Service().fromJson(s))
  } else {
    return []
  }
}

export async function getServicesExtended () {
  const response = await axios.get(config.servicesExtendedUrl)
  if (response && response.data && response.data.length > 0) {
    return response.data.map(s => new ServiceExtended().fromJson(s))
  } else {
    return []
  }
}

export function getServiceSystemName (name) {
  return name.replace(/[. ,:-]+/g, '-').toLowerCase()
}

export async function getService (code) {
  const response = await axios.get(
    `${config.servicesUrl}/${code}?geo=true&bbox=true`
  )
  if (response && response.data) {
    return new Service().fromJson(response.data)
  } else {
    return null
  }
}
