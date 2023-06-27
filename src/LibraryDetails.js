import React, { useEffect, useState } from 'react'
import { useMatch } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
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

import DataIcon from '@mui/icons-material/EditLocationAltRounded'

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

  const mapPage = useMatch('/map')

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

  const staffedHoursAvailable =
    hoursHelper
      .getAllHours(library)
      .filter(rs => rs.staffed !== null && rs.staffed.length > 0).length > 0
  const unstaffedHoursAvailable =
    hoursHelper
      .getAllHours(library)
      .filter(rs => rs.unstaffed !== null && rs.unstaffed.length > 0).length > 0

  return (
    <>
      {Object.keys(library).length > 0 ? (
        <>
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
          {(staffedHoursAvailable || unstaffedHoursAvailable) &&
          config.displayOpeningHours ? (
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
          <Alert
            severity='warning'
            action={
              <Button
                href='/data'
                variant='text'
                color='warning'
                disableElevation
                startIcon={<DataIcon />}
                size='small'
              >
                Update
              </Button>
            }
          >
            Are these details incorrect? You can help by updating them.
          </Alert>
        </>
      ) : (
        <CircularProgress color='primary' size={30} />
      )}
    </>
  )
}

export default LibraryDetails
