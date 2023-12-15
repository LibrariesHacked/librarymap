import React from 'react'

import Box from '@mui/material/Box'

import PostcodeSearch from './PostcodeSearch'
import ServiceFilter from './ServiceFilter'

function Search () {
  return (
    <>
      <PostcodeSearch />
      <Box sx={{ padding: theme => theme.spacing() }} />
      <ServiceFilter />
    </>
  )
}

export default Search
