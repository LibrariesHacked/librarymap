import React from 'react'

import { Link, useMatch } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'

import GridOnIcon from '@mui/icons-material/GridOnTwoTone'
import MapIcon from '@mui/icons-material/MapTwoTone'

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
        <Container maxWidth='lg'>
          <Toolbar>
            {mapPage === null && (
              <Chip
                label='Prototype'
                color='secondary'
                variant='outlined'
                size='small'
                sx={{ marginBottom: theme => theme.spacing(2) }}
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
                startIcon={<GridOnIcon />}
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
