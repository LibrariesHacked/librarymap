import axios from 'axios'

const config = require('../helpers/config.json')

export class Service {
  constructor (obj) {
    Object.assign(this, obj)
  }

  fromJson (json) {
    this.code = json['code']
    this.name = json['name']
    this.niceName = json['nice_name']
    this.systemName = getServiceSystemName(json.name)
    this.geojson = json.geojson
    this.bbox = json.bbox

    return this
  }
}

export async function getServices () {
  const response = await axios.get(config.servicesApi)
  if (response && response.data && response.data.length > 0) {
    return response.data.map(s => new Service().fromJson(s))
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
