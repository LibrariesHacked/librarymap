import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

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

import * as stopHelper from './models/stop'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

function MobileLibraries () {
  const [{ searchDistance, searchPosition, serviceFilter }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ }, dispatchView] = useViewStateValue() //eslint-disable-line

  const theme = useTheme()

  const tableRef = React.createRef()

  useEffect(() => {
    tableRef.current.onQueryChange()
  }, [searchPosition, searchDistance, serviceFilter]) // eslint-disable-line

  var selectStop = (stop) => {
    dispatchSearch({ type: 'SetCurrentStop', currentStopId: stop.id })
    dispatchView({ type: 'SetStopDialog', stopDialogOpen: true })
  }

  const goToStopTimetableWebsite = (library) => window.open(library.url, '_blank')

  const viewLibraryStopOnMap = (stop) => {
    dispatchView({ type: 'SetMapPosition', mapPosition: [stop.longitude, stop.latitude], mapZoom: 16 })
  }

  return (
    <div>
      <ListSubheader disableSticky>Mobile library stops</ListSubheader>
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
                  <Tooltip title='See more stop details'>
                    <IconButton size='small' onClick={() => selectStop(rowData)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='See this stop on the library map'>
                    <IconButton size='small' color='primary' onClick={() => viewLibraryStopOnMap(rowData)} component={Link} to='/map'>
                      <LocationOnIcon />
                    </IconButton>
                  </Tooltip>
                  {rowData.url
                    ? (
                      <Tooltip title='Go to the library website'>
                        <IconButton size='small' color='primary' onClick={() => goToStopTimetableWebsite(rowData)}>
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
            title: 'Community',
            field: 'community',
            filtering: false,
            sorting: false,
            hidden: false,
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
            field: 'organisationName',
            filtering: false,
            hidden: false,
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            }
          },
          {
            title: 'Address',
            field: 'address',
            filtering: false,
            sorting: false,
            hidden: false,
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            }
          }
        ]}
        data={query =>
          new Promise((resolve) => {
            async function getStops () {
              const stopData = await stopHelper.getQueryStops(query, searchPosition, searchDistance, serviceFilter)
              resolve({
                data: stopData.stops,
                page: (stopData.page - 1),
                totalCount: stopData.total
              })
            }
            getStops()
          })}
      />
    </div>
  )
}

export default MobileLibraries
