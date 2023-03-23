import React from 'react'
import { Link } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Libraries from './Libraries'
import MobileLibraries from './MobileLibraries'
import Search from './Search'

function Home () {
  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <img src='/Logo_Rectangle_h96.png' alt='Logo' />
        <Typography component='h1' variant='h2'>
          Find my library
        </Typography>
        <Typography
          component='p'
          variant='subtitle'
          sx={{ padding: theme => theme.spacing() }}
        >
          Search by postcode, or select a UK library service
        </Typography>
        <Search />
      </Box>
      <Libraries />
      <MobileLibraries />
      <Alert severity='error' sx={{ marginTop: theme => theme.spacing() }}>
        Information out of date or incorrect? See{' '}
        <Link to='/data' target='_blank'>
          Data
        </Link>{' '}
        for how to maintain.
      </Alert>
    </>
  )
}

export default Home
