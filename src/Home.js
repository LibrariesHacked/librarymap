import React from 'react'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import DataIcon from '@mui/icons-material/EditLocationAltRounded'
import HelpIcon from '@mui/icons-material/HelpRounded'

import grey from '@mui/material/colors/grey'

import Libraries from './Libraries'
import MobileLibraries from './MobileLibraries'
import Search from './Search'

function Home () {
  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <img src='/android-icon-96x96.png' alt='Logo' />
        <Typography component='h1' variant='h2'>
          Library map
        </Typography>
        <Typography
          component='p'
          variant='h5'
          sx={{
            color: theme => theme.palette.secondary.main,
            margin: theme => theme.spacing(0, 0, 4, 0)
          }}
        >
          Find your nearest public library by postcode or library service
        </Typography>
        <Search />
      </Box>
      <Libraries />
      <Alert
        severity='warning'
        icon={<HelpIcon fontSize="inherit" />}
        sx={{
          marginTop: theme => theme.spacing(2),
          border: 1,
          borderColor: grey[300]
        }}
        action={
          <Button href='/data' startIcon={<DataIcon />} color='warning'>
            Update
          </Button>
        }
      >
        Are these listings incorrect? You can help by updating them.
      </Alert>
      <MobileLibraries />
    </>
  )
}

export default Home
