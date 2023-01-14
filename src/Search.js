import React from 'react'

import Typography from '@mui/material/Typography'

import Libraries from './Libraries'
import PostcodeSearch from './PostcodeSearch'
import MobileLibraries from './MobileLibraries'
import ServiceFilter from './ServiceFilter'

function Search () {
  return (
    <div>
      <Typography component='h2' variant='h3' color='secondary'>Find my library</Typography>
      <Typography component='p' variant='subtitle1'>Search by postcode or library service</Typography>
      <div>
        <PostcodeSearch settings />
      </div>
      <div>
        <ServiceFilter />
      </div>
      <Libraries />
      <br />
      <MobileLibraries />
    </div>
  )
}

export default Search
