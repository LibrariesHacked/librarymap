import React from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Libraries from './Libraries'
import MobileLibraries from './MobileLibraries'
import PostcodeSearch from './PostcodeSearch'
import ServiceFilter from './ServiceFilter'

function Search() {
  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <img src='/Logo_Rectangle_h96.png' alt='Logo' />
        <Typography component='h1' variant='h2'>
          Find a library
        </Typography>
        <Typography component='p' variant='subtitle' sx={{ padding: theme => theme.spacing() }}>
          Find your nearest libraries by postcode
        </Typography>
        <PostcodeSearch />
        <Typography component='p' variant='subtitle' sx={{ padding: theme => theme.spacing() }}>
          or, select your library service
        </Typography>
        <ServiceFilter />
      </Box>
      <Libraries />
      <MobileLibraries />
    </>
  )
}

export default Search
