import React from 'react'

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import ListSubheader from '@mui/material/ListSubheader'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'

import grey from '@mui/material/colors/grey'

import * as urlHelper from './helpers/url'

function ServiceDetails (props) {
  const { service } = props

  const goToWebsite = () => window.open(service.extended.serviceUrl, '_blank')

  return (
    <>
      <ListSubheader disableSticky>{`${service?.name}`}</ListSubheader>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: 1,
          borderColor: grey[300],
          marginBottom: theme => theme.spacing(1)
        }}
      >
        <Table size='small'>
          <TableBody>
            {service?.extended?.serviceUrl &&
              service?.extended?.serviceUrl !== '' && (
                <TableRow>
                  <TableCell variant='head' sx={{ borderBottom: 'none' }}>
                    Website
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none' }}>
                    <Button
                      variant='text'
                      color='primary'
                      disableElevation
                      onClick={goToWebsite}
                    >
                      {urlHelper.getDomainFromUrl(service.extended.serviceUrl)}
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            {service?.extended?.greenLibrary && (
              <TableRow>
                <TableCell sx={{ borderBottom: 'none' }} variant='head'>
                  Green library
                </TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>
                  This service has signed the green library manifesto
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!service && <CircularProgress color='primary' size={30} />}
    </>
  )
}

export default ServiceDetails
