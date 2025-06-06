import React from 'react'

import { Link, useMatch } from 'react-router-dom'

import Container from '@mui/material/Container'
import Grid2 from '@mui/material/Grid2'
import MaterialLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import FavoriteIcon from '@mui/icons-material/FavoriteRounded'

import { grey } from '@mui/material/colors'

function Footer () {
  const mapPage = useMatch('/map')
  return (
    <Container
      maxWidth='false'
      sx={{
        paddingTop: theme => theme.spacing(4),
        paddingBottom: theme => theme.spacing(6),
        display: !mapPage ? 'block' : 'none',
        backgroundColor: grey[200]
      }}
    >
      <Container>
        <Grid2 container spacing={2}>
          <Grid2 item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Typography component='p' variant='h6'>
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
          </Grid2>
          <Grid2 item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Typography component='p' variant='body1'>
              In memory of Paul Rowe
              <FavoriteIcon
                color='primary'
                sx={{
                  verticalAlign: 'middle',
                  fontSize: '2rem',
                  paddingLeft: theme => theme.spacing(1)
                }}
              />
            </Typography>
            <Typography component='p' variant='body1'>
              If this site has been useful, it'd be great if you considered{' '}
              <MaterialLink
                variant='inherit'
                href='https://www.mind.org.uk/donate/'
                title='Donate to Mind'
                target='_blank'
                sx={{ fontWeight: 700 }}
              >
                donating to Mind
              </MaterialLink>
            </Typography>
          </Grid2>
        </Grid2>
      </Container>
    </Container>
  )
}

export default Footer
