import React from 'react'

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
          Search by postcode, or select your library service
        </Typography>
        <Search />
      </Box>
      <Libraries />
      <MobileLibraries />
    </>
  )
}

export default Home
