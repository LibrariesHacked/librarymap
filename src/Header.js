import React from 'react'

import { Link, useMatch } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'

import ListIcon from '@mui/icons-material/ViewListRounded'
import MapIcon from '@mui/icons-material/MapRounded'

import { Container } from '@mui/system'

import PostcodeSearch from './PostcodeSearch'

function Header () {
  const homePage = useMatch('/')
  const mapPage = useMatch('/map')

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{
          borderBottom: 1,
          borderColor: '#ccc',
          zIndex: theme => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(250, 250, 250, 0.9)'
        }}
        color='transparent'
        elevation={0}
      >
        <Container>
          <Toolbar>
            {mapPage === null && (
              <Chip
                label='In development'
                color='primary'
              />
            )}
            {mapPage !== null && <PostcodeSearch />}
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title='Find library in tables'>
              <Button
                component={Link}
                to='/'
                disableRipple={homePage !== null}
                disableFocusRipple={homePage !== null}
                color='primary'
                startIcon={<ListIcon />}
              >
                List
              </Button>
            </Tooltip>
            <Tooltip title='View map'>
              <Button
                component={Link}
                to='/map'
                disableRipple={mapPage !== null}
                disableFocusRipple={mapPage !== null}
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
