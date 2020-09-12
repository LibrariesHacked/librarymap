import axios from 'axios'

const config = require('../helpers/config.json')

export class Service {
  constructor (obj) {
    Object.assign(this, obj)
  }

  fromJson (json) {
    this.code = json.utla19cd
    this.name = json.utla19nm
    this.name_wales = json.utla19nmw
    this.geom = json.geom
    this.bbox = json.bbox

    return this
  }
}

export async function getServices () {
  const response = await axios.get(config.servicesApi)
  if (response && response.data && response.data.length > 0) {
    return response.data.map(s => (new Service()).fromJson(s))
  } else {
    return []
  }
}
