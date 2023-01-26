import { useState } from 'react'

import * as libraryModel from '../models/library'

const useLibraryQuery = () => {
  const [loadingLibraries, setLoadingLibraries] = useState(false)
  const [libraries, setLibraries] = useState([])
  const [pageInfo, setPageInfo] = useState([])

  const getLibrariesFromQuery = async queryOptions => {
    setLoadingLibraries(true)
    const response = await libraryModel.getQueryLibraries(
      { page: queryOptions.page, pageSize: queryOptions.pageSize },
      queryOptions.searchPosition,
      queryOptions.searchDistance,
      queryOptions.serviceFilter,
      queryOptions.displayClosedLibraries
    )
    setLoadingLibraries(false)
    setLibraries(response.libraries)
    setPageInfo({
      totalRowCount: response.totalRowCount,
      currentPage: response.currentPage
    })
    return response
  }

  return { loadingLibraries, libraries, pageInfo, getLibrariesFromQuery }
}

export default useLibraryQuery
