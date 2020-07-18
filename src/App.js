import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'

import blueGrey from '@material-ui/core/colors/blueGrey'
import deepOrange from '@material-ui/core/colors/deepOrange'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import { ApplicationStateProvider } from './context/applicationState'
import { SearchStateProvider } from './context/searchState'
import { ViewStateProvider } from './context/viewState'

import LibraryMapApplication from './LibraryMapApplication'

const initialApplicationState = {

}

const applicationReducer = (state, action) => {
  switch (action.type) {
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
  currentLibraryId: null
}

const searchReducer = (state, action) => {
  switch (action.type) {
    case 'SetCurrentStop':
      return {
        ...state,
        currentStopId: action.stopId
      }
    case 'SetCurrentLibrary':
      return {
        ...state,
        currentLibraryId: action.libraryId
      }
    case 'SetSearchDistance':
      return {
        ...state,
        searchDistance: action.searchDistance
      }
    case 'SetPostcodeSearch':
      return {
        ...state,
        searchPostcode: action.searchPostcode,
        searchPosition: action.searchPosition,
        searchType: 'postcode'
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
  mapSettings: {
    authorityBoundary: false
  },
  mapSettingsDialogOpen: false,
  libraryDialogOpen: false,
  stopDialogOpen: false,
  loadingPostcode: false
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
    case 'SetPostcodeSearch':
      return { ...state, loadingPostcode: false, mapPosition: action.mapPosition, mapZoom: [13] }
    case 'SetMapPosition':
      return { ...state, mapPosition: action.mapPosition, mapZoom: [action.mapZoom] }
    default:
      return state
  }
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: deepOrange[800]
    },
    secondary: {
      main: blueGrey[700]
    }
  },
  overrides: {
    MuiButton: {
      text: {
        textTransform: 'none'
      }
    },
    MuiTab: {
      root: {
        textTransform: 'none'
      }
    },
    MuiTableCell: {
      root: {
        borderBottom: 'none'
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
