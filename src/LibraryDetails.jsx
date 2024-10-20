import React from 'react'

import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import ListSubheader from '@mui/material/ListSubheader'
import MaterialLink from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import AlternateEmailIcon from '@mui/icons-material/AlternateEmailRounded'
import WebIcon from '@mui/icons-material/WebRounded'

import { lighten } from '@mui/material'

import { useViewStateValue } from './context/viewState'
import { useSearchStateValue } from './context/searchState'

import moment from 'moment'

import * as hoursHelper from './helpers/hours'

import config from './helpers/config'

function LibraryDetails (props) {
  const [{}, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line

  const { library } = props

  const goToWebsite = () => window.open(library.url, '_blank')

  const emailLibrary = () =>
    window.open(
      'mailto:' + library.emailAddress.replace('mailto:', ''),
      '_blank'
    )

  const staffedHoursAvailable =
    hoursHelper
      .getAllHours(library)
      .filter(rs => rs.staffed !== null && rs.staffed.length > 0).length > 0
  const unstaffedHoursAvailable =
    hoursHelper
      .getAllHours(library)
      .filter(rs => rs.unstaffed !== null && rs.unstaffed.length > 0).length > 0

  const libraryAddress = [
    library.address1,
    library.address2,
    library.address3,
    library.postcode
  ]
    .filter(l => Boolean(l))
    .join(', ')

  return (
    <>
      {Object.keys(library).length > 0
        ? (
          <>
            <ListSubheader disableSticky sx={{ textAlign: 'center' }}>
              Quick info
            </ListSubheader>
            <Box
              sx={{
                border: 2,
                borderRadius: 2,
                borderColor: theme =>
                  lighten(theme.palette.staticLibraries.main, 0.5),
                marginBottom: theme => theme.spacing(1),
                padding: theme => theme.spacing(1)
              }}
            >
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  marginBottom: theme => theme.spacing(1)
                }}
              >
                <Table size='small'>
                  <TableBody>
                    <TableRow>
                      <TableCell variant='head'>Address</TableCell>
                      <TableCell>{libraryAddress}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant='head'>Authority</TableCell>
                      <TableCell>{library.localAuthority}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant='head'>Type</TableCell>
                      <TableCell>{library.typeDescription}</TableCell>
                    </TableRow>
                    {library.yearOpened && library.yearOpened !== ''
                      ? (
                        <TableRow>
                          <TableCell variant='head'>Opened</TableCell>
                          <TableCell>{library.yearOpened}</TableCell>
                        </TableRow>
                        )
                      : null}
                    {library.yearClosed && library.yearClosed !== ''
                      ? (
                        <TableRow>
                          <TableCell variant='head'>Year closed</TableCell>
                          <TableCell>{library.yearClosed}</TableCell>
                        </TableRow>
                        )
                      : null}
                    {library.notes && library.notes !== ''
                      ? (
                        <TableRow>
                          <TableCell variant='head'>Notes</TableCell>
                          <TableCell>{library.notes}</TableCell>
                        </TableRow>
                        )
                      : null}
                  </TableBody>
                </Table>
              </TableContainer>
              <>
                {library.url && library.url !== '' && (
                  <Button
                    variant='text'
                    color='staticLibraries'
                    disableElevation
                    onClick={goToWebsite}
                    startIcon={<WebIcon />}
                    sx={{
                      marginRight: theme => theme.spacing(1)
                    }}
                  >
                    Go to website
                  </Button>
                )}
                {library.emailAddress && library.emailAddress !== '' && (
                  <Button
                    variant='text'
                    color='staticLibraries'
                    disableElevation
                    onClick={emailLibrary}
                    startIcon={<AlternateEmailIcon />}
                  >
                    Send email
                  </Button>
                )}
              </>
            </Box>
            {(staffedHoursAvailable || unstaffedHoursAvailable) &&
          config.displayOpeningHours
              ? (
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
                          {unstaffedHoursAvailable
                            ? (
                              <TableCell>Unstaffed</TableCell>
                              )
                            : null}
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
                              {unstaffedHoursAvailable
                                ? (
                                  <TableCell>{rs.unstaffed}</TableCell>
                                  )
                                : null}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
                )
              : null}
            <Typography
              variant='body1'
              sx={{ marginTop: theme => theme.spacing() }}
            >
              {'Is this information incorrect? Help everyone by '}
              <MaterialLink to='/data' component={Link} sx={{ fontWeight: 700 }}>
                updating the data
              </MaterialLink>
              .
            </Typography>
          </>
          )
        : (
          <CircularProgress color='primary' size={30} />
          )}
    </>
  )
}

export default LibraryDetails
