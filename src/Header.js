import React from 'react'

import { Link, useMatch, useLocation } from 'react-router-dom'

import grey from '@mui/material/colors/grey'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Toolbar from '@mui/material/Toolbar'

import ListIcon from '@mui/icons-material/ViewListRounded'
import MapIcon from '@mui/icons-material/MapRounded'

import { Container } from '@mui/system'

import PostcodeSearch from './PostcodeSearch'

function Header () {
  const location = useLocation()
  const mapPage = useMatch('/map')
  const servicePage = useMatch('/service/:service')

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{
          zIndex: theme => theme.zIndex.drawer + 1,
          backgroundColor: grey.A100
        }}
        elevation={0}
        position='relative'
      >
        <Container>
          <Toolbar>
            {mapPage !== null && <PostcodeSearch />}
            {!servicePage && (
              <>
                <Box sx={{ flexGrow: 1 }} />
                <Tabs value={location.pathname}>
                  <Tab icon={<ListIcon />} iconPosition='start' label='List' value='/' component={Link} to='/' />
                  <Tab icon={<MapIcon />} iconPosition='start' label='Map' value='/map' component={Link} to='/map' />
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
