import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import CircularProgress from '@mui/material/CircularProgress'
import ListSubheader from '@mui/material/ListSubheader'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import CancelIcon from '@mui/icons-material/CancelTwoTone'
import EventIcon from '@mui/icons-material/EventTwoTone'
import WebIcon from '@mui/icons-material/WebTwoTone'
import LocationOnIcon from '@mui/icons-material/LocationOnTwoTone'
import PrintIcon from '@mui/icons-material/PrintTwoTone'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import * as stopModel from './models/stop'

const config = require('./helpers/config.json')

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

  const getStopCalendar = () => window.open(config.mobilesApi + '/stops/' + stop.id + '/ics')

  const getStopPdf = () => window.open(config.mobilesApi + '/stops/' + stop.id + '/pdf', '_blank')

  const goToWebsite = () => window.open(stop.timetable, '_blank')

  const viewMapStop = () => {
    dispatchView({ type: 'SetMapPosition', mapPosition: [stop.longitude, stop.latitude], mapZoom: 16 })
  }

  const close = () => {
    dispatchSearch({ type: 'SetCurrentStop', currentStopId: null, currentPoint: null })
    dispatchView({ type: 'SetStopDialog', stopDialogOpen: false })
  }

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      fullScreen={fullScreen}
      open={stopDialogOpen}
      onClose={close}
      aria-labelledby='dlg-title'
      BackdropProps={{ invisible: true }}
      PaperProps={{ elevation: 0 }}>
      {Object.keys(stop).length > 0 && stop.routeDays
        ? (
          <>
            <DialogTitle id='dlg-title'>{stop.name}</DialogTitle>
            <DialogContent>
              <Typography component='h3' variant='subtitle1'>{'Mobile library stop in ' + stop.community + ' ' + stop.organisationName}</Typography>
              <Typography component='p' variant='body2'>{stop.address}</Typography>
              <ListSubheader>Schedules</ListSubheader>
              <TableContainer component={Paper} elevation={0}>
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
              <div>
                <Button onClick={() => goToWebsite()} color='primary' startIcon={<WebIcon />}>Go to website</Button>
                <Button onClick={getStopCalendar} color='primary' startIcon={<EventIcon />}>Get calendar</Button>
                <Button onClick={getStopPdf} color='primary' startIcon={<PrintIcon />}>Print</Button>
                <Button onClick={viewMapStop} color='primary' startIcon={<LocationOnIcon />} component={Link} to='/map'>See on map</Button>
              </div>
            </DialogContent>
          </>
        ) : <CircularProgress color='primary' size={30} />}
      <DialogActions>
        <Button onClick={() => close()} color='secondary' endIcon={<CancelIcon />}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default StopDetails
