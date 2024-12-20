import React, { useEffect, useState, useCallback } from 'react'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import ListSubheader from '@mui/material/ListSubheader'

import InfoIcon from '@mui/icons-material/InfoOutlined'

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'

import { lighten } from '@mui/material'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import useMobileStopsQuery from './hooks/useMobileStopsQuery'
import usePrevious from './hooks/usePrevious'

function MobileLibraries () {
  const [
    { mobileSearchDistance, searchPosition, serviceFilter },
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

  const { loadingMobileStops, mobileStops, pageInfo, getMobileStopsFromQuery } =
    useMobileStopsQuery()

  const [rowCountState, setRowCountState] = React.useState(
    pageInfo?.totalRowCount || 0
  )

  const fetchLibraries = useCallback(() => {
    if (
      prevPosition &&
      prevPosition.length === 0 &&
      searchPosition.length > 0 &&
      sortModel[0].field !== 'distance'
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
    getMobileStopsFromQuery({
      page: page,
      pageSize: pageSize,
      sortModel: sortModel,
      searchPosition: searchPosition,
      searchDistance: mobileSearchDistance,
      serviceFilter: serviceFilter
    })
    // eslint-disable-next-line
  }, [
    page,
    pageSize,
    sortModel,
    searchPosition,
    mobileSearchDistance,
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

  const columns = [
    { field: 'community', headerName: 'Community', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'organisationName', headerName: 'Library service', flex: 1 },
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
          key={`act_${params.id}`}
          icon={<InfoIcon />}
          onClick={() => selectStop(params)}
          label='Show more stop information'
        />
      ],
      width: 50
    }
  ]

  return (
    <>
      <ListSubheader
        disableSticky
        sx={{ textAlign: 'center', marginTop: theme => theme.spacing(3) }}
      >
        Mobile library stops
      </ListSubheader>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            sx={theme => ({
              backgroundColor: 'white',
              border: 2,
              borderColor: lighten(theme.palette.mobileLibraries.main, 0.5),
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: lighten(theme.palette.mobileLibraries.main, 0.9),
                color: theme.palette.mobileLibraries.main
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
              community: true,
              name: useMediaQuery(theme.breakpoints.up('sm')),
              organisationName: useMediaQuery(theme.breakpoints.up('md')),
              distance: searchPosition.length > 0
            }}
            density='standard'
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
            onFilterModelChange={newFilterModel =>
              setFilterModel(newFilterModel)}
            onPageChange={newPage => setPage(newPage)}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            onSortModelChange={newSortModel => {
              if (newSortModel.length === 0) {
                setSortModel(initialSortModel)
              } else {
                setSortModel(newSortModel)
              }
            }}
            onRowClick={params => selectStop(params.row)}
            columns={columns}
            initialState={initialState}
          />
        </div>
      </div>
    </>
  )
}

export default MobileLibraries
