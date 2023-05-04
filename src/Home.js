import React from 'react'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import DataIcon from '@mui/icons-material/EditLocationAltRounded'

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
          Search by postcode, or select library service
        </Typography>
        <Search />
      </Box>
      <Libraries />
      <MobileLibraries />
      <Alert
        severity='warning'
        sx={{ marginTop: theme => theme.spacing() }}
        action={
          <Button
            href='/data'
            variant='contained'
            color='warning'
            disableElevation
            startIcon={<DataIcon />}
            size='small'
          >
            Edit
          </Button>
        }
      >
        Are these listings incorrect? See the data page.
      </Alert>
    </>
  )
}

export default Home
