import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import ListSubheader from '@mui/material/ListSubheader'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

import useMediaQuery from '@mui/material/useMediaQuery'

import { useTheme } from '@mui/material/styles'
import { lighten } from '@mui/material'

import grey from '@mui/material/colors/grey'

import CancelIcon from '@mui/icons-material/CancelRounded'
import DataIcon from '@mui/icons-material/EditLocationAltRounded'
import HelpIcon from '@mui/icons-material/HelpRounded'
import SaveIcon from '@mui/icons-material/SaveAltRounded'
import PrintIcon from '@mui/icons-material/PrintRounded'
import WebIcon from '@mui/icons-material/WebRounded'

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

  const getStopCalendar = () =>
    window.open(config.mobilesApi + '/stops/' + stop.id + '/ics')

  const getStopPdf = () =>
    window.open(config.mobilesApi + '/stops/' + stop.id + '/pdf', '_blank')

  const goToWebsite = () => window.open(stop.timetable, '_blank')

  const close = () => {
    dispatchSearch({
      type: 'SetCurrentStop',
      currentStopId: null,
      currentPoint: null
    })
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
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.03)' } }
      }}
      PaperProps={{ elevation: 0, sx: { border: 1, borderColor: grey[200] } }}
    >
      {Object.keys(stop).length > 0 && stop.routeDays ? (
        <>
          <DialogTitle id='dlg-title'>{stop.name}</DialogTitle>
          <DialogContent>
            <Typography component='h4' variant='subtitle1'>
              {stop.address}
            </Typography>
            <ListSubheader disableSticky sx={{ textAlign: 'center' }}>
              Schedule
            </ListSubheader>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: 2,
                borderColor: theme =>
                  lighten(theme.palette.secondary.main, 0.5),
                marginBottom: theme => theme.spacing(1)
              }}
            >
              <Table
                size='small'
                sx={{
                  [`& .${tableCellClasses.root}`]: { borderBottom: 'none' }
                }}
              >
                <TableHead
                  sx={{
                    backgroundColor: theme =>
                      lighten(theme.palette.secondary.main, 0.8)
                  }}
                >
                  <TableRow>
                    <TableCell>Frequency</TableCell>
                    <TableCell align='right'>Next visit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stop.routeFrequencyDescriptions.map((rs, idx) => (
                    <TableRow key={'tc_rs_' + idx}>
                      <TableCell component='th' scope='row'>
                        {`${stop.routeDays[0]}, ${rs}`}
                      </TableCell>
                      <TableCell align='right'>
                        {stop.routeSchedule[0].format('dddd Do MMMM h:mma')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Alert
              severity='warning'
              icon={<HelpIcon fontSize='inherit' />}
              action={
                <Button
                  to='/data'
                  color='warning'
                  startIcon={<DataIcon />}
                  component={Link}
                  onClick={() => close()}
                >
                  Update
                </Button>
              }
            >
              Are these details incorrect? You can help by updating them.
            </Alert>
          </DialogContent>
        </>
      ) : (
        <CircularProgress color='primary' size={30} />
      )}
      <DialogActions>
        {config.displayWebLinks && (
          <Button
            onClick={() => goToWebsite()}
            color='primary'
            startIcon={<WebIcon />}
          >
            Web
          </Button>
        )}
        <Button
          onClick={getStopCalendar}
          color='primary'
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
        <Button onClick={getStopPdf} color='primary' startIcon={<PrintIcon />}>
          Print
        </Button>
        <Button
          onClick={() => close()}
          color='secondary'
          endIcon={<CancelIcon />}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StopDetails
