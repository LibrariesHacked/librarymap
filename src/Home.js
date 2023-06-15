import React from 'react'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import DataIcon from '@mui/icons-material/EditLocationAltRounded'

import { alpha } from '@mui/material/styles'

import Libraries from './Libraries'
import MobileLibraries from './MobileLibraries'
import Search from './Search'

function Home () {
  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <img src='/Logo_Rectangle_h96.png' alt='Logo' />
        <Typography component='h1' variant='h3' gutterBottom>
          Find my library
        </Typography>
        <Typography
          component='p'
          variant='h5'
          sx={{
            padding: theme => theme.spacing(1),
            backgroundColor: theme => alpha(theme.palette.secondary.main, 0.05),
            color: theme => theme.palette.secondary.main,
            fontWeight: 500,
            borderRadius: '5px',
            margin: theme => theme.spacing(2, 0)
          }}
        >
          Search by postcode or library service
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
            variant='text'
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
