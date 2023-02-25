import React from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Libraries from './Libraries'
import MobileLibraries from './MobileLibraries'

function Search() {
  return (
    <>
      <Box sx={{ textAlign: 'center', paddingTop: '70px' }}>
        <img src='/Logo_Rectangle_h96.png' alt='Logo' />
        <Typography component='h1' variant='h2'>
          Find your nearest library
        </Typography>
      </Box>
      <Libraries />
      <MobileLibraries />
    </>
  )
}

export default Search
