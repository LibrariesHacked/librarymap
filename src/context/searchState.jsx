import React, { createContext, useContext, useReducer } from 'react'

export const SearchStateContext = createContext()

const initialSearchState = {
  searchPostcode: '',
  searchType: '',
  nearestLibraries: [],
  nearestLibrariesLines: [],
  nearestMobileLibrary: null,
  nearestMobileLibraryLine: null,
  postcodeServiceCode: null,
  searchDistance: 1609 * 3, // 3 miles in meters
  searchPosition: [],
  currentStopId: null,
  currentLibraryId: null,
  currentPoint: [],
  serviceFilter: [],
  serviceFilterBbox: null,
  serviceFilterBoundary: null,
  currentService: null,
  currentServiceSystemName: null,
  displayClosedLibraries: false,
  currentBuiltUpArea: null
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
    case 'SetCurrentBuiltUpArea':
      return {
        ...state,
        currentBuiltUpArea: action.currentBuiltUpArea
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
    case 'SetDisplayClosedLibraries':
      return {
        ...state,
        displayClosedLibraries: action.displayClosedLibraries
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
    case 'SetNearestLibraries':
      return {
        ...state,
        nearestLibraries: action.nearestLibraries,
        nearestLibrariesLines: action.nearestLibrariesLines
      }
    case 'SetNearestMobileLibrary':
      return {
        ...state,
        nearestMobileLibrary: action.nearestMobileLibrary,
        nearestMobileLibraryLine: action.nearestMobileLibraryLine
      }
    case 'SetPostcodeServiceCode':
      return {
        ...state,
        postcodeServiceCode: action.postcodeServiceCode
      }
    case 'ClearAll':
      if (
        state.serviceFilter.length > 0 ||
        state.currentService !== null ||
        state.currentServiceSystemName !== null ||
        state.searchPostcode.length > 0 ||
        state.searchPosition.length > 0 ||
        state.searchType.length > 0
      ) {
        return {
          ...state,
          serviceFilter: [],
          currentService: null,
          currentServiceSystemName: null,
          searchPostcode: '',
          searchPosition: [],
          searchType: '',
          nearestLibraries: [],
          nearestLibrariesLines: [],
          nearestMobileLibrary: null,
          nearestMobileLibraryLine: null,
          postcodeServiceCode: null
        }
      } else {
        return state
      }

    default:
      return state
  }
}

export const SearchStateProvider = ({ children }) => (
  <SearchStateContext.Provider
    value={useReducer(searchReducer, initialSearchState)}
  >
    {children}
  </SearchStateContext.Provider>
)

export const useSearchStateValue = () => useContext(SearchStateContext)
