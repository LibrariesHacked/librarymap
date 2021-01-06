import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import CancelIcon from '@material-ui/icons/CancelTwoTone'
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone'
import LaunchIcon from '@material-ui/icons/LaunchTwoTone'
import ListSubheader from '@material-ui/core/ListSubheader'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import * as libraryModel from './models/library'

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
  }
}))

function LibraryDetails () {
  const [{ currentLibraryId }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ libraryDialogOpen }, dispatchView] = useViewStateValue() //eslint-disable-line

  const [library, setLibrary] = useState({})

  useEffect(() => {
    async function getLibrary (libraryId) {
      const libraryData = await libraryModel.getLibraryById(libraryId)
      setLibrary(libraryData)
    }
    if (currentLibraryId != null) getLibrary(currentLibraryId)
  }, [currentLibraryId])

  const goToWebsite = () => window.open(library.url, '_blank')

  const viewMapLibrary = () => {
    dispatchView({ type: 'SetMapPosition', mapPosition: [library.longitude, library.latitude], mapZoom: 14 })
  }

  const close = () => {
    dispatchSearch({ type: 'SetCurrentLibrary', currentLibraryId: null, currentPoint: null })
    dispatchView({ type: 'SetLibraryDialog', libraryDialogOpen: false })
  }

  const theme = useTheme()
  const classes = useStyles()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      fullScreen={fullScreen}
      disableBackdropClick
      open={libraryDialogOpen}
      onClose={close}
      aria-labelledby='dlg-title'
      BackdropProps={{ invisible: true }}
      PaperProps={{ elevation: 0, className: classes.dialog }}
    >
      {Object.keys(library).length > 0
        ? (
          <>
            <DialogTitle id='dlg-title'>{library.name}</DialogTitle>
            <DialogContent>
              <Typography component='h3' variant='subtitle1'>{library.typeDescription + ' in ' + library.localAuthority + '. '}</Typography>
              <Typography component='p' variant='body2'>{[library.address1, library.address2, library.address3, library.postcode].filter(l => Boolean(l)).join(', ')}</Typography>
              <ListSubheader disableSticky>Actions</ListSubheader>
              <div className={classes.dialogContentActions}>
                <Button onClick={() => goToWebsite()} color='primary' startIcon={<LaunchIcon />}>Go to website</Button>
                <Button onClick={viewMapLibrary} className={classes.button} color='primary' startIcon={<LocationOnIcon />} component={Link} to='/map'>See on map</Button>
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

export default LibraryDetails
