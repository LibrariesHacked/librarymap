import React from 'react'

import { Link, useMatch } from 'react-router-dom'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import MaterialLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import FavoriteIcon from '@mui/icons-material/FavoriteRounded'

import { Carbonbadge } from 'react-carbonbadge'

function Footer () {
  const mapPage = useMatch('/map')
  return (
    <>
      {!mapPage && (
        <Container
          maxWidth='false'
          sx={{
            paddingTop: theme => theme.spacing(4),
            paddingBottom: theme => theme.spacing(6)
          }}
        >
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={5} lg={4} xl={4}>
                <Typography variant='h6'>
                  <MaterialLink
                    component={Link}
                    to='/accessibility'
                    title='About the Accessibility of this site'
                  >
                    Accessibility
                  </MaterialLink>
                  <br />
                  <MaterialLink
                    component={Link}
                    to='/data'
                    title='Maintaining the data used on this site'
                  >
                    Data
                  </MaterialLink>
                  <br />
                  <MaterialLink
                    component={Link}
                    to='/privacy'
                    title='About your privacy on this site'
                  >
                    Privacy
                  </MaterialLink>
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                lg={4}
                xl={4}
                sx={{ display: mapPage ? 'none' : 'block' }}
              >
                <Carbonbadge />
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={4} xl={4}>
                <Typography variant='body1'>
                  In memory of Paul Rowe
                  <FavoriteIcon
                    color='secondary'
                    sx={{
                      verticalAlign: 'middle',
                      fontSize: '1.8rem',
                      paddingLeft: theme => theme.spacing(1)
                    }}
                  />
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
          </Container>
        </Container>
      )}
    </>
  )
}

export default Footer
