import React, { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import grey from '@mui/material/colors/grey'

import CancelIcon from '@mui/icons-material/CancelRounded'

import LibraryDetails from './LibraryDetails'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'
import { useApplicationStateValue } from './context/applicationState'

import * as libraryModel from './models/library'

function LibraryPopup () {
  const [{ currentLibraryId }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ libraryDialogOpen }, dispatchView] = useViewStateValue() //eslint-disable-line
  const [{ services }] = useApplicationStateValue()

  const [library, setLibrary] = useState({})
  const [service, setService] = useState({}) //eslint-disable-line

  useEffect(() => {
    async function getLibrary (libraryId) {
      const libraryData = await libraryModel.getLibraryById(libraryId)
      setLibrary(libraryData)
      services.every(service => {
        if (service.code === libraryData.localAuthorityCode) {
          setService(service)
          return false
        }
        return true
      })
    }
    if (currentLibraryId != null) getLibrary(currentLibraryId)
  }, [currentLibraryId, services])

  const close = () => {
    dispatchSearch({
      type: 'SetCurrentLibrary',
      currentLibraryId: null,
      currentPoint: null
    })
    dispatchView({ type: 'SetLibraryDialog', libraryDialogOpen: false })
  }

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      fullScreen={fullScreen}
      open={libraryDialogOpen}
      onClose={close}
      aria-labelledby='dlg-title'
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.03)' } }
      }}
      PaperProps={{ elevation: 0, sx: { border: 1, borderColor: grey[200] } }}
    >
      <DialogTitle id='dlg-title'>{library.name}</DialogTitle>
      <DialogContent>
        <LibraryDetails library={library} />
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

export default LibraryPopup
