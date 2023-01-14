import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import ListSubheader from '@mui/material/ListSubheader'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'

import MaterialTable from '@material-table/core'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import ArrowUpward from '@mui/icons-material/ArrowUpwardTwoTone'
import ChevronLeft from '@mui/icons-material/ChevronLeftTwoTone'
import ChevronRight from '@mui/icons-material/ChevronRightTwoTone'
import FirstPage from '@mui/icons-material/FirstPageTwoTone'
import FilterList from '@mui/icons-material/FilterListTwoTone'
import LastPage from '@mui/icons-material/LastPageTwoTone'
import LocationOnIcon from '@mui/icons-material/LocationOnTwoTone'
import MoreVertIcon from '@mui/icons-material/MoreVertTwoTone'
import WebIcon from '@mui/icons-material/WebTwoTone'

import * as libraryModel from './models/library'
import * as hoursHelper from './helpers/hours'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import moment from 'moment'

function Libraries() {
  const [{ searchDistance, searchPosition, serviceFilter, displayClosedLibraries }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ }, dispatchView] = useViewStateValue() //eslint-disable-line

  const theme = useTheme()

  const tableRef = React.createRef()

  useEffect(() => {
    tableRef.current.onQueryChange()
  }, [searchPosition, searchDistance, serviceFilter, displayClosedLibraries]) // eslint-disable-line

  var selectLibrary = (library) => {
    dispatchSearch({ type: 'SetCurrentLibrary', currentLibraryId: library.id })
    dispatchView({ type: 'SetLibraryDialog', libraryDialogOpen: true })
  }

  const goToLibraryWebsite = (library) => window.open(library.url, '_blank')

  const viewLibraryOnMap = (library) => {
    dispatchView({ type: 'SetMapPosition', mapPosition: [library.longitude, library.latitude], mapZoom: 16 })
  }

  const toggleDisplayClosedLibraries = () => {
    dispatchSearch({ type: 'SetDisplayClosedLibraries', displayClosedLibraries: !displayClosedLibraries })
  }

  return (
    <div>
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
      <MaterialTable
        tableRef={tableRef}
        components={{
          Container: props => <Paper {...props} elevation={0} />
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
            },
            render: rowData => {
              return (
                <>
                  {rowData.name}
                  {
                    rowData.yearClosed !== null ? <><br /><Chip color='secondary' size='small' label={'Closed ' + rowData.yearClosed} /></> : null
                  }
                </>
              )
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
              const hoursUnstaffed = hours.unstaffed ? hours.unstaffed.map(hours => {
                return hours
              }) : null
              return (
                <>
                  {hours.staffed === null && hoursUnstaffed === null ? '' : null}
                  {hours.staffed !== null && hours.staffed.length > 0 ? hours.staffed.map(h => h.map(a => moment(a, 'hh:mm').format('h:mma')).join(' - ')).join(', ') : ''}
                </>
              )
            }
          }
        ]}
        data={query =>
          new Promise((resolve) => {
            async function getLibraries() {
              const libraryData = await libraryModel.getQueryLibraries(query, searchPosition, searchDistance, serviceFilter, displayClosedLibraries)
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
