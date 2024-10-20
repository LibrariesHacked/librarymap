import React from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import ListSubheader from '@mui/material/ListSubheader'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'

import { lighten } from '@mui/material'

import { useSearchStateValue } from './context/searchState'

function BuiltUpAreaDetails () {
  const [{ currentBuiltUpArea }, dispatchSearch] = useSearchStateValue() //eslint-disable-line

  return (
    <>
      {Object.keys(currentBuiltUpArea).length > 0
        ? (
          <>
            <ListSubheader disableSticky sx={{ textAlign: 'center' }}>
              Area details
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
                    <TableCell variant='head'>Name</TableCell>
                    <TableCell>{currentBuiltUpArea.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head'>Classification</TableCell>
                    <TableCell>{currentBuiltUpArea.classification}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head'>Population</TableCell>
                    <TableCell>{currentBuiltUpArea.population}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
          )
        : (
          <CircularProgress color='primary' size={30} />
          )}
    </>
  )
}

export default BuiltUpAreaDetails
