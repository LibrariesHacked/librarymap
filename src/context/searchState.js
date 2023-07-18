import React, { createContext, useContext, useReducer } from 'react'

export const SearchStateContext = createContext()

const initialSearchState = {
  searchPostcode: '',
  searchType: '',
  librarySearchDistance: 12872,
  mobileSearchDistance: 3218,
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
    case 'SetLibrarySearchDistance':
      return {
        ...state,
        librarySearchDistance: action.librarySearchDistance
      }
    case 'SetMobileSearchDistance':
      return {
        ...state,
        mobileSearchDistance: action.mobileSearchDistance
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
          searchType: ''
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
