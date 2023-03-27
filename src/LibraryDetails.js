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
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { lighten } from '@mui/material'

import AlternateEmailIcon from '@mui/icons-material/AlternateEmailTwoTone'
import CancelIcon from '@mui/icons-material/CancelTwoTone'
import LocationOnIcon from '@mui/icons-material/LocationOnTwoTone'
import WebIcon from '@mui/icons-material/WebTwoTone'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import moment from 'moment'

import * as libraryModel from './models/library'
import * as hoursHelper from './helpers/hours'
import config from './helpers/config'

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

  const emailLibrary = () =>
    window.open('mailto:' + library.emailAddress, '_blank')

  const viewMapLibrary = () => {
    dispatchView({
      type: 'FlyTo',
      mapFlyToPosition: [library.longitude, library.latitude],
      mapZoom: 16
    })
  }

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

  const staffedHoursAvailable =
    hoursHelper
      .getAllHours(library)
      .filter(rs => rs.staffed !== null && rs.staffed.length > 0).length > 0
  const unstaffedHoursAvailable =
    hoursHelper
      .getAllHours(library)
      .filter(rs => rs.unstaffed !== null && rs.unstaffed.length > 0).length > 0

  return (
    <Dialog
      fullScreen={fullScreen}
      open={libraryDialogOpen}
      onClose={close}
      aria-labelledby='dlg-title'
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.03)' } }
      }}
      PaperProps={{ elevation: 0, sx: { border: 1, borderColor: '#ccc' } }}
    >
      {Object.keys(library).length > 0 ? (
        <>
          <DialogTitle id='dlg-title'>{library.name}</DialogTitle>
          <DialogContent>
            <ListSubheader disableSticky sx={{ textAlign: 'center' }}>
              Library details
            </ListSubheader>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: 2,
                borderColor: theme => lighten(theme.palette.primary.main, 0.5),
                marginBottom: theme => theme.spacing(1)
              }}
            >
              <Table size='small'>
                <TableBody>
                  <TableRow>
                    <TableCell variant='head'>Address</TableCell>
                    <TableCell>
                      {' '}
                      {[
                        library.address1,
                        library.address2,
                        library.address3,
                        library.postcode
                      ]
                        .filter(l => Boolean(l))
                        .join(', ')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head'>Service</TableCell>
                    <TableCell>{library.localAuthority}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head'>Type</TableCell>
                    <TableCell>{library.typeDescription}</TableCell>
                  </TableRow>
                  {library.yearOpened && library.yearOpened !== '' ? (
                    <TableRow>
                      <TableCell variant='head'>Year opened</TableCell>
                      <TableCell>{library.yearOpened}</TableCell>
                    </TableRow>
                  ) : null}
                  {library.yearClosed && library.yearClosed !== '' ? (
                    <TableRow>
                      <TableCell variant='head'>Year closed</TableCell>
                      <TableCell>{library.yearClosed}</TableCell>
                    </TableRow>
                  ) : null}
                  {library.notes && library.notes !== '' ? (
                    <TableRow>
                      <TableCell variant='head'>Notes</TableCell>
                      <TableCell>{library.notes}</TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
            {(staffedHoursAvailable || unstaffedHoursAvailable) && (config.displayOpeningHours) ? (
              <>
                <ListSubheader disableSticky sx={{ textAlign: 'center' }}>
                  Opening hours
                </ListSubheader>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    border: 2,
                    borderColor: theme =>
                      lighten(theme.palette.primary.main, 0.5),
                    marginBottom: theme => theme.spacing(1)
                  }}
                >
                  <Table size='small'>
                    <TableHead
                      sx={{
                        backgroundColor: theme =>
                          lighten(theme.palette.primary.main, 0.8)
                      }}
                    >
                      <TableRow>
                        <TableCell />
                        <TableCell>Staffed</TableCell>
                        {unstaffedHoursAvailable ? (
                          <TableCell>Unstaffed</TableCell>
                        ) : null}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {hoursHelper
                        .getAllHours(library)
                        .filter(
                          rs =>
                            (rs.staffed !== null && rs.staffed.length > 0) ||
                            (rs.unstaffed !== null && rs.unstaffed.length > 0)
                        )
                        .map((rs, idx) => (
                          <TableRow key={'tc_rs_' + idx}>
                            <TableCell variant='head'>{rs.day}</TableCell>
                            <TableCell>
                              {rs.staffed !== null && rs.staffed.length > 0
                                ? rs.staffed
                                    .map(h =>
                                      h
                                        .map(a =>
                                          moment(a, 'hh:mm').format('h:mma')
                                        )
                                        .join(' - ')
                                    )
                                    .join(', ')
                                : ''}
                            </TableCell>
                            {unstaffedHoursAvailable ? (
                              <TableCell>{rs.unstaffed}</TableCell>
                            ) : null}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : null}
            <Alert severity='error'>
              Library details incorrect? See{' '}
              <Link to='/data' target='_blank'>
                Data
              </Link>{' '}
              for info.
            </Alert>
          </DialogContent>
        </>
      ) : (
        <CircularProgress color='primary' size={30} />
      )}
      <DialogActions>
        {library.url && library.url !== '' ? (
          <Button onClick={() => goToWebsite()} startIcon={<WebIcon />}>
            Web
          </Button>
        ) : null}
        {library.url && library.url !== '' ? (
          <Button
            onClick={() => emailLibrary()}
            startIcon={<AlternateEmailIcon />}
          >
            Email
          </Button>
        ) : null}

        <Button
          onClick={viewMapLibrary}
          startIcon={<LocationOnIcon />}
          component={Link}
          to='/map'
        >
          Map
        </Button>
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

export default LibraryDetails
