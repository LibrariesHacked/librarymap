import React from 'react'

import { Link } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import DataIcon from '@mui/icons-material/EditLocationAltRounded'
import HelpIcon from '@mui/icons-material/HelpRounded'

import Libraries from './Libraries'
import MobileLibraries from './MobileLibraries'
import PostcodeInfo from './PostcodeInfo'
import Search from './Search'
import PostcodeServiceInfo from './PostcodeServiceInfo'

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
        <Typography component='h1' variant='h2'>
          Library map
        </Typography>
        <Typography
          component='p'
          variant='h6'
          sx={{
            color: theme => theme.palette.secondary.main,
            margin: theme => theme.spacing(0, 0, 4, 0)
          }}
        >
          Find your nearest library
        </Typography>
        <Search />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <PostcodeInfo />
        </Grid>
        <Grid item xs={12} sm={6}>
          <PostcodeServiceInfo />
        </Grid>
      </Grid>

      <Libraries />
      <MobileLibraries />
      <Typography variant='body1' sx={{ marginTop: theme => theme.spacing() }}>
        Are these listings incorrect? Help everyone by updating them.
      </Typography>
    </>
  )
}

export default Home
