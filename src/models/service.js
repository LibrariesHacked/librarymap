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
    this.geojson = json.geojson
    this.bbox = json.bbox

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
    this.greenLibrary = json['Green library']
    this.overdrive_name = json['Overdrive name']
    this.childrenServiceUrl = json['Childrens service URL']
    this.twitterHandle = json['Twitter handle']
    this.name = json.Name
    this.facebook_page_name = json['Facebook page name']
    this.online_catalogue_system = json['Online catalogue system']
    this.library_management_system_supplier =
      json['Library management system supplier']
    this.child_fine = json['Child fine']
    this.ebook_info_url = json['Ebook info URL']
    this.audiobook_info_url = json['Audiobook info URL']
    this.adult_fine = json['Adult fine']
    this.library_management_system = json['Library management system']
    this.email = json.Email
    this.audiobook_supplier = json['Audiobook supplier']
    this.ulibrary_offer = json['uLibrary offer']
    this.fine_interval = json['Fine interval']
    this.rbdigital_name = json['RBDigital name']
    this.computer_access_url = json['Computer access URL']
    this.emagazines_info_url = json['Emagazines info URL']
    this.new_member_url = json['New member URL']
    this.rbdigital_offer = json['RBDigital offer']
    this.library_notification = json['Library notification']
    this.ebook_supplier = json['Ebook supplier']

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
