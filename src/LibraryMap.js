import React, { useEffect } from 'react'

import Fab from '@material-ui/core/Fab'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'

import ReactMapboxGl, { ZoomControl, Source, Layer, GeoJSONLayer, Marker } from 'react-mapbox-gl'

import LayersIcon from '@material-ui/icons/LayersTwoTone'
import DirectionsBike from '@material-ui/icons/DirectionsBikeTwoTone'
import DirectionsWalk from '@material-ui/icons/DirectionsWalkTwoTone'
import DirectionsCar from '@material-ui/icons/DirectionsCarTwoTone'

import { makeStyles } from '@material-ui/core/styles'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import MeAvatar from './MeAvatar'
import MapSettings from './MapSettings'

import * as isochroneModel from './models/isochrone'

const useStyles = makeStyles((theme) => ({
  listItemRoot: {
    minWidth: 34
  },
  menu: {
    border: '1px solid #E0E0E0'
  },
  settings: {
    position: 'absolute',
    bottom: theme.spacing(4),
    right: theme.spacing(4)
  }
}))

const config = require('./helpers/config.json')

const Map = ReactMapboxGl({
  minZoom: 5,
  maxZoom: 18,
  customAttribution: 'Contains public sector information licensed under the Open Government Licence'
})

const libraryTiles = [config.libraryTiles]
const libraryBuildingsTiles = [config.libraryBuildingsTiles]
const libraryAuthorityTiles = [config.libraryAuthorityTiles]
const stopTiles = [config.stopTiles]
const tripTiles = [config.tripTiles]

