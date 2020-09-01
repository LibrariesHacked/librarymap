import React, { useEffect } from 'react'

import Chip from '@material-ui/core/Chip'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import MaterialTable from 'material-table'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import ArrowUpward from '@material-ui/icons/ArrowUpwardTwoTone'
import ChevronLeft from '@material-ui/icons/ChevronLeftTwoTone'
import ChevronRight from '@material-ui/icons/ChevronRightTwoTone'
import FirstPage from '@material-ui/icons/FirstPageTwoTone'
import FilterList from '@material-ui/icons/FilterListTwoTone'
import LastPage from '@material-ui/icons/LastPageTwoTone'

import * as libraryModel from './models/library'
import * as hoursHelper from './helpers/hours'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import PostcodeSearch from './PostcodeSearch'

const useStyles = makeStyles((theme) => ({
  search: {
    alignContent: 'center',
    textAlign: 'center',
    display: 'table',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '10px'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '5px'
  },
  title: {
    textAlign: 'center'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200
  },
  hoursChip: {
    margin: theme.spacing(1)
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
  const [{ searchDistance, searchPosition }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ }, dispatchView] = useViewStateValue() //eslint-disable-line

  const tableRef = React.createRef()

  useEffect(() => {
    tableRef.current.onQueryChange()
  }, [searchPosition, searchDistance]) // eslint-disable-line

  const classes = useStyles()
  const theme = useTheme()

  return (
    <div>
      <Typography component='h2' variant='h6' color='secondary' className={classes.title}>Your library</Typography>
      <Typography component='p' variant='body1' className={classes.subtitle}>Search by postcode to find libraries within {searchDistance / 1609} mile(s)</Typography>
      <div className={classes.search}>
        <PostcodeSearch settings />
      </div>
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
