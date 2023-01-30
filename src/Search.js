import React from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Libraries from './Libraries'
import PostcodeSearch from './PostcodeSearch'
import MobileLibraries from './MobileLibraries'
import ServiceFilter from './ServiceFilter'

function Search() {
  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <Typography component='h2' variant='h3'>
          Library map
        </Typography>
        <Typography component='p' variant='subtitle1'>
          Search by postcode or library service
        </Typography>
        <PostcodeSearch settings />
        <ServiceFilter />
      </Box>
      <Libraries />
      <MobileLibraries />
    </>
  )
}

export default Search