function LibraryMap () {
  const [{ isochrones }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{ searchType, searchPosition, currentStopId, currentLibraryId, currentPoint }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ mapZoom, mapPosition, mapSettings, mapSettingsDialogOpen, isochronesMenuOpen, isochronesMenuAnchor }, dispatchView] = useViewStateValue() //eslint-disable-line

  useEffect(() => {
  }, [])

  var clickLibrary = (map) => {
    if (map && map.features && map.features.length > 0 && map.features[0].properties) {
      dispatchSearch({ type: 'SetCurrentLibrary', currentLibraryId: map.features[0].properties.id, currentPoint: [map.features[0].geometry.coordinates[0].toFixed(2), map.features[0].geometry.coordinates[1].toFixed(2)] })
      dispatchView({ type: 'SetIsochronesMenu', isochronesMenuOpen: true, isochronesMenuAnchor: { left: map.point.x, top: map.point.y } })
    }
  }

  const clickStop = (map) => {
    if (map && map.features && map.features.length > 0 && map.features[0].properties) {
      dispatchSearch({ type: 'SetCurrentStop', currentStopId: map.features[0].properties.id, currentPoint: [map.features[0].geometry.coordinates[0].toFixed(2), map.features[0].geometry.coordinates[1].toFixed(2)] })
      dispatchView({ type: 'SetIsochronesMenu', isochronesMenuOpen: true, isochronesMenuAnchor: { left: map.point.x, top: map.point.y } })
    }
  }

  var moreInfoIsochronesMenu = () => {
    closeIsochronesMenu()
    if (currentStopId) dispatchView({ type: 'SetStopDialog', stopDialogOpen: true })
    if (currentLibraryId) dispatchView({ type: 'SetLibraryDialog', libraryDialogOpen: true })
  }

  var toggleIsochrone = async (transport) => {
    if (isochrones[currentPoint] && isochrones[currentPoint][transport]) {
      dispatchApplication({ type: 'SetIsochroneDisplay', point: currentPoint, transport: transport, display: !isochrones[currentPoint][transport].display })
    } else {
      const isochrone = await isochroneModel.getIsochrone(currentPoint, transport)
      dispatchApplication({ type: 'AddIsochrone', point: currentPoint, transport: transport, isochrone: isochrone })
    }
  }

  var closeIsochronesMenu = () => dispatchView({ type: 'SetIsochronesMenu', isochronesMenuOpen: false, isochronesMenuAnchor: null })

  const classes = useStyles()

  const travelIcons = {
    'cycling-regular': <DirectionsBike fontSize='small' color={isochrones[currentPoint] && isochrones[currentPoint]['cycling-regular'] && isochrones[currentPoint]['cycling-regular'].display ? 'primary' : 'secondary'} />,
    'driving-car': <DirectionsCar fontSize='small' color={isochrones[currentPoint] && isochrones[currentPoint]['driving-car'] && isochrones[currentPoint]['driving-car'].display ? 'primary' : 'secondary'} />,
    'foot-walking': <DirectionsWalk fontSize='small' color={isochrones[currentPoint] && isochrones[currentPoint]['foot-walking'] && isochrones[currentPoint]['foot-walking'].display ? 'primary' : 'secondary'} />
  }

  return (
    <>
      <Map
        style='style.json' // eslint-disable-line
        center={mapPosition}
        zoom={mapZoom}
        maxZoom={18}
        pitch={[0]}
        bearing={[0]}
        fitBounds={null}
        containerStyle={{ top: 0, bottom: 0, right: 0, left: 0, height: '100vh', width: '100vw', position: 'absolute' }}
      >
        {Object.keys(isochrones).map(point => {
          return Object.keys(isochrones[point])
            .filter(transport => {
              return isochrones[point][transport].display
            })
            .map((transport, x) => {
              return (
                <span key={'sp_isotransport_' + x}>
                  <GeoJSONLayer // Shows the shaded polygons
                    data={isochrones[point][transport].geo}
                    fillPaint={{
                      'fill-opacity': 0.1,
                      'fill-antialias': true,
                      'fill-color': config.travel.filter(t => t.name === transport)[0].colour
                    }}
                    fillOnClick={(e) => { }}
                  />
                  <GeoJSONLayer // Shows the outlines of the distances
                    data={isochrones[point][transport].geo}
                    linePaint={{
                      'line-opacity': 0.4,
                      'line-width': 2,
                      'line-color': config.travel.filter(t => t.name === transport)[0].colour
                    }}
                  />
                  <GeoJSONLayer // Shows the distances labels
                    data={isochrones[point][transport].geo}
                    symbolLayout={{
                      'text-field': ['concat', ['to-string', ['/', ['get', 'value'], 60]], ' min'],
                      'text-font': ['Source Sans Pro Bold'],
                      'symbol-placement': 'line',
                      'text-allow-overlap': false,
                      'text-padding': 2,
                      'text-max-angle': 90,
                      'text-size': {
                        base: 1.2,
                        stops: [[8, 12], [22, 30]]
                      },
                      'text-letter-spacing': 0.1
                    }}
                    symbolPaint={{
                      'text-halo-color': 'rgba(255, 255, 255, 0.9)',
                      'text-halo-width': 4,
                      'text-halo-blur': 2,
                      'text-color': config.travel.filter(t => t.name === transport)[0].colour
                    }}
                  />
                  <GeoJSONLayer // Shows the distances labels
                    data={isochrones[point][transport].geo}
                    symbolLayout={{
                      'text-field': ['concat', ['get', 'total_pop']],
                      'text-font': ['Source Sans Pro Regular'],
                      'symbol-placement': 'line',
                      'text-allow-overlap': false,
                      'text-keep-upright': false,
                      'text-padding': 2,
                      'text-max-angle': 90,
                      'text-offset': [0, 1],
                      'text-size': {
                        base: 1.2,
                        stops: [[8, 8], [22, 14]]
                      },
                      'text-letter-spacing': 0.1
                    }}
                    symbolPaint={{
                      'text-halo-color': 'rgba(255, 255, 255, 0.9)',
                      'text-halo-width': 0,
                      'text-halo-blur': 0,
                      'text-color': config.travel.filter(t => t.name === transport)[0].colour
                    }}
                  />
                </span>)
            })
        })}
        <Source
          id='src_libraries_buildings'
          tileJsonSource={{
            type: 'vector',
            tiles: libraryBuildingsTiles
          }}
        />
        <Layer
          id='lyr_library_buildings_lines'
          type='line'
          sourceId='src_libraries_buildings'
          sourceLayer='library_buildings'
          minZoom={15}
          layout={{
            'line-join': 'round',
            'line-cap': 'square'
          }}
          paint={{
            'line-color': '#455a64',
            'line-opacity': 1,
            'line-width': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              15, 3,
              18, 4
            ]
          }}
        />
        <Layer
          id='lyr_library_buildings_fill'
          type='fill'
          sourceId='src_libraries_buildings'
          sourceLayer='library_buildings'
          minZoom={15}
          paint={{
            'fill-color': '#455a64',
            'fill-opacity': 0.4
          }}
        />
        <Source
          id='src_library_authorities'
          tileJsonSource={{
            type: 'vector',
            tiles: libraryAuthorityTiles
          }}
        />
        {mapSettings.authorityBoundary
          ? (
            <>
              <Layer
                id='lyr_library_authorities_lines'
                type='line'
                sourceId='src_library_authorities'
                sourceLayer='library_authority_boundaries'
                minZoom={6}
                layout={{
                  'line-join': 'round',
                  'line-cap': 'square'
                }}
                paint={{
                  'line-color': '#a7a39b',
                  'line-opacity': 1,
                  'line-width': [
                    'interpolate',
                    [
                      'linear'
                    ],
                    [
                      'zoom'
                    ],
                    6, 1,
                    18, 4
                  ]
                }}
              />
              <Layer
                id='lyr_library_authorities_fill'
                type='fill'
                sourceId='src_library_authorities'
                sourceLayer='library_authority_boundaries'
                minZoom={6}
                paint={{
                  'fill-color': '#ccc',
                  'fill-opacity': 0.1
                }}
              />
            </>
          ) : null}
        <Source
          id='src_trips'
          tileJsonSource={{
            type: 'vector',
            tiles: tripTiles
          }}
        />
        <Layer
          id='lyr_trips_lines'
          type='line'
          sourceId='src_trips'
          sourceLayer='trip'
          minZoom={14}
          layout={{
            'line-join': 'round',
            'line-cap': 'square'
          }}
          paint={{
            'line-color': '#a7a39b',
            'line-offset': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              14, 1,
              18, 4
            ],
            'line-opacity': 1,
            'line-width': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              14, 1,
              18, 4
            ],
            'line-dasharray': [
              2,
              0.5
            ]
          }}
        />
        <Source
          id='src_stops'
          tileJsonSource={{
            type: 'vector',
            tiles: stopTiles
          }}
        />
        <Layer
          id='lyr_stops_circles'
          type='circle'
          sourceId='src_stops'
          sourceLayer='stop'
          minZoom={5}
          layout={{}}
          paint={{
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5, 2,
              18, 8
            ],
            'circle-color': '#455a64',
            'circle-stroke-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5, 1,
              18, 3
            ],
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.5
          }}
          onClick={clickStop}
        />
        <Layer
          id='lyr_stops_labels'
          type='symbol'
          sourceId='src_stops'
          sourceLayer='stop'
          minZoom={13}
          layout={{
            'text-ignore-placement': false,
            'text-field': ['concat', 'Mobile: ', ['get', 'name']],
            'text-font': [
              'Source Sans Pro Bold'
            ],
            'text-line-height': 1,
            'text-size': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              13, 12,
              18, 18
            ],
            'text-offset': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              13, ['literal', [0, 1.5]],
              18, ['literal', [0, 2]]
            ]
          }}
          paint={{
            'text-halo-color': 'hsl(0, 0%, 100%)',
            'text-halo-width': 1,
            'text-halo-blur': 1,
            'text-color': '#6a6f73'
          }}
          onClick={clickStop}
        />
        <Layer
          id='lyr_stops_next_visiting'
          type='symbol'
          sourceId='src_stops'
          sourceLayer='stop'
          minZoom={14}
          layout={{
            'text-ignore-placement': false,
            'text-field': ['to-string', ['get', 'next_visiting']],
            'text-font': [
              'Source Sans Pro Bold'
            ],
            'text-line-height': 1,
            'text-size': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              14, 10,
              18, 16
            ],
            'text-offset': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              13, ['literal', [0, -1.5]],
              18, ['literal', [0, -2]]
            ]
          }}
          paint={{
            'text-halo-color': 'hsl(0, 0%, 100%)',
            'text-halo-width': 1,
            'text-halo-blur': 1,
            'text-color': '#6a6f73'
          }}
          onClick={clickStop}
        />
        <Source
          id='src_libraries'
          tileJsonSource={{
            type: 'vector',
            tiles: libraryTiles
          }}
        />
        <Layer
          id='lyr_libraries_closed_name_labels'
          type='symbol'
          sourceId='src_libraries'
          sourceLayer='libraries'
          minZoom={12}
          filter={['has', 'Year closed']}
          layout={{
            'text-ignore-placement': false,
            'text-field': ['to-string', ['get', 'Library name']],
            'text-font': [
              'Source Sans Pro Bold'
            ],
            'text-line-height': 1,
            'text-size': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              12, 10,
              18, 14
            ],
            'text-offset': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              12, ['literal', [0, 1.5]],
              18, ['literal', [0, 2]]
            ]
          }}
          paint={{
            'text-halo-color': 'hsl(0, 0%, 100%)',
            'text-halo-width': 0,
            'text-halo-blur': 0,
            'text-color': '#d32f2f',
            'text-opacity': 0.9
          }}
          onClick={clickLibrary}
        />
        <Layer
          id='lyr_libraries_closed_labels'
          type='symbol'
          sourceId='src_libraries'
          sourceLayer='libraries'
          minZoom={12}
          filter={['has', 'Year closed']}
          layout={{
            'text-ignore-placement': false,
            'text-field': ['concat', 'Closed ', ['get', 'Year closed']],
            'text-font': [
              'Source Sans Pro Bold'
            ],
            'text-line-height': 1,
            'text-size': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              12, 10,
              18, 14
            ],
            'text-offset': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              12, ['literal', [0, -1.5]],
              18, ['literal', [0, -2]]
            ]
          }}
          paint={{
            'text-halo-color': 'hsl(0, 0%, 100%)',
            'text-halo-width': 0,
            'text-halo-blur': 1,
            'text-color': '#d32f2f',
            'text-opacity': 0.9
          }}
          onClick={clickLibrary}
        />
        <Layer
          id='lyr_libraries_closed_circles'
          type='circle'
          sourceId='src_libraries'
          sourceLayer='libraries'
          minZoom={11}
          filter={['has', 'Year closed']}
          paint={{
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, 3,
              18, 8
            ],
            'circle-color': '#b71c1c',
            'circle-stroke-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, 1,
              18, 3
            ],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-opacity': 0.9,
            'circle-opacity': 0.6
          }}
          onClick={clickLibrary}
        />
        <Layer
          id='lyr_libraries_open_type_labels'
          type='symbol'
          sourceId='src_libraries'
          sourceLayer='libraries'
          minZoom={13}
          filter={['!', ['has', 'Year closed']]}
          layout={{
            'text-ignore-placement': false,
            'text-field': ['match', ['get', 'Library type'], 'LAL', 'Local authority library', 'LAL-', 'Local authority run - unstaffed', 'CL', 'Commissioned library', 'CRL', 'Community run library', 'IL', 'Independent library', 'Unknown library'],
            'text-font': [
              'Source Sans Pro Bold'
            ],
            'text-line-height': 1,
            'text-size': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              13, 12,
              18, 16
            ],
            'text-offset': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              13, ['literal', [0, -1.5]],
              18, ['literal', [0, -2]]
            ]
          }}
          paint={{
            'text-halo-color': 'hsl(0, 0%, 100%)',
            'text-halo-width': 1,
            'text-halo-blur': 1,
            'text-color': '#6a6f73'
          }}
          onClick={clickLibrary}
        />
        <Layer
          id='lyr_libraries_open_name_labels'
          type='symbol'
          sourceId='src_libraries'
          sourceLayer='libraries'
          minZoom={10}
          filter={['!', ['has', 'Year closed']]}
          layout={{
            'text-ignore-placement': false,
            'text-field': ['to-string', ['get', 'Library name']],
            'text-font': [
              'Source Sans Pro Bold'
            ],
            'text-line-height': 1,
            'text-size': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              10, 14,
              18, 18
            ],
            'text-offset': [
              'interpolate',
              [
                'linear'
              ],
              [
                'zoom'
              ],
              10, ['literal', [0, 1.5]],
              18, ['literal', [0, 2]]
            ]
          }}
          paint={{
            'text-halo-color': 'hsl(0, 0%, 100%)',
            'text-halo-width': 1,
            'text-halo-blur': 1,
            'text-color': '#6a6f73',
            'text-opacity': 1
          }}
          onClick={clickLibrary}
        />
        <Layer
          id='lyr_libraries_open_circles'
          type='circle'
          sourceId='src_libraries'
          sourceLayer='libraries'
          minZoom={5}
          filter={['!', ['has', 'Year closed']]}
          paint={{
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5, 3,
              18, 12
            ],
            'circle-color': ['match', ['get', 'Library type'], 'LAL', '#1b5e20', 'LAL-', '#388e3c', 'CL', '#0d47a1', 'CRL', '#e65100', 'ICL', '#bf360c', '#bf360c'],
            'circle-stroke-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5, 1,
              18, 4
            ],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5, 0.8,
              18, 1
            ],
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5, 0.4,
              18, 0.9
            ]
          }}
          onClick={clickLibrary}
        />
        {searchPosition && searchPosition.length > 1
          ? (
            <Marker
              key='mk_me'
              coordinates={[searchPosition[0], searchPosition[1]]}
            >
              <MeAvatar searchType={searchType} />
            </Marker>
          )
          : null}
        <ZoomControl position='bottom-left' />
      </Map>
      <Tooltip
        title='Map settings'
      >
        <Fab
          size='small'
          className={classes.settings}
          color='primary'
          style={{
            color: 'white',
            border: '1px solid #FFFFFF'
          }}
          onClick={() => dispatchView({ type: 'SetMapSettingsDialog', mapSettingsDialogOpen: true })}
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
        className={classes.menu}
        keepMounted
        open={isochronesMenuOpen}
        onClose={closeIsochronesMenu}
      >
        <MenuItem dense onClick={moreInfoIsochronesMenu}>
          <ListItemIcon classes={{
            root: classes.listItemRoot
          }}
          >
            <LayersIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='More info' />
        </MenuItem>
        {config.travel.map((travel, idx) => {
          return (
            <MenuItem dense key={'mnu_trv_' + idx} onClick={() => toggleIsochrone(travel.name)}>
              <ListItemIcon classes={{
                root: classes.listItemRoot
              }}
              >
                {travelIcons[travel.name]}
              </ListItemIcon>
              <ListItemText primary={travel.description} />
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

export default LibraryMap
