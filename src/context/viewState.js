import React, { createContext, useContext, useReducer } from 'react'

export const ViewStateContext = createContext()

const initialViewState = {
  notificationOpen: false,
  notificationMessage: '',
  mapZoom: 7,
  mapPosition: [-1.155414, 52.691432],
  mapFlyToPosition: null,
  mapBounds: null,
  mapSettings: {
    libraries: true,
    mobileLibraryStops: true,
    authorityBoundary: false
  },
  mapSettingsDialogOpen: false,
  libraryDialogOpen: false,
  stopDialogOpen: false,
  locationAccessed: false,
  loadingLocation: false,
  loadingPostcode: false,
  loadingServices: false,
  loadingLibraryOrMobileLibrary: false,
  isochronesMenuOpen: false,
  isochronesMenuAnchor: null
}

const viewReducer = (state, action) => {
  switch (action.type) {
    case 'SetNotificationMessage':
      return { ...state, notificationMessage: action.notificationMessage }
    case 'SetNotification':
      return { ...state, notificationOpen: action.notificationOpen }
    case 'ShowNotification':
      return {
        ...state,
        notificationOpen: true,
        notificationMessage: action.notificationMessage
      }
    case 'SetStopDialog':
      return { ...state, stopDialogOpen: action.stopDialogOpen }
    case 'SetLibraryDialog':
      return { ...state, libraryDialogOpen: action.libraryDialogOpen }
    case 'SetMapSettingsDialog':
      return { ...state, mapSettingsDialogOpen: action.mapSettingsDialogOpen }
    case 'ToggleMapSetting': {
      const settings = state.mapSettings
      settings[action.mapSetting] = !settings[action.mapSetting]
      return { ...state, mapSettings: settings }
    }
    case 'FitToBounds': {
      return { ...state, mapBounds: action.mapBounds }
    }
    case 'FlyTo': {
      return {
        ...state,
        mapFlyToPosition: action.mapFlyToPosition,
        mapZoom: action.mapZoom
      }
    }
    case 'ToggleLoadingPostcode': {
      return { ...state, loadingPostcode: !state.loadingPostcode }
    }
    case 'ToggleLoadingServices': {
      return { ...state, loadingServices: !state.loadingServices }
    }
    case 'ToggleLoadingLocation': {
      return { ...state, loadingLocation: !state.loadingLocation }
    }
    case 'SetLocationAccessed': {
      return { ...state, locationAccessed: action.locationAccessed }
    }
    case 'ToggleLoadingLibraryOrMobileLibrary': {
      return {
        ...state,
        loadingLibraryOrMobileLibrary: !state.loadingLibraryOrMobileLibrary
      }
    }
    case 'SetPostcodeSearch':
      return {
        ...state,
        loadingPostcode: false,
        mapPosition: action.mapPosition,
        mapZoom: 13
      }
    case 'SetMapPosition':
      return {
        ...state,
        mapPosition: action.mapPosition,
        mapZoom: action.mapZoom
      }
    case 'SetIsochronesMenu':
      return {
        ...state,
        isochronesMenuOpen: action.isochronesMenuOpen,
        isochronesMenuAnchor: action.isochronesMenuAnchor
      }
    default:
      return state
  }
}

export const ViewStateProvider = ({ children }) => (
  <ViewStateContext.Provider value={useReducer(viewReducer, initialViewState)}>
    {children}
  </ViewStateContext.Provider>
)

export const useViewStateValue = () => useContext(ViewStateContext)
