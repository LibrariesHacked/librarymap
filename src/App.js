import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'

import blueGrey from '@material-ui/core/colors/blueGrey'
import orange from '@material-ui/core/colors/orange'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import { ApplicationStateProvider } from './context/applicationState'
import { SearchStateProvider } from './context/searchState'
import { ViewStateProvider } from './context/viewState'

import LibraryMapApplication from './LibraryMapApplication'

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
      isochrones[action.point][action.transport] = { geo: null, display: false, loading: true }
      return {
        ...state,
        isochrones: isochrones
      }
    default:
      return state
  }
}

const initialSearchState = {
  searchPostcode: '',
  searchType: '',
  searchDistance: 1609,
  searchPosition: [],
  currentStopId: null,
  currentLibraryId: null,
  currentPoint: [],
  serviceFilter: [],
  serviceFilterBbox: null,
  serviceFilterBoundary: null,
  currentService: null,
  currentServiceSystemName: null
}

const searchReducer = (state, action) => {
  switch (action.type) {
    case 'SetCurrentStop':
      return {
        ...state,
        currentStopId: action.currentStopId,
        currentPoint: action.currentPoint
      }
    case 'SetCurrentLibrary':
      return {
        ...state,
        currentLibraryId: action.currentLibraryId,
        currentPoint: action.currentPoint
      }
    case 'SetSearchDistance':
      return {
        ...state,
        searchDistance: action.searchDistance
      }
    case 'SetPostcodeSearch':
      return {
        ...state,
        serviceFilter: [],
        currentService: null,
        currentServiceSystemName: null,
        searchPostcode: action.searchPostcode,
        searchPosition: action.searchPosition,
        searchType: 'postcode'
      }
    case 'FilterByService':
      return {
        ...state,
        serviceFilter: [action.service.code],
        currentService: action.service,
        currentServiceSystemName: action.service.systemName,
        searchPostcode: '',
        searchPosition: [],
        searchType: 'service'
      }
    case 'ClearAll':
      return {
        ...state,
        serviceFilter: [],
        currentService: null,
        currentServiceSystemName: null,
        searchPostcode: '',
        searchPosition: [],
        searchType: ''
      }
    default:
      return state
  }
}

const initialViewState = {
  notificationOpen: false,
  notificationMessage: '',
  mapZoom: [7],
  mapPosition: [-1.155414, 52.691432],
  mapBounds: null,
  mapSettings: {
    libraries: true,
    mobileLibraryStops: true,
    authorityBoundary: false
  },
  mapSettingsDialogOpen: false,
  libraryDialogOpen: false,
  stopDialogOpen: false,
  loadingPostcode: false,
  loadingServices: false,
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
      return { ...state, notificationOpen: true, notificationMessage: action.notificationMessage }
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
      return { ...state, mapBounds: action.bounds }
    }
    case 'ToggleLoadingPostcode': {
      return { ...state, loadingPostcode: !state.loadingPostcode }
    }
    case 'ToggleLoadingServices': {
      return { ...state, loadingServices: !state.loadingServices }
    }
    case 'SetPostcodeSearch':
      return { ...state, loadingPostcode: false, mapPosition: action.mapPosition, mapZoom: [13] }
    case 'SetMapPosition':
      return { ...state, mapPosition: action.mapPosition, mapZoom: [action.mapZoom] }
    case 'SetIsochronesMenu':
      return { ...state, isochronesMenuOpen: action.isochronesMenuOpen, isochronesMenuAnchor: action.isochronesMenuAnchor }
    default:
      return state
  }
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: orange[900]
    },
    secondary: {
      main: blueGrey[600]
    },
    outline: {
      main: blueGrey[50]
    }
  },
  overrides: {
    MuiButton: {
      text: {
        textTransform: 'none'
      },
      root: {
        textTransform: 'none'
      }
    },
    MuiTypography: {
      button: {
        textTransform: 'none'
      }
    },
    MuiTab: {
      root: {
        textTransform: 'none'
      }
    }
  }
})

function App () {
  return (
    <ApplicationStateProvider initialState={initialApplicationState} reducer={applicationReducer}>
      <SearchStateProvider initialState={initialSearchState} reducer={searchReducer}>
        <ViewStateProvider initialState={initialViewState} reducer={viewReducer}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LibraryMapApplication />
          </ThemeProvider>
        </ViewStateProvider>
      </SearchStateProvider>
    </ApplicationStateProvider>
  )
}

export default App
