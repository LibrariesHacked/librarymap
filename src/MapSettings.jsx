import React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import ListSubheader from '@mui/material/ListSubheader'
import Switch from '@mui/material/Switch'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import CancelIcon from '@mui/icons-material/CancelRounded'

import { grey } from '@mui/material/colors'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

function MapSettings () {
  const [{ mapSettings, mapSettingsDialogOpen }, dispatchView] =
    useViewStateValue()
  const [{ displayClosedLibraries }, dispatchSearch] = useSearchStateValue() //eslint-disable-line

  const closeDialog = () => {
    dispatchView({ type: 'SetMapSettingsDialog', mapSettingsDialogOpen: false })
  }

  const handleLibrariesChange = () => {
    dispatchView({ type: 'ToggleMapSetting', mapSetting: 'libraries' })
  }

  const handleClosedLibrariesChange = () => {
    dispatchSearch({
      type: 'SetDisplayClosedLibraries',
      displayClosedLibraries: !displayClosedLibraries
    })
  }

  const handleMobileLibraryStopsChange = () => {
    dispatchView({ type: 'ToggleMapSetting', mapSetting: 'mobileLibraryStops' })
  }

  const handleAuthorityBoundaryChange = () => {
    dispatchView({ type: 'ToggleMapSetting', mapSetting: 'authorityBoundary' })
  }

  const handleBuiltUpAreasChange = () => {
    dispatchView({ type: 'ToggleMapSetting', mapSetting: 'builtUpAreas' })
  }

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      fullScreen={fullScreen}
      open={mapSettingsDialogOpen}
      onClose={closeDialog}
      BackdropProps={{
        invisible: true
      }}
      PaperProps={{ elevation: 0, sx: { border: 1, borderColor: grey.A100 } }}
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
        />
        <br />
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
        />
        <br />
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
        />
        <br />
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
        <br />
        <FormControlLabel
          control={
            <Switch
              checked={mapSettings.builtUpAreas}
              onChange={handleBuiltUpAreasChange}
              name='sw_built_up_areas'
              color='primary'
            />
          }
          label='Built up areas'
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          color='secondary'
          endIcon={<CancelIcon />}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MapSettings
