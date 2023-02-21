import React, { useEffect, useState, useCallback } from 'react'

import ListSubheader from '@mui/material/ListSubheader'

import WebIcon from '@mui/icons-material/WebTwoTone'
import LocationOnIcon from '@mui/icons-material/LocationOnTwoTone'
import MoreVertIcon from '@mui/icons-material/MoreVertTwoTone'

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import useMobileStopsQuery from './hooks/useMobileStopsQuery'

function MobileLibraries() {
  const [{ searchDistance, searchPosition, serviceFilter }, dispatchSearch] =
    useSearchStateValue() //eslint-disable-line
  const [{ }, dispatchView] = useViewStateValue() //eslint-disable-line

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [sortModel, setSortModel] = useState([{ field: 'name', sort: 'asc' }])
  const [filterModel, setFilterModel] = useState({
    items: [
      {
        columnField: 'localAuthority',
        operatorValue: 'contains',
        value: ''
      }
    ]
  })

  const initialState = {
    sorting: {
      sortModel: sortModel
    },
    pagination: {
      page: page,
      pageSize: pageSize
    },
    filter: filterModel
  }

  const { loadingMobileStops, mobileStops, pageInfo, getMobileStopsFromQuery } =
    useMobileStopsQuery()

  const [rowCountState, setRowCountState] = React.useState(
    pageInfo?.totalRowCount || 0
  )

  const fetchLibraries = useCallback(() => {
    getMobileStopsFromQuery({
      page: page,
      pageSize: pageSize,
      sortModel: sortModel,
      searchPosition: searchPosition,
      searchDistance: searchDistance,
      serviceFilter: serviceFilter
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    pageSize,
    sortModel,
    searchPosition,
    searchDistance,
    serviceFilter
  ])

  useEffect(() => fetchLibraries(), [fetchLibraries])

  React.useEffect(() => {
    setRowCountState(prevRowCountState =>
      pageInfo?.totalRowCount !== undefined
        ? pageInfo?.totalRowCount
        : prevRowCountState
    )
  }, [pageInfo?.totalRowCount, setRowCountState])

  const selectStop = stop => {
    dispatchSearch({ type: 'SetCurrentStop', currentStopId: stop.id })
    dispatchView({ type: 'SetStopDialog', stopDialogOpen: true })
  }

  const goToStopTimetableWebsite = library => window.open(library.url, '_blank')

  const viewLibraryStopOnMap = stop => {
    dispatchView({
      type: 'SetMapPosition',
      mapPosition: [stop.longitude, stop.latitude],
      mapZoom: 16
    })
  }

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      getActions: params => [
        <GridActionsCellItem
          icon={<MoreVertIcon />}
          onClick={() => selectStop(params)}
          label='Show more stop information'
        />,
        <GridActionsCellItem
          icon={<LocationOnIcon />}
          onClick={() => viewLibraryStopOnMap(params)}
          label='View stop on map'
        />,
        <GridActionsCellItem
          icon={<WebIcon />}
          onClick={() => goToStopTimetableWebsite(params)}
          label='Go to stop website'
        />
      ]
    },
    { field: 'community', headerName: 'Community', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'organisationName', headerName: 'Service', flex: 1 }
  ]

  return (
    <>
      <ListSubheader disableSticky>Mobile library stops</ListSubheader>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            autoHeight
            density='compact'
            disableSelectionOnClick
            filterMode='server'
            filterModel={filterModel}
            loading={loadingMobileStops}
            page={page}
            pageSize={pageSize}
            pagination
            paginationMode='server'
            rows={mobileStops}
            rowCount={rowCountState}
            rowsPerPageOptions={[5]}
            sortingMode='server'
            sortModel={sortModel}
            onFilterModelChange={newFilterModel => setFilterModel(newFilterModel)}
            onPageChange={newPage => setPage(newPage)}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            onSortModelChange={newSortModel => setSortModel(newSortModel)}
            columns={columns}
            initialState={initialState}
          />
        </div>
      </div>
    </>
  )
}

export default MobileLibraries
