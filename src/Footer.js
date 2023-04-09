import React from 'react'

import { Link, useMatch } from 'react-router-dom'

import Grid from '@mui/material/Grid'
import MaterialLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import FavoriteIcon from '@mui/icons-material/FavoriteTwoTone'

import { Carbonbadge } from 'react-carbonbadge'

function Footer () {
  const mapPage = useMatch('/map')
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          paddingTop: theme => theme.spacing(2),
          paddingBottom: theme => theme.spacing(4)
        }}
      >
        <Grid item xs={12} sm={3} md={3} lg={4} xl={4}>
          <Typography variant='body1'>
            A Library Lab project
          </Typography>
          <Typography variant='h6'>
            <MaterialLink
              variant='inherit'
              component={Link}
              to='/data'
              title='Maintaining the data used on this site and licensing'
              sx={{ marginRight: theme => theme.spacing() }}
            >
              Data
            </MaterialLink>
            <span> &#8226; </span>
            <MaterialLink
              variant='inherit'
              component={Link}
              to='/accessibility'
              title='About the Accessibility of this site'
              sx={{
                marginLeft: theme => theme.spacing(),
                marginRight: theme => theme.spacing()
              }}
            >
              Accessibility
            </MaterialLink>
            <span> &#8226; </span>
            <MaterialLink
              variant='inherit'
              component={Link}
              to='/privacy'
              title='About your privacy on this site'
              sx={{ marginLeft: theme => theme.spacing() }}
            >
              Privacy
            </MaterialLink>
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          lg={4}
          xl={4}
          sx={{ display: mapPage ? 'none' : 'block' }}
        >
          <Carbonbadge />
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={4} xl={4}>
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
