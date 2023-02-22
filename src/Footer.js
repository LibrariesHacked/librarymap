import React from 'react'

import { Link } from 'react-router-dom'

import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import MaterialLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import FavoriteIcon from '@mui/icons-material/FavoriteTwoTone'

function Footer () {
  return (
    <>
      <Divider variant='middle' role='presentation' sx={{ m: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Typography variant='body1'>
            A project by Libraries Hacked.
          </Typography>
          <Typography variant='h6'>
            <MaterialLink
              variant='inherit'
              href='https://www.librarylab.uk/library-map'
              target='_blank'
              title='About the library map library lab project'
            >
              About
            </MaterialLink>
            <span> &#8226; </span>
            <MaterialLink
              variant='inherit'
              component={Link}
              to='/data'
              title='Maintaining the data used on this site and licensing'
            >
              Data
            </MaterialLink>
            <span> &#8226; </span>
            <MaterialLink
              variant='inherit'
              href='https://github.com/LibrariesHacked/librarymap'
              target='_blank'
              title='Project on GitHub'
            >
              GitHub
            </MaterialLink>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Typography variant='body1'>
            In memory of Paul Rowe <FavoriteIcon color='primary' />
          </Typography>
          <Typography variant='h6'>
            <MaterialLink
              variant='inherit'
              href='https://www.mind.org.uk/donate/'
              title='Donate to Mind'
              target='_blank'
            >
              Donate to Mind
            </MaterialLink>
          </Typography>
        </Grid>
      </Grid>
    </>
  )
}

export default Footer
