import React from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import ListSubheader from '@material-ui/core/ListSubheader'
import Switch from '@material-ui/core/Switch'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import CancelIcon from '@material-ui/icons/CancelTwoTone'

import { useTheme, makeStyles } from '@material-ui/core/styles'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

const useStyles = makeStyles(() => ({
  dialog: {
    border: '1px solid #E0E0E0'
  }
}))

function MapSettings () {
  const [{ mapSettings, mapSettingsDialogOpen }, dispatchView] = useViewStateValue()
  const [{ displayClosedLibraries }, dispatchSearch] = useSearchStateValue() //eslint-disable-line

  const closeDialog = () => {
    dispatchView({ type: 'SetMapSettingsDialog', mapSettingsDialogOpen: false })
  }

  const handleLibrariesChange = () => {
    dispatchView({ type: 'ToggleMapSetting', mapSetting: 'libraries' })
  }

  const handleClosedLibrariesChange = () => {
    dispatchSearch({ type: 'SetDisplayClosedLibraries', displayClosedLibraries: !displayClosedLibraries })
  }

  const handleMobileLibraryStopsChange = () => {
    dispatchView({ type: 'ToggleMapSetting', mapSetting: 'mobileLibraryStops' })
  }

  const handleAuthorityBoundaryChange = () => {
    dispatchView({ type: 'ToggleMapSetting', mapSetting: 'authorityBoundary' })
  }

  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      fullScreen={fullScreen}
      disableBackdropClick
      open={mapSettingsDialogOpen}
      onClose={closeDialog}
      BackdropProps={{
        invisible: true
      }}
      PaperProps={{ elevation: 0, className: classes.dialog }}
    >
      <DialogTitle>Map settings</DialogTitle>
      <DialogContent>
        <ListSubheader disableSticky>Display</ListSubheader>
        <FormControlLabel
          control={
            <Switch
              checked={mapSettings.libraries}
              onChange={handleLibrariesChange}
              name='sw_libraries'
              color='primary'
            />
          }
          label='Libraries'
        /><br />
        <FormControlLabel
          control={
            <Switch
              checked={displayClosedLibraries}
              onChange={handleClosedLibrariesChange}
              name='sw_closedlibraries'
              color='primary'
            />
          }
          label='Closed libraries'
        /><br />
        <FormControlLabel
          control={
            <Switch
              checked={mapSettings.mobileLibraryStops}
              onChange={handleMobileLibraryStopsChange}
              name='sw_mobile_library_stops'
              color='primary'
            />
          }
          label='Mobile library stops'
        /><br />
        <FormControlLabel
          control={
            <Switch
              checked={mapSettings.authorityBoundary}
              onChange={handleAuthorityBoundaryChange}
              name='sw_authority_boundary'
              color='primary'
            />
          }
          label='Library service boundaries'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color='secondary' endIcon={<CancelIcon />}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default MapSettings
