import { useState } from 'react'

import * as libraryModel from '../models/library'

const useLibraryQuery = queryOptions => {
  const [loadingLibraries, setLoadingLibraries] = useState(false)
  const [libraries, setLibraries] = useState([])
  const [pageInfo, setPageInfo] = useState([])

  const getLibrariesFromQuery = async query => {
    setLoadingLibraries(true)
    const response = await libraryModel.getQueryLibraries(
      query.query,
      query.searchPosition,
      query.distance,
      query.serviceFilter,
      query.closed
    )
    setLoadingLibraries(false)
    setLibraries(response.libraries)
    setPageInfo(response.pageInfo)
    return response
  }

  return { loadingLibraries, libraries, pageInfo, getLibrariesFromQuery }
}

export default useLibraryQuery
