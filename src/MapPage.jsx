import React from 'react'

import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

import { alpha } from '@mui/material'

import DirectionsBike from '@mui/icons-material/DirectionsBikeRounded'
import DirectionsWalk from '@mui/icons-material/DirectionsWalkRounded'
import DirectionsCar from '@mui/icons-material/DirectionsCarRounded'
import LayersIcon from '@mui/icons-material/LayersRounded'
import MoreVertIcon from '@mui/icons-material/MoreVertRounded'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import LibraryMap from './LibraryMap'
import MapSettings from './MapSettings'
import PostcodeSearch from './PostcodeSearch'

import * as isochroneModel from './models/isochrone'
import * as stopModel from './models/stop'
import * as libraryModel from './models/library'

import config from './helpers/config.json'

function MapPage (props) {
  const [{ isochrones }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line

  const [{ currentStopId, currentLibraryId, currentPoint }, dispatchSearch] =
    useSearchStateValue() //eslint-disable-line
  const [
    {
      mapSettings,
      mapSettingsDialogOpen,
      isochronesMenuOpen,
      isochronesMenuAnchor,
      loadingLibraryOrMobileLibrary
    },
    dispatchView
  ] = useViewStateValue() //eslint-disable-line

  const clickLibrary = async (feature, point) => {
    const id = feature.properties.id
    const library = await libraryModel.getLibraryById(id)
    dispatchSearch({
      type: 'SetCurrentLibrary',
      currentLibraryId: id,
      currentPoint: [library.longitude, library.latitude]
    })
    dispatchView({
      type: 'SetIsochronesMenu',
      isochronesMenuOpen: true,
      isochronesMenuAnchor: { left: point.x, top: point.y }
    })
  }

  const clickStop = async (feature, point) => {
    const id = feature.properties.id
    const stop = await stopModel.getStopById(id)
    dispatchSearch({
      type: 'SetCurrentStop',
      currentStopId: id,
      currentPoint: [stop.longitude, stop.latitude]
    })
    dispatchView({
      type: 'SetIsochronesMenu',
      isochronesMenuOpen: true,
      isochronesMenuAnchor: { left: point.x, top: point.y }
    })
  }

  const clickBuiltUpArea = (feature, point) => {
    dispatchView({
      type: 'SetBuiltUpAreaDialog',
      builtUpAreaDialogOpen: true
    })
    dispatchSearch({
      type: 'SetCurrentBuiltUpArea',
      currentBuiltUpArea: feature.properties
    })
  }

  const clickMap = async (map, event) => {
    if (loadingLibraryOrMobileLibrary) return
    dispatchView({
      type: 'ToggleLoadingLibraryOrMobileLibrary'
    })
    const features = map.queryRenderedFeatures(event.point)
    if (features && features.length > 0) {
      for (const feature of features) {
        if (feature.sourceLayer === 'libraries') {
          await clickLibrary(feature, event.point)
          break
        }
        if (feature.sourceLayer === 'stops') {
          await clickStop(feature, event.point)
          break
        }
        if (feature.sourceLayer === 'built_up_areas') {
          clickBuiltUpArea(feature, event.point)
          break
        }
      }
    }
    dispatchView({
      type: 'ToggleLoadingLibraryOrMobileLibrary'
    })
  }

  const moreInfoIsochronesMenu = () => {
    closeIsochronesMenu()
    if (currentStopId) {
      dispatchView({ type: 'SetStopDialog', stopDialogOpen: true })
    }
    if (currentLibraryId) {
      dispatchView({ type: 'SetLibraryDialog', libraryDialogOpen: true })
    }
  }

  const toggleIsochrone = async transport => {
    if (isochrones[currentPoint] && isochrones[currentPoint][transport]) {
      dispatchApplication({
        type: 'SetIsochroneDisplay',
        point: currentPoint,
        transport,
        display: !isochrones[currentPoint][transport].display
      })
    } else {
      const isochrone = await isochroneModel.getIsochrone(
        currentPoint,
        transport
      )
      dispatchApplication({
        type: 'AddIsochrone',
        point: currentPoint,
        transport,
        isochrone
      })
    }
  }

  const closeIsochronesMenu = () =>
    dispatchView({
      type: 'SetIsochronesMenu',
      isochronesMenuOpen: false,
      isochronesMenuAnchor: null
    })

  const travelIcons = {
    'cycling-regular': (
      <DirectionsBike
        fontSize='small'
        color={
          isochrones[currentPoint] &&
          isochrones[currentPoint]['cycling-regular'] &&
          isochrones[currentPoint]['cycling-regular'].display
            ? 'primary'
            : 'default'
        }
      />
    ),
    'driving-car': (
      <DirectionsCar
        fontSize='small'
        color={
          isochrones[currentPoint] &&
          isochrones[currentPoint]['driving-car'] &&
          isochrones[currentPoint]['driving-car'].display
            ? 'primary'
            : 'default'
        }
      />
    ),
    'foot-walking': (
      <DirectionsWalk
        fontSize='small'
        color={
          isochrones[currentPoint] &&
          isochrones[currentPoint]['foot-walking'] &&
          isochrones[currentPoint]['foot-walking'].display
            ? 'primary'
            : 'default'
        }
      />
    )
  }

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          marginTop: theme => theme.spacing(2),
          zIndex: 1000,
          backgroundColor: alpha('#fff', 0.8),
          borderRadius: '6px'
        }}
      >
        <PostcodeSearch />
      </Box>
      <LibraryMap
        containerStyle={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        clickMap={clickMap}
      />
      <Tooltip title='Map settings'>
        <Fab
          color='primary'
          sx={{
            position: 'absolute',
            bottom: 28,
            right: 16,
            zIndex: 1,
            color: 'white'
          }}
          onClick={() => {
            dispatchView({
              type: 'SetMapSettingsDialog',
              mapSettingsDialogOpen: true
            })
          }}
        >
          <LayersIcon />
        </Fab>
      </Tooltip>
      <MapSettings
        mapSettings={mapSettings}
        mapSettingsDialogOpen={mapSettingsDialogOpen}
      />
      <Menu
        id='mnu-isochrones'
        anchorPosition={isochronesMenuAnchor}
        anchorReference='anchorPosition'
        elevation={0}
        keepMounted
        open={isochronesMenuOpen}
        onClose={closeIsochronesMenu}
      >
        <MenuItem dense onClick={moreInfoIsochronesMenu}>
          <ListItemIcon>
            <MoreVertIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='More info' />
        </MenuItem>
        {config.travel.map((travel, idx) => {
          return (
            <MenuItem
              dense
              key={'mnu_trv_' + idx}
              onClick={() => toggleIsochrone(travel.name)}
            >
              <ListItemIcon>{travelIcons[travel.name]}</ListItemIcon>
              <ListItemText primary={travel.description} />
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

export default MapPage
