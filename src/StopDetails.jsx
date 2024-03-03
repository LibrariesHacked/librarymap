import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ListSubheader from '@mui/material/ListSubheader'
import MaterialLink from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

import { lighten } from '@mui/material'

import SaveIcon from '@mui/icons-material/SaveAltRounded'
import PrintIcon from '@mui/icons-material/PrintRounded'
import WebIcon from '@mui/icons-material/WebRounded'

import * as urlHelper from './helpers/url'

import config from './helpers/config.json'

function StopDetails (props) {
  const { stop } = props

  const getStopCalendar = () =>
    window.open(config.mobilesApi + '/stops/' + stop.id + '/ics')

  const getStopPdf = () =>
    window.open(config.mobilesApi + '/stops/' + stop.id + '/pdf', '_blank')

  const goToWebsite = () => window.open(stop.timetable, '_blank')

  return (
    <>
      <ListSubheader disableSticky sx={{ textAlign: 'center' }}>
        Quick info and schedule
      </ListSubheader>
      <Box
        sx={{
          border: 2,
          borderRadius: 2,
          borderColor: theme =>
            lighten(theme.palette.mobileLibraries.main, 0.5),
          marginBottom: theme => theme.spacing(1),
          padding: theme => theme.spacing(1)
        }}
      >
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            marginBottom: theme => theme.spacing(3)
          }}
        >
          <Table size='small'>
            <TableBody>
              <TableRow>
                <TableCell variant='head'>Address</TableCell>
                <TableCell>{stop.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant='head'>Authority</TableCell>
                <TableCell>{stop.organisationName}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            backgroundColor: theme =>
              lighten(theme.palette.mobileLibraries.main, 0.9),
            marginBottom: theme => theme.spacing(2),
            border: 1,
            borderRadius: 2,
            borderColor: theme =>
              lighten(theme.palette.mobileLibraries.main, 0.8)
          }}
        >
          <Table
            size='small'
            sx={{
              [`& .${tableCellClasses.root}`]: { borderBottom: 'none' }
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ color: theme => theme.palette.mobileLibraries.main }}
                >
                  Frequency
                </TableCell>
                <TableCell align='right' sx={{ color: theme => theme.palette.mobileLibraries.main }}>Next visit</TableCell>
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
        {config.displayWebLinks && (
          <Button
            onClick={() => goToWebsite()}
            color='mobileLibraries'
            startIcon={<WebIcon />}
            sx={{
              marginRight: theme => theme.spacing(1)
            }}
          >
            {urlHelper.getDomainFromUrl(stop.timetable)}
          </Button>
        )}
        <Button
          onClick={getStopCalendar}
          color='mobileLibraries'
          startIcon={<SaveIcon />}
          sx={{
            marginRight: theme => theme.spacing(1)
          }}
        >
          Save calendar file
        </Button>
        <Button
          onClick={getStopPdf}
          color='mobileLibraries'
          startIcon={<PrintIcon />}
          sx={{
            marginRight: theme => theme.spacing(1)
          }}
        >
          Print PDF
        </Button>
      </Box>

      <Typography variant='body1' sx={{ marginTop: theme => theme.spacing() }}>
        Is this information incorrect? Help everyone by {''}
        <MaterialLink to='/data' component={Link} sx={{ fontWeight: 700 }}>
          updating the data
        </MaterialLink>
        .
      </Typography>
    </>
  )
}

export default StopDetails
