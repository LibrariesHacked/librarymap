import axios from 'axios'

const config = require('../helpers/config.json')

export async function getServices () {
  const url = config.servicesApi
  const response = await axios.get(url)
  if (response && response.data) return response.data
  return []
}
