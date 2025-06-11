import { useRef, useState } from 'react'

import * as libraryModel from '../models/library'

const useLibraryQuery = () => {
  const [loadingLibraries, setLoadingLibraries] = useState(false)
  const [libraries, setLibraries] = useState([])
  const [pageInfo, setPageInfo] = useState([])

  const abortControllerRef = useRef(null)

  const getLibrariesFromQuery = async queryOptions => {
    // If a previous request is still in progress, abort it
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    setLoadingLibraries(true)
    const response = await libraryModel.getQueryLibraries(
      {
        page: queryOptions.page,
        pageSize: queryOptions.pageSize,
        orderBy: {
          field: queryOptions.sortModel[0].field,
          direction: queryOptions.sortModel[0].sort
        }
      },
      queryOptions.searchPosition,
      queryOptions.searchDistance,
      queryOptions.serviceFilter,
      queryOptions.displayClosedLibraries,
      abortControllerRef.current.signal
    )
    setLoadingLibraries(false)
    setLibraries(response.libraries)
    setPageInfo({
      totalRowCount: response.totalRowCount,
      currentPage: response.currentPage
    })
    abortController.abort()
    abortControllerRef.current = null
    return response
  }

  return { loadingLibraries, libraries, pageInfo, getLibrariesFromQuery }
}

export default useLibraryQuery
