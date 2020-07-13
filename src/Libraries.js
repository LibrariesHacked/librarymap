import React, { useEffect } from 'react'

import Hidden from '@material-ui/core/Hidden'
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
import MoreVertIcon from '@material-ui/icons/MoreVertTwoTone'
import EventIcon from '@material-ui/icons/EventTwoTone'
import PrintIcon from '@material-ui/icons/PrintTwoTone'
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone'

import * as libraryModel from './models/library'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200
  },
  margin: {
    margin: theme.spacing(1)
  },
  root: {
    flexGrow: 1,
    maxWidth: '100%'
  },
  table: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    border: '1px solid #E0E0E0'
  }
}))

function Libraries () {
  const [{ searchType, searchPostcode, searchDistance, searchPosition }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ }, dispatchView] = useViewStateValue() //eslint-disable-line

  const tableRef = React.createRef()

  useEffect(() => {
    tableRef.current.onQueryChange()
  }, [searchPosition, searchDistance]) // eslint-disable-line

  const classes = useStyles()
  const theme = useTheme()

  return (
    <div style={{ maxWidth: '100%' }}>
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
            backgroundColor: '#fafafa',
            color: '#737373',
            border: '0px'
          }
        }}
        columns={[
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
            title: 'Type',
            field: 'type',
            filtering: false,
            hidden: false,
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            }
          },
          {
            title: 'Closed',
            field: 'yearClosed',
            filtering: false,
            hidden: false,
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            }
          },
          {
            title: 'Co-located with',
            field: 'colocatedWith',
            filtering: false,
            hidden: false,
            cellStyle: {
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: '#ffffff'
            }
          }
        ]}
        data={query =>
          new Promise((resolve, reject) => {
            async function getLibraries () {
              const libraryData = await libraryModel.getQueryLibraries(query, searchPosition, searchDistance)
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
