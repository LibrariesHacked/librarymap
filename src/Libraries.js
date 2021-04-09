import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import Chip from '@material-ui/core/Chip'
import IconButton from '@material-ui/core/IconButton'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'

import MaterialTable from 'material-table'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import ArrowUpward from '@material-ui/icons/ArrowUpwardTwoTone'
import ChevronLeft from '@material-ui/icons/ChevronLeftTwoTone'
import ChevronRight from '@material-ui/icons/ChevronRightTwoTone'
import FirstPage from '@material-ui/icons/FirstPageTwoTone'
import FilterList from '@material-ui/icons/FilterListTwoTone'
import LastPage from '@material-ui/icons/LastPageTwoTone'
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone'
import MoreVertIcon from '@material-ui/icons/MoreVertTwoTone'
import WebIcon from '@material-ui/icons/WebTwoTone'

import * as libraryModel from './models/library'
import * as hoursHelper from './helpers/hours'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

const useStyles = makeStyles((theme) => ({
  hoursChip: {
    margin: theme.spacing(1)
  },
  table: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    border: '2px solid #ffe0b2'
  }
}))

function Libraries () {
  const [{ searchDistance, searchPosition, serviceFilter }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ }, dispatchView] = useViewStateValue() //eslint-disable-line

  const tableRef = React.createRef()

  useEffect(() => {
    tableRef.current.onQueryChange()
  }, [searchPosition, searchDistance, serviceFilter]) // eslint-disable-line

  const classes = useStyles()
  const theme = useTheme()

  var selectLibrary = (library) => {
    dispatchSearch({ type: 'SetCurrentLibrary', currentLibraryId: library.id })
    dispatchView({ type: 'SetLibraryDialog', libraryDialogOpen: true })
  }

  const goToLibraryWebsite = (library) => window.open(library.url, '_blank')

  const viewLibraryOnMap = (library) => {
    dispatchView({ type: 'SetMapPosition', mapPosition: [library.longitude, library.latitude], mapZoom: 16 })
  }

  return (
    <div>
      <ListSubheader disableSticky>Libraries</ListSubheader>
      <MaterialTable
        tableRef={tableRef}
        components={{
          Container: props => <Paper {...props} elevation={0} className={classes.table} />
        }}
        icons={{
          Filter: FilterList,
          FirstPage: FirstPage,
          LastPage: LastPage,
          NextPage: ChevronRight,
          PreviousPage: ChevronLeft,
          SortArrow: ArrowUpward
        }}
        options={{
          padding: useMediaQuery(theme.breakpoints.up('sm')) ? 'default' : 'dense',
          search: false,
          loadingType: 'overlay',
          actionsColumnIndex: 0,
          filtering: false,
          toolbar: false,
          headerStyle: {
            backgroundColor: '#fff3e0',
            color: '#e65100',
            border: '0px'
          }
        }}
        columns={[
          {
            title: '',
            field: 'name',
            filtering: false,
            sorting: false,
            render: rowData => {
              return (
                <>
                  <Tooltip title='See more details on the library'>
                    <IconButton size='small' color='secondary' onClick={() => selectLibrary(rowData)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='See this library on the library map'>
                    <IconButton size='small' color='primary' onClick={() => viewLibraryOnMap(rowData)} component={Link} to='/map'>
                      <LocationOnIcon />
                    </IconButton>
                  </Tooltip>
                  {rowData.url
                    ? (
                      <Tooltip title='Go to the library website'>
                        <IconButton size='small' color='primary' onClick={() => goToLibraryWebsite(rowData)}>
                          <WebIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                </>
              )
            },
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            }
          },
          {
            title: 'Name',
            field: 'name',
            filtering: false,
            hidden: false,
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            }
          },
          {
            title: 'Service',
            field: 'localAuthority',
            filtering: false,
            hidden: false,
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            }
          },
          {
            title: 'Address',
            field: 'address1',
            filtering: false,
            sorting: false,
            hidden: false,
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            },
            render: (rowData) => [rowData.address1, rowData.address2, rowData.address3].filter(Boolean).join(', ')
          },
          {
            title: 'Postcode',
            field: 'postcode',
            filtering: false,
            sorting: false,
            hidden: false,
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            }
          },
          {
            title: 'Today',
            field: 'mondayStaffedHours',
            filtering: false,
            sorting: false,
            hidden: false,
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            },
            render: (rowData) => {
              const hours = hoursHelper.getTodayHours(rowData)
              return hours.map((entry, idx) => {
                return <Chip key={'chp_' + idx} color='secondary' className={classes.hoursChip} size='small' label={entry} />
              })
            }
          }
        ]}
        data={query =>
          new Promise((resolve) => {
            async function getLibraries () {
              const libraryData = await libraryModel.getQueryLibraries(query, searchPosition, searchDistance, serviceFilter)
              resolve({
                data: libraryData.libraries,
                page: (libraryData.page - 1),
                totalCount: libraryData.total
              })
            }
            getLibraries()
          })}
      />
    </div>
  )
}

export default Libraries
