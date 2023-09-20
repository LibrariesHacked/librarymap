import React, { useEffect, useState, useCallback } from 'react'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import ListSubheader from '@mui/material/ListSubheader'

import InfoIcon from '@mui/icons-material/InfoOutlined'

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import { lighten } from '@mui/material'

import useLibraryQuery from './hooks/useLibraryQuery'
import usePrevious from './hooks/usePrevious'

function Libraries () {
  const [
    {
      displayClosedLibraries,
      librarySearchDistance,
      searchPosition,
      serviceFilter
    },
    dispatchSearch
  ] = useSearchStateValue() //eslint-disable-line
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line

  const theme = useTheme()

  const prevPosition = usePrevious(searchPosition)

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

  const fetchLibraries = useCallback(async () => {
    if (
      sortModel[0].field !== 'distance' &&
      prevPosition &&
      prevPosition.length === 0 &&
      searchPosition.length > 0
    ) {
      // In this case we need to switch to sorting by distance
      // We can cancel the previous update as it will be out of date
      setSortModel([{ field: 'distance', sort: 'asc' }])
      return
    }
    if (sortModel[0].field === 'distance' && searchPosition.length === 0) {
      // In this case we need to switch to sorting by name
      setSortModel(initialSortModel)
      return
    }
    getLibrariesFromQuery({
      page: page,
      pageSize: pageSize,
      sortModel: sortModel,
      searchPosition: searchPosition,
      searchDistance: librarySearchDistance,
      serviceFilter: serviceFilter,
      displayClosedLibraries: displayClosedLibraries
    })

    // eslint-disable-next-line
  }, [
    page,
    pageSize,
    sortModel,
    searchPosition,
    librarySearchDistance,
    serviceFilter,
    displayClosedLibraries
  ])

  useEffect(() => {
    fetchLibraries()
  }, [fetchLibraries])

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
    { field: 'localAuthority', headerName: 'Library service', flex: 1 },
    { field: 'postcode', headerName: 'Postcode', flex: 1 },
    {
      field: 'distance',
      headerName: 'Distance',
      flex: 1,
      valueFormatter: params => {
        if (params.value == null) {
          return ''
        }

        const valueFormatted = Math.round(Number(params.value / 1608))
        return `${valueFormatted} mi`
      }
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: params => [
        <GridActionsCellItem
          key={`act_info_${params.id}`}
          icon={<InfoIcon />}
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
        List of libraries
      </ListSubheader>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            sx={theme => ({
              backgroundColor: 'white',
              border: 2,
              borderColor: lighten(theme.palette.primary.main, 0.5),
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: lighten(theme.palette.primary.main, 0.9),
                color: theme.palette.primary.main
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
            columnVisibilityModel={{
              name: true,
              address1: useMediaQuery(theme.breakpoints.up('md')),
              localAuthority: useMediaQuery(theme.breakpoints.up('lg')),
              postcode: useMediaQuery(theme.breakpoints.up('sm')),
              distance: searchPosition.length > 0
            }}
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
            onRowClick={params => selectLibrary(params.row)}
            columns={columns}
            initialState={initialState}
          />
        </div>
      </div>
    </>
  )
}

export default Libraries
