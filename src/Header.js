import React from 'react'

import { Link, useLocation } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'

import GridOnIcon from '@mui/icons-material/GridOnTwoTone'
import MapIcon from '@mui/icons-material/MapTwoTone'

import { Container } from '@mui/system'

import PostcodeSearch from './PostcodeSearch'

function Header() {
  const location = useLocation()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ borderBottom: 1, borderColor: '#ccc', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(250, 250, 250, 0.9)' }} color='transparent' elevation={0}>
        <Container maxWidth='lg'>
          <Toolbar>
            <PostcodeSearch />
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="Find library in tables">
              <Button
                component={Link}
                to={'/'}
                disableRipple={location.pathname === '/'}
                disableFocusRipple={location.pathname === '/'}
                color='primary'
                startIcon={<GridOnIcon />}
              >
                Lists
              </Button>
            </Tooltip>
            <Tooltip title="View map">
              <Button
                component={Link}
                to={'/map'}
                disableRipple={location.pathname === '/map'}
                disableFocusRipple={location.pathname === '/map'}
                color='primary'
                startIcon={<MapIcon />}
              >
                Map
              </Button>
            </Tooltip>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  )
}

export default Header
