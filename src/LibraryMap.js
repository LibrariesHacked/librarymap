import React from 'react'

import Fab from '@mui/material/Fab'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl'

// eslint-disable-next-line import/no-webpack-loader-syntax
import maplibregl from '!maplibre-gl'

import DirectionsBike from '@mui/icons-material/DirectionsBikeTwoTone'
import DirectionsWalk from '@mui/icons-material/DirectionsWalkTwoTone'
import DirectionsCar from '@mui/icons-material/DirectionsCarTwoTone'
import LayersIcon from '@mui/icons-material/LayersTwoTone'
import MoreVertIcon from '@mui/icons-material/MoreVertTwoTone'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import MeAvatar from './MeAvatar'
import MapSettings from './MapSettings'

import * as isochroneModel from './models/isochrone'
import * as stopModel from './models/stop'
import * as libraryModel from './models/library'

const config = require('./helpers/config.json')

const libraryTiles = config.libraryTiles
const libraryBuildingsTiles = config.libraryBuildingsTiles
const libraryAuthorityTiles = config.libraryAuthorityTiles
const stopTiles = config.stopTiles
const tripTiles = config.tripTiles

function LibraryMap() {
  const [{ isochrones }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [
    {
      searchType,
      searchPosition,
      currentStopId,
      currentLibraryId,
      currentPoint,
      currentService,
      displayClosedLibraries
    },
    dispatchSearch
  ] = useSearchStateValue() //eslint-disable-line
  const [
    {
      mapZoom,
      mapPosition,
      mapSettings,
      mapSettingsDialogOpen,
      isochronesMenuOpen,
      isochronesMenuAnchor
    },
    dispatchView
  ] = useViewStateValue() //eslint-disable-line

  const mapRef = { current: null }

  const setViewState = viewState => {
    dispatchView({
      type: 'SetMapPosition',
      mapZoom: viewState.zoom,
      mapPosition: [viewState.longitude, viewState.latitude]
    })
  }

  const clickLibrary = async (feature, point) => {
    var id = feature.properties.id
    var library = await libraryModel.getLibraryById(id)
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
    var id = feature.properties.id
    var stop = await stopModel.getStopById(id)
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

  const clickMap = async event => {
    const features = mapRef.current.queryRenderedFeatures(event.point)
    if (features && features.length > 0 && features[0].properties) {
      if (features[0].sourceLayer === 'libraries')
        clickLibrary(features[0], event.point)
      if (features[0].sourceLayer === 'stop')
        clickStop(features[0], event.point)
    }
  }

  const moreInfoIsochronesMenu = () => {
    closeIsochronesMenu()
    if (currentStopId)
      dispatchView({ type: 'SetStopDialog', stopDialogOpen: true })
    if (currentLibraryId)
      dispatchView({ type: 'SetLibraryDialog', libraryDialogOpen: true })
  }

  const toggleIsochrone = async transport => {
    if (isochrones[currentPoint] && isochrones[currentPoint][transport]) {
      dispatchApplication({
        type: 'SetIsochroneDisplay',
        point: currentPoint,
        transport: transport,
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
        transport: transport,
        isochrone: isochrone
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
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}
        mapStyle='https://zoomstack.librarydata.uk/light.json'
        longitude={mapPosition[0]}
        latitude={mapPosition[1]}
        zoom={mapZoom}
        maxZoom={18}
        onMove={evt => setViewState(evt.viewState)}
        onClick={clickMap}
      >
        {currentService && currentService.geojson ? (
          <Source type='geojson' data={JSON.parse(currentService.geojson)}>
            <Layer
              type='line'
              paint={{
                'line-opacity': 0.4,
                'line-width': 2,
                'line-color': '#455a64'
              }}
            />
          </Source>
        ) : null}
        {Object.keys(isochrones).map(point => {
          return Object.keys(isochrones[point])
            .filter(transport => {
              return (
                isochrones[point][transport] &&
                isochrones[point][transport].display
              )
            })
            .map((transport, x) => {
              return (
                <span key={'sp_isotransport_' + x}>
                  <Source
                    type='geojson'
                    data={isochrones[point][transport].geo}
                  >
                    <Layer // Shows the shaded polygons
                      type='fill'
                      paint={{
                        'fill-opacity': 0.1,
                        'fill-antialias': true,
                        'fill-color': config.travel.filter(
                          t => t.name === transport
                        )[0].colour
                      }}
                    />
                    <Layer // Shows the outlines of the distances
                      type='line'
                      paint={{
                        'line-opacity': 0.4,
                        'line-width': 2,
                        'line-color': config.travel.filter(
                          t => t.name === transport
                        )[0].colour
                      }}
                    />
                    <Layer // Shows the distances labels
                      type='symbol'
                      layout={{
                        'text-field': [
                          'concat',
                          ['to-string', ['/', ['get', 'value'], 60]],
                          ' min'
                        ],
                        'text-font': ['Source Sans Pro Bold'],
                        'symbol-placement': 'line',
                        'text-allow-overlap': false,
                        'text-padding': 2,
                        'text-max-angle': 90,
                        'text-size': {
                          base: 1.2,
                          stops: [
                            [8, 12],
                            [22, 30]
                          ]
                        },
                        'text-letter-spacing': 0.1
                      }}
                      paint={{
                        'text-halo-color': 'rgba(255, 255, 255, 0.9)',
                        'text-halo-width': 4,
                        'text-halo-blur': 2,
                        'text-color': config.travel.filter(
                          t => t.name === transport
                        )[0].colour
                      }}
                    />
                    <Layer // Shows the population labels
                      type='symbol'
                      layout={{
                        'text-field': ['concat', ['get', 'total_pop']],
                        'text-font': ['Source Sans Pro Bold'],
                        'symbol-placement': 'line',
                        'text-allow-overlap': false,
                        'text-keep-upright': false,
                        'text-padding': 2,
                        'text-max-angle': 0,
                        'text-offset': [0, 1],
                        'text-size': {
                          base: 1.2,
                          stops: [
                            [10, 8],
                            [22, 14]
                          ]
                        },
                        'text-letter-spacing': 0.1
                      }}
                      paint={{
                        'text-halo-color': 'rgba(255, 255, 255, 0.9)',
                        'text-halo-width': 0,
                        'text-halo-blur': 0,
                        'text-color': config.travel.filter(
                          t => t.name === transport
                        )[0].colour
                      }}
                    />
                  </Source>
                </span>
              )
            })
        })}
        <Source type='vector' tiles={[libraryBuildingsTiles]}>
          <Layer
            type='line'
            source-layer='library_buildings'
            minzoom={14}
            layout={{
              'line-join': 'round',
              'line-cap': 'square'
            }}
            paint={{
              'line-color': '#455a64',
              'line-opacity': 0.8,
              'line-width': ['interpolate', ['linear'], ['zoom'], 14, 2, 18, 3]
            }}
          />
          <Layer
            type='fill'
            source-layer='library_buildings'
            minzoom={14}
            paint={{
              'fill-color': '#455a64',
              'fill-opacity': 0.3
            }}
          />
        </Source>
        <Source type='vector' tiles={[libraryAuthorityTiles]}>
          {mapSettings.authorityBoundary ? (
            <Layer
              type='line'
              source-layer='library_authority_boundaries'
              minzoom={6}
              layout={{
                'line-join': 'round',
                'line-cap': 'square'
              }}
              paint={{
                'line-color': '#a7a39b',
                'line-opacity': 1,
                'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1, 18, 4]
              }}
            />
          ) : null}
          {mapSettings.authorityBoundary ? (
            <Layer
              type='fill'
              source-layer='library_authority_boundaries'
              minzoom={6}
              paint={{
                'fill-color': '#ccc',
                'fill-opacity': 0.1
              }}
            />
          ) : null}
        </Source>
        <Source type='vector' tiles={[tripTiles]}>
          <Layer
            type='line'
            source-layer='trip'
            minzoom={14}
            layout={{
              'line-join': 'round',
              'line-cap': 'square'
            }}
            paint={{
              'line-color': '#a7a39b',
              'line-offset': [
                'interpolate',
                ['linear'],
                ['zoom'],
                14,
                1,
                18,
                4
              ],
              'line-opacity': 1,
              'line-width': ['interpolate', ['linear'], ['zoom'], 14, 1, 18, 4],
              'line-dasharray': [2, 0.5]
            }}
          />
        </Source>
        <Source type='vector' tiles={[stopTiles]}>
          {mapSettings.mobileLibraryStops ? (
            <Layer
              type='circle'
              source-layer='stop'
              minzoom={5}
              layout={{}}
              paint={{
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  5,
                  2,
                  18,
                  8
                ],
                'circle-color': '#455a64',
                'circle-stroke-width': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  5,
                  1,
                  18,
                  3
                ],
                'circle-stroke-color': '#ffffff',
                'circle-opacity': 0.5
              }}
            />
          ) : null}
          {mapSettings.mobileLibraryStops ? (
            <Layer
              type='symbol'
              source-layer='stop'
              minzoom={13}
              layout={{
                'text-ignore-placement': false,
                'text-field': ['concat', 'Mobile: ', ['get', 'name']],
                'text-font': ['Source Sans Pro Bold'],
                'text-line-height': 1,
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13,
                  12,
                  18,
                  18
                ],
                'text-offset': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13,
                  ['literal', [0, 1.5]],
                  18,
                  ['literal', [0, 2]]
                ]
              }}
              paint={{
                'text-halo-color': 'hsl(0, 0%, 100%)',
                'text-halo-width': 1,
                'text-halo-blur': 1,
                'text-color': '#6a6f73'
              }}
            />
          ) : null}
          {mapSettings.mobileLibraryStops ? (
            <Layer
              type='symbol'
              source-layer='stop'
              minzoom={14}
              layout={{
                'text-ignore-placement': false,
                'text-field': ['to-string', ['get', 'next_visiting']],
                'text-font': ['Source Sans Pro Bold'],
                'text-line-height': 1,
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  14,
                  10,
                  18,
                  16
                ],
                'text-offset': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13,
                  ['literal', [0, -1.5]],
                  18,
                  ['literal', [0, -2]]
                ]
              }}
              paint={{
                'text-halo-color': 'hsl(0, 0%, 100%)',
                'text-halo-width': 1,
                'text-halo-blur': 1,
                'text-color': '#6a6f73'
              }}
            />
          ) : null}
        </Source>
        <Source type='vector' tiles={[libraryTiles]}>
          {displayClosedLibraries ? (
            <Layer
              type='symbol'
              source-layer='libraries'
              minzoom={12}
              filter={['has', 'Year closed']}
              layout={{
                'text-ignore-placement': false,
                'text-field': ['to-string', ['get', 'Library name']],
                'text-font': ['Source Sans Pro Bold'],
                'text-line-height': 1,
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  12,
                  10,
                  18,
                  14
                ],
                'text-offset': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  12,
                  ['literal', [0, 1.5]],
                  18,
                  ['literal', [0, 2]]
                ]
              }}
              paint={{
                'text-halo-color': 'hsl(0, 0%, 100%)',
                'text-halo-width': 0,
                'text-halo-blur': 0,
                'text-color': '#d32f2f',
                'text-opacity': 0.9
              }}
            />
          ) : null}
          {displayClosedLibraries ? (
            <Layer
              type='symbol'
              source-layer='libraries'
              minzoom={12}
              filter={['has', 'Year closed']}
              layout={{
                'text-ignore-placement': false,
                'text-field': ['concat', 'Closed ', ['get', 'Year closed']],
                'text-font': ['Source Sans Pro Bold'],
                'text-line-height': 1,
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  12,
                  10,
                  18,
                  14
                ],
                'text-offset': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  12,
                  ['literal', [0, -1.5]],
                  18,
                  ['literal', [0, -2]]
                ]
              }}
              paint={{
                'text-halo-color': 'hsl(0, 0%, 100%)',
                'text-halo-width': 0,
                'text-halo-blur': 1,
                'text-color': '#d32f2f',
                'text-opacity': 0.9
              }}
            />
          ) : null}
          {displayClosedLibraries ? (
            <Layer
              type='circle'
              source-layer='libraries'
              minzoom={11}
              filter={['has', 'Year closed']}
              paint={{
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  12,
                  3,
                  18,
                  8
                ],
                'circle-color': '#b71c1c',
                'circle-stroke-width': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  12,
                  1,
                  18,
                  3
                ],
                'circle-stroke-color': '#ffffff',
                'circle-stroke-opacity': 0.9,
                'circle-opacity': 0.6
              }}
            />
          ) : null}
          {mapSettings.libraries ? (
            <Layer
              type='symbol'
              source-layer='libraries'
              minzoom={13}
              filter={['!', ['has', 'Year closed']]}
              layout={{
                'text-ignore-placement': false,
                'text-field': [
                  'match',
                  ['get', 'Type of library'],
                  'LAL',
                  'Local authority library',
                  'LAL-',
                  'Local authority run - unstaffed',
                  'CL',
                  'Commissioned library',
                  'CRL',
                  'Community run library',
                  'IL',
                  'Independent library',
                  'Unknown library'
                ],
                'text-font': ['Source Sans Pro Bold'],
                'text-line-height': 1,
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13,
                  12,
                  18,
                  16
                ],
                'text-offset': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13,
                  ['literal', [0, -1.5]],
                  18,
                  ['literal', [0, -2]]
                ]
              }}
              paint={{
                'text-halo-color': 'hsl(0, 0%, 100%)',
                'text-halo-width': 1,
                'text-halo-blur': 1,
                'text-color': '#6a6f73'
              }}
              onClick={clickMap}
            />
          ) : null}
          {mapSettings.libraries ? (
            <Layer
              type='symbol'
              source-layer='libraries'
              minzoom={10}
              filter={['!', ['has', 'Year closed']]}
              layout={{
                'text-ignore-placement': false,
                'text-field': ['to-string', ['get', 'Library name']],
                'text-font': ['Source Sans Pro Bold'],
                'text-line-height': 1,
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  10,
                  14,
                  18,
                  18
                ],
                'text-offset': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  10,
                  ['literal', [0, 1.5]],
                  18,
                  ['literal', [0, 2]]
                ]
              }}
              paint={{
                'text-halo-color': 'hsl(0, 0%, 100%)',
                'text-halo-width': 1,
                'text-halo-blur': 1,
                'text-color': '#6a6f73',
                'text-opacity': 1
              }}
            />
          ) : null}
          {mapSettings.libraries ? (
            <Layer
              type='circle'
              source-layer='libraries'
              minzoom={5}
              filter={['!', ['has', 'Year closed']]}
              paint={{
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  5,
                  3,
                  18,
                  12
                ],
                'circle-color': [
                  'match',
                  ['get', 'Type of library'],
                  'LAL',
                  '#1b5e20',
                  'LAL-',
                  '#388e3c',
                  'CL',
                  '#0d47a1',
                  'CRL',
                  '#e65100',
                  'ICL',
                  '#bf360c',
                  '#bf360c'
                ],
                'circle-stroke-width': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  5,
                  1,
                  18,
                  4
                ],
                'circle-stroke-color': '#ffffff',
                'circle-stroke-opacity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  5,
                  0.8,
                  18,
                  1
                ],
                'circle-opacity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  5,
                  0.4,
                  18,
                  0.9
                ]
              }}
            />
          ) : null}
        </Source>
        {searchPosition && searchPosition.length > 1 ? (
          <Marker coordinates={[searchPosition[0], searchPosition[1]]}>
            <MeAvatar searchType={searchType} />
          </Marker>
        ) : null}
        <NavigationControl position='bottom-left' />
      </Map>
      <Tooltip title='Map settings'>
        <Fab
          size='small'
          color='primary'
          sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1, color: 'white' }}
          onClick={() =>
            dispatchView({
              type: 'SetMapSettingsDialog',
              mapSettingsDialogOpen: true
            })
          }
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

export default LibraryMap
