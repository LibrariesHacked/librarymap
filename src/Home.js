import React from 'react'

import { Link } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import DataIcon from '@mui/icons-material/EditLocationAltRounded'
import HelpIcon from '@mui/icons-material/HelpRounded'

import grey from '@mui/material/colors/grey'

import Libraries from './Libraries'
import MobileLibraries from './MobileLibraries'
import PostcodeInfo from './PostcodeInfo'
import Search from './Search'

function Home () {
  return (
    <>
      <Box
        sx={{
          textAlign: 'center',
          paddingTop: theme => theme.spacing(2),
          paddingBottom: theme => theme.spacing(2)
        }}
      >
        <img src='/android-icon-72x72.png' alt='Logo' />
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
          Find your library by postcode or service
        </Typography>
        <Search />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <PostcodeInfo />
        </Grid>
        <Grid item></Grid>
      </Grid>

      <Libraries />
      <Alert
        severity='warning'
        icon={<HelpIcon fontSize='inherit' />}
        sx={{
          marginTop: theme => theme.spacing(2),
          border: 1,
          borderColor: grey[300]
        }}
        action={
          <Button
            to='/data'
            startIcon={<DataIcon />}
            color='warning'
            component={Link}
          >
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
