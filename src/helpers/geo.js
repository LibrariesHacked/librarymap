import axios from 'axios'

import * as turf from '@turf/turf'

import config from './config.json'

export const getPosition = (options = {}) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

export const getCurrentPosition = async () => {
  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }

  const position = await getPosition(options)
  return [
    parseFloat(position.coords.longitude),
    parseFloat(position.coords.latitude)
  ]
}

export const getCurrentPostcode = async location => {
  try {
    const response = await axios.get(
      `${config.postcodeApi}?lng=${location[0]}&lat=${location[1]}`
    )
    if (response.status === 200 && response.data) {
      return {
        location: [response.data.longitude, response.data.latitude],
        library_service_name: response.data.library_service_name,
        library_service: response.data.library_service,
        postcode: response.data.postcode
      }
    } else {
      return null
    }
  } catch {}
}

export const getPostcode = async postcode => {
  try {
    const response = await axios.get(`${config.postcodeApi}/${postcode}`)

    if (response.status === 200 && response.data) {
      return {
        location: [
          parseFloat(response.data.longitude),
          parseFloat(response.data.latitude)
        ],
        library_service_name: response.data.library_service_name,
        library_service: response.data.library_service,
        postcode: response.data.postcode
      }
    } else {
      return null
    }
  } catch {}
}

export const getServiceDataFromPostcode = async (postcode, services) => {
  const postcodeData = await getPostcode(postcode)
  const servicesFiltered = services.filter(
    s => s.Code === postcodeData.library_service
  )
  if (servicesFiltered.length > 0) {
    return { service: servicesFiltered[0], location: postcodeData.location }
  }
  return {}
}

export const validatePostcode = postcode => {
  return /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(postcode.trim())
}

export const getLineGeoJsonFromPoints = (points, properties) => {
  return {
    type: 'Feature',
    properties,
    geometry: {
      type: 'LineString',
      coordinates: points
    }
  }
}

export const getMaskFromGeoJson = geojson => {
  const poly = turf.polygon(geojson.coordinates)
  const worldMask = turf.polygon([
    [
      [-180, -90],
      [180, -90],
      [180, 90],
      [-180, 90],
      [-180, -90]
    ]
  ])
  return turf.mask(poly, worldMask)
}

export const getMapBounds = coordinates => {
  const features = turf.featureCollection(coordinates.map(c => turf.point(c)))
  return turf.bbox(features)
}

export const getBufferedPoint = (point, radius) => {
  const center = turf.point(point)
  const buffered = turf.buffer(center, radius, { units: 'meters' })
  return buffered.geometry
}
