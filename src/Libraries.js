import React, { useEffect, useState, useCallback } from 'react'

import ListSubheader from '@mui/material/ListSubheader'

import MoreVertIcon from '@mui/icons-material/ReadMoreTwoTone'

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import { lighten } from '@mui/material'

import useLibraryQuery from './hooks/useLibraryQuery'

function Libraries () {
  const [
    { searchDistance, searchPosition, serviceFilter, displayClosedLibraries },
    dispatchSearch
  ] = useSearchStateValue() //eslint-disable-line
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line

  const initialSortModel = [{ field: 'name', sort: 'asc' }]

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [sortModel, setSortModel] = useState(initialSortModel)
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
    // eslint-disable-next-line
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

  useEffect(() => {
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

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'address1', headerName: 'Address', flex: 1 },
    { field: 'postcode', headerName: 'Postcode', flex: 1 },
    {
      field: 'actions',
      type: 'actions',
      getActions: params => [
        <GridActionsCellItem
          icon={<MoreVertIcon />}
          onClick={() => selectLibrary(params)}
          label='Show more library information'
        />
      ],
      width: 50
    }
  ]

  return (
    <>
      <ListSubheader disableSticky sx={{ textAlign: 'center' }}>
        Static libraries
      </ListSubheader>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            sx={theme => ({
              backgroundColor: 'white',
              border: 2,
              borderColor: lighten(theme.palette.primary.main, 0.5),
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: lighten(theme.palette.primary.main, 0.8)
              },
              '&.Mui-hovered': {
                backgroundColor: theme.palette.action.hover
              },
              '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
                outline: 'none !important'
              },
              '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus':
                {
                  outline: 'none !important'
                }
            })}
            autoHeight
            density='standard'
            disableSelectionOnClick
            filterMode='server'
            filterModel={filterModel}
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
            onFilterModelChange={newFilterModel =>
              setFilterModel(newFilterModel)
            }
            onPageChange={newPage => setPage(newPage)}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            onSortModelChange={newSortModel => {
              if (newSortModel.length === 0) {
                setSortModel(initialSortModel)
              } else {
                setSortModel(newSortModel)
              }
            }}
            columns={columns}
            initialState={initialState}
          />
        </div>
      </div>
    </>
  )
}

export default Libraries
