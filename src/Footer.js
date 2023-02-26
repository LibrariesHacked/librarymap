import React from 'react'

import { Link } from 'react-router-dom'

import Grid from '@mui/material/Grid'
import MaterialLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import FavoriteIcon from '@mui/icons-material/FavoriteTwoTone'

import { Carbonbadge } from 'react-carbonbadge'

function Footer() {
  return (
    <div>
      <Grid container spacing={2} sx={{ paddingTop: theme => theme.spacing(4), paddingBottom: theme => theme.spacing(4) }}>
        <Grid item xs={12} sm={3} md={3} lg={3} xl={4}>
          <Typography variant='body1'>
            A Library Lab project by Libraries Hacked.
          </Typography>
          <Typography variant='h6'>
            <MaterialLink
              variant='inherit'
              href='https://www.librarylab.uk/library-map'
              target='_blank'
              title='About the library map library lab project'
              sx={{ margin: theme => theme.spacing(2) }}
            >
              About
            </MaterialLink>
            <span> &#8226; </span>
            <MaterialLink
              variant='inherit'
              component={Link}
              to='/data'
              title='Maintaining the data used on this site and licensing'
              sx={{ margin: theme => theme.spacing(2) }}
            >
              Data
            </MaterialLink>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
          <Carbonbadge darkMode={true} />
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={3} xl={4}>
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
    </div>
  )
}

export default Footer
