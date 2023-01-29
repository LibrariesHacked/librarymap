import React, { useEffect, useState, useCallback } from 'react'

import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import ListSubheader from '@mui/material/ListSubheader'

import WebIcon from '@mui/icons-material/WebTwoTone'
import LocationOnIcon from '@mui/icons-material/LocationOnTwoTone'
import MoreVertIcon from '@mui/icons-material/MoreVertTwoTone'

import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'

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

  const { loadingLibraries, libraries, pageInfo, getLibrariesFromQuery } =
    useLibraryQuery()

  const [rowCountState, setRowCountState] = React.useState(
    pageInfo?.totalRowCount || 0
  )

  const fetchLibraries = useCallback(() => {
    getLibrariesFromQuery({
      page: page,
      pageSize: pageSize,
      sortModel: sortModel,
      searchPosition: searchPosition,
      searchDistance: searchDistance,
      serviceFilter: serviceFilter,
      displayClosedLibraries: displayClosedLibraries
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    pageSize,
    sortModel,
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

  const selectLibrary = library => {
    dispatchSearch({ type: 'SetCurrentLibrary', currentLibraryId: library.id })
    dispatchView({ type: 'SetLibraryDialog', libraryDialogOpen: true })
  }

  const goToLibraryWebsite = library => window.open(library.url, '_blank')

  const viewLibraryOnMap = library => {
    dispatchView({
      type: 'SetMapPosition',
      mapPosition: [library.longitude, library.latitude],
      mapZoom: 16
    })
  }

  const toggleDisplayClosedLibraries = () => {
    dispatchSearch({
      type: 'SetDisplayClosedLibraries',
      displayClosedLibraries: !displayClosedLibraries
    })
  }

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      getActions: params => [
        <GridActionsCellItem
          icon={<MoreVertIcon />}
          onClick={() => selectLibrary(params)}
          label='Show more library information'
        />,
        <GridActionsCellItem
          icon={<LocationOnIcon />}
          onClick={() => viewLibraryOnMap(params)}
          label='View library on map'
        />,
        <GridActionsCellItem
          icon={<WebIcon />}
          onClick={() => goToLibraryWebsite(params)}
          label='Go to library website'
        />
      ]
    },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'localAuthority', headerName: 'Service', flex: 1 },
    { field: 'address1', headerName: 'Address', flex: 1 },
    { field: 'postcode', headerName: 'Postcode', flex: 1 }
  ]

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
            components={{ Toolbar: GridToolbar }}
            density='compact'
            disableSelectionOnClick
            filterMode='server'
            loading={loadingLibraries}
            page={page}
            pageSize={pageSize}
            pagination
            paginationMode='server'
            rows={libraries}
            rowCount={rowCountState}
            rowsPerPageOptions={[5]}
            sortingMode='server'
            sortModel={sortModel}
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

export default Libraries
