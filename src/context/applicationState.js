import React, { createContext, useContext, useReducer } from 'react'

export const ApplicationStateContext = createContext()

const initialApplicationState = {
  services: [],
  serviceLookup: {},
  isochrones: {}
}

const applicationReducer = (state, action) => {
  const isochrones = state.isochrones
  switch (action.type) {
    case 'AddServices':
      return {
        ...state,
        services: action.services,
        serviceLookup: action.serviceLookup
      }
    case 'AddIsochrone':
      if (!isochrones[action.point]) isochrones[action.point] = {}
      isochrones[action.point][action.transport] = action.isochrone
      console.log(isochrones)
      return {
        ...state,
        isochrones: isochrones
      }
    case 'SetIsochroneDisplay':
      isochrones[action.point][action.transport].display = action.display
      return {
        ...state,
        isochrones: isochrones
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
        isochrones: isochrones
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
