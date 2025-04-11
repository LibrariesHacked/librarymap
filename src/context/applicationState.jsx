import React, { createContext, useContext, useReducer } from 'react'

export const ApplicationStateContext = createContext()

const initialApplicationState = {
  services: [],
  serviceLookup: {},
  isochrones: {}
}

const applicationReducer = (state, action) => {
  const isochrones = state.isochrones
  let services = []
  let service = {}
  let serviceLookup = {}
  let serviceLookupInstance = {}
  switch (action.type) {
    case 'AddServices':
      return {
        ...state,
        services: action.services,
        serviceLookup: action.serviceLookup
      }
    case 'UpdateServiceGeo':
      services = state.services
      service = services.find(s => s.code === action.service.code)
      service.geojson = action.service.geojson
      service.bbox = action.service.bbox
      serviceLookup = state.serviceLookup
      serviceLookupInstance = serviceLookup[action.service.code]
      serviceLookupInstance.geojson = action.service.geojson
      serviceLookupInstance.bbox = action.service.bbox
      serviceLookup[action.service.code] = serviceLookupInstance
      return {
        ...state,
        service: services,
        serviceLookup
      }
    case 'AddIsochrone':
      if (!isochrones[action.point]) isochrones[action.point] = {}
      isochrones[action.point][action.transport] = action.isochrone
      console.log(isochrones)
      return {
        ...state,
        isochrones
      }
    case 'SetIsochroneDisplay':
      isochrones[action.point][action.transport].display = action.display
      return {
        ...state,
        isochrones
      }
    case 'SetIsochroneLoading':
      if (!isochrones[action.point]) isochrones[action.point] = {}
      isochrones[action.point][action.transport] = {
        geo: null,
        display: false,
        loading: true
      }
      return {
        ...state,
        isochrones
      }
    default:
      return state
  }
}

export const ApplicationStateProvider = ({ children }) => (
  <ApplicationStateContext.Provider
    value={useReducer(applicationReducer, initialApplicationState)}
  >
    {children}
  </ApplicationStateContext.Provider>
)

export const useApplicationStateValue = () =>
  useContext(ApplicationStateContext)
