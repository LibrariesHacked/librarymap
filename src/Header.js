import React from 'react'

import { Link, useLocation } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import GridOnIcon from '@mui/icons-material/GridOnTwoTone'
import MapIcon from '@mui/icons-material/MapTwoTone'

function Header() {
  const location = useLocation()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color='transparent' elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Library map
          </Typography>
          <Tooltip title="Find library in tables">
            <Button
              component={Link}
              to={'/'}
              disableRipple={location.pathname === '/'}
              disableFocusRipple={location.pathname === '/'}
              color='primary'
              startIcon={<GridOnIcon />}
            >
              Library lists
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
      </AppBar>
    </Box>
  )
}

export default Header
