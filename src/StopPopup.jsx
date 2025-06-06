import React, { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import { grey } from '@mui/material/colors'

import CancelIcon from '@mui/icons-material/CancelRounded'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import StopDetails from './StopDetails'

import * as stopModel from './models/stop'

function StopPopup () {
  const [{ currentStopId }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ stopDialogOpen }, dispatchView] = useViewStateValue() //eslint-disable-line
  const [{ services }] = useApplicationStateValue()

  const [stop, setStop] = useState({})

  useEffect(() => {
    async function getStop (stopId) {
      const stopData = await stopModel.getStopById(stopId)
      setStop(stopData)
    }
    if (currentStopId != null) getStop(currentStopId)
  }, [currentStopId, services])

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
        backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0)' } },
        paper: { elevation: 0, sx: { border: 1, borderColor: grey[200] } }
      }}
    >
      <DialogTitle id='dlg-title'>{stop.name}</DialogTitle>
      <DialogContent>
        {
          // eslint-disable-next-line no-nested-ternary
          stop.id != null ? <StopDetails stop={stop} /> : <p>Loading...</p>
        }
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => close()}
          endIcon={<CancelIcon />}
          color='secondary'
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StopPopup
