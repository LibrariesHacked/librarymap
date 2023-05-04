import React from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function Service () {
  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <Typography component='h1' variant='h2'>
          Find my library
        </Typography>
        <Typography
          component='p'
          variant='subtitle'
          sx={{ padding: theme => theme.spacing() }}
        >
          Search by postcode, or select library service
        </Typography>
      </Box>
    </>
  )
}

export default Service
