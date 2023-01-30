import { useState } from 'react'

import * as stopModel from '../models/stop'

const useMobileStopsQuery = () => {
  const [loadingMobileStops, setLoadingMobileStops] = useState(false)
  const [mobileStops, setMobileStops] = useState([])
  const [pageInfo, setPageInfo] = useState([])

  const getLibrariesFromQuery = async queryOptions => {
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
