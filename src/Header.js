import React from 'react'

import { Link, useMatch } from 'react-router-dom'

import { alpha } from '@mui/material'

import grey from '@mui/material/colors/grey'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import ListIcon from '@mui/icons-material/ViewListRounded'
import MapIcon from '@mui/icons-material/MapRounded'

import { Container } from '@mui/system'

function Header () {
  const mapPage = useMatch('/map')
  const homePage = useMatch('/')
  const servicePage = useMatch('/service/:service')
  const libraryPage = useMatch('/service/:service/:library')

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{
          zIndex: theme => theme.zIndex.drawer + 1,
          backgroundColor: mapPage ? alpha(grey.A100, 0.8) : grey.A100
        }}
        elevation={0}
        position='relative'
        color='transparent'
      >
        <Container>
          <Toolbar>
            {!servicePage && !libraryPage && (
              <>
                <Typography sx={{ textDecoration: 'underline' }}>
                  In development
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Tabs value={mapPage ? 'map' : homePage ? 'list' : false}>
                  <Tab
                    icon={<ListIcon />}
                    iconPosition='start'
                    label='List'
                    value='list'
                    component={Link}
                    to='/'
                  />
                  <Tab
                    icon={<MapIcon />}
                    iconPosition='start'
                    label='Map'
                    value='map'
                    component={Link}
                    to='/map'
                  />
                </Tabs>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  )
}

export default Header
