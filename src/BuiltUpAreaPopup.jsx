import React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import { grey } from '@mui/material/colors'

import CancelIcon from '@mui/icons-material/CancelRounded'

import BuiltUpAreaDetails from './BuiltUpAreaDetails'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

function BuiltUpAreaPopup () {
  const [{ currentBuiltUpArea }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ builtUpAreaDialogOpen }, dispatchView] = useViewStateValue() //eslint-disable-line

  const close = () => {
    dispatchSearch({
      type: 'SetCurrentBuiltUpArea',
      currentBuiltUpArea: null
    })
    dispatchView({ type: 'SetBuiltUpAreaDialog', builtUpAreaDialogOpen: false })
  }

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      fullScreen={fullScreen}
      open={builtUpAreaDialogOpen}
      onClose={close}
      aria-labelledby='dlg-title'
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.03)' } }
      }}
      PaperProps={{ elevation: 0, sx: { border: 1, borderColor: grey[200] } }}
    >
      {currentBuiltUpArea && (
        <>
          <DialogTitle id='dlg-title'>{currentBuiltUpArea.name}</DialogTitle>
          <DialogContent>
            <BuiltUpAreaDetails />
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
        </>
      )}
    </Dialog>
  )
}

export default BuiltUpAreaPopup
