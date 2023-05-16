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
    this.fees_and_charges_url = json['Fees and charges URL']
    this.events_url = json['Events URL']
    this.service_url = json['Service URL']
    this.ulibrary_name = json['uLibrary name']
    this.libraries_url = json['Libraries URL']
    this.ebook_url = json['Ebook URL']
    this.code = json['Code']
    this.catalogue_url = json['Catalogue URL']
    this.audiobook_url = json['Audiobook URL']
    this.home_service_url = json['Home service URL']
    this.green_library = json['Green library']
    this.overdrive_name = json['Overdrive name']
    this.childrens_service_url = json['Childrens service URL']
    this.twitter_handle = json['Twitter handle']
    this.name = json['Name']
    this.facebook_page_name = json['Facebook page name']
    this.online_catalogue_system = json['Online catalogue system']
    this.library_management_system_supplier =
      json['Library management system supplier']
    this.child_fine = json['Child fine']
    this.ebook_info_url = json['Ebook info URL']
    this.audiobook_info_url = json['Audiobook info URL']
    this.adult_fine = json['Adult fine']
    this.library_management_system = json['Library management system']
    this.email = json['Email']
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
  return name
    .split(', ')
    .reverse()
    .join(' ')
    .replace(/[. ,:-]+/g, '-')
    .toLowerCase()
}
