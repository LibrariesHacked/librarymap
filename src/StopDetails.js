import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import ListSubheader from '@material-ui/core/ListSubheader'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import CancelIcon from '@material-ui/icons/CancelTwoTone'
import EventIcon from '@material-ui/icons/EventTwoTone'
import LaunchIcon from '@material-ui/icons/LaunchTwoTone'
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone'
import PrintIcon from '@material-ui/icons/PrintTwoTone'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import * as stopModel from './models/stop'

const config = require('./helpers/config.json')

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1)
  },
  dialog: {
    border: '1px solid #E0E0E0'
  },
  dialogContentActions: {
    backgroundColor: '#ffebee',
    border: '1px solid #ffcdd2',
    borderRadius: 3,
    padding: 4
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  progress: {
    margin: theme.spacing(2)
  },
  tablePaper: {
  }
}))

function StopDetails () {
  const [{ currentStopId }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ stopDialogOpen }, dispatchView] = useViewStateValue() //eslint-disable-line

  const [stop, setStop] = useState({})

  useEffect(() => {
    async function getStop (stopId) {
      const stopData = await stopModel.getStopById(stopId)
      setStop(stopData)
    }
    if (currentStopId != null) getStop(currentStopId)
  }, [currentStopId])

  const getStopCalendar = () => window.open(config.api + '/stops/' + stop.id + '/ics')

  const getStopPdf = () => window.open(config.api + '/stops/' + stop.id + '/pdf', '_blank')

  const goToWebsite = () => window.open(stop.timetable, '_blank')

  const viewMapStop = () => {
    dispatchView({ type: 'SetMapPosition', mapPosition: [stop.longitude, stop.latitude], mapZoom: 14 })
  }

  const close = () => {
    dispatchSearch({ type: 'SetCurrentStop', currentStopId: null, currentPoint: null })
    dispatchView({ type: 'SetStopDialog', stopDialogOpen: false })
  }

  const theme = useTheme()
  const classes = useStyles()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      fullScreen={fullScreen}
      disableBackdropClick
      open={stopDialogOpen}
      onClose={close}
      aria-labelledby='dlg-title'
      BackdropProps={{ invisible: true }}
      PaperProps={{ elevation: 0, className: classes.dialog }}
    >
      {Object.keys(stop).length > 0 && stop.routeDays
        ? (
          <>
            <DialogTitle id='dlg-title'>{stop.name}</DialogTitle>
            <DialogContent>
              <Typography component='h3' variant='subtitle1'>{'Mobile library stop in ' + stop.community + ' ' + stop.organisationName}</Typography>
              <Typography component='p' variant='body2'>{stop.address}</Typography>
              <ListSubheader>Schedules</ListSubheader>
              <TableContainer component={Paper} elevation={0} className={classes.tablePaper}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Frequency</TableCell>
                      <TableCell align='right'>Next visit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stop.routeFrequencies.map((rs, idx) => (
                      <TableRow key={'tc_rs_' + idx}>
                        <TableCell component='th' scope='row'>
                          {rs}
                        </TableCell>
                        <TableCell align='right'>{stop.routeSchedule[0].format('dddd Do MMMM h:mma')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <br />
              <div className={classes.dialogContentActions}>
                <Button onClick={() => goToWebsite()} color='primary' startIcon={<LaunchIcon />}>Go to website</Button>
                <Button onClick={getStopCalendar} className={classes.button} color='primary' startIcon={<EventIcon />}>Get calendar</Button>
                <Button onClick={getStopPdf} className={classes.button} color='primary' startIcon={<PrintIcon />}>Print</Button>
                <Button onClick={viewMapStop} className={classes.button} color='primary' startIcon={<LocationOnIcon />} component={Link} to='/map'>See on map</Button>
              </div>
            </DialogContent>
          </>
        ) : <CircularProgress className={classes.progress} color='primary' size={30} />}
      <DialogActions>
        <Button onClick={() => close()} color='secondary' endIcon={<CancelIcon />}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default StopDetails
