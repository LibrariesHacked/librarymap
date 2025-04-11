import React from 'react'

import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MaterialLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'

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
        {'Are these listings incorrect? Help out by '}
        <MaterialLink to='/data' component={Link} sx={{ fontWeight: 700 }}>
          updating the data
        </MaterialLink>
        .
      </Typography>
    </>
  )
}

export default Home
