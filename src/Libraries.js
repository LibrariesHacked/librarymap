import React, { useEffect, useState, useCallback } from 'react'

import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import ListSubheader from '@mui/material/ListSubheader'

import { DataGrid } from '@mui/x-data-grid'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import useLibraryQuery from './hooks/useLibraryQuery'

function Libraries () {
  const [
    { searchDistance, searchPosition, serviceFilter, displayClosedLibraries },
    dispatchSearch
  ] = useSearchStateValue() //eslint-disable-line
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(5)

  const { loadingLibraries, libraries, pageInfo, getLibrariesFromQuery } =
    useLibraryQuery()

  const [rowCountState, setRowCountState] = React.useState(
    pageInfo?.totalRowCount || 0
  )

  const fetchLibraries = useCallback(() => {
    getLibrariesFromQuery({
      page: page,
      pageSize: pageSize,
      searchPosition: searchPosition,
      searchDistance: searchDistance,
      serviceFilter: serviceFilter,
      displayClosedLibraries: displayClosedLibraries
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    pageSize,
    searchPosition,
    searchDistance,
    serviceFilter,
    displayClosedLibraries
  ])

  useEffect(() => fetchLibraries(), [fetchLibraries])

  React.useEffect(() => {
    setRowCountState(prevRowCountState =>
      pageInfo?.totalRowCount !== undefined
        ? pageInfo?.totalRowCount
        : prevRowCountState
    )
  }, [pageInfo?.totalRowCount, setRowCountState])

  const toggleDisplayClosedLibraries = () => {
    dispatchSearch({
      type: 'SetDisplayClosedLibraries',
      displayClosedLibraries: !displayClosedLibraries
    })
  }

  const columns = [{ field: 'name', headerName: 'Name' }]

  return (
    <>
      <ListSubheader disableSticky>Libraries</ListSubheader>
      <FormControlLabel
        control={
          <Checkbox
            checked={displayClosedLibraries}
            onChange={() => toggleDisplayClosedLibraries()}
            name='checkedB'
            color='primary'
          />
        }
        label='Display permanently closed libraries'
      />
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            autoHeight
            rows={libraries}
            rowCount={rowCountState}
            loading={loadingLibraries}
            rowsPerPageOptions={[5]}
            pagination
            page={page}
            pageSize={pageSize}
            paginationMode='server'
            onPageChange={newPage => setPage(newPage)}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            columns={columns}
          />
        </div>
      </div>
    </>
  )
}

export default Libraries
