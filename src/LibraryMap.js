import React, { useEffect, useState } from 'react'

import { useTheme } from '@mui/material/styles'

import Map, {
  Source,
  Layer,
  Marker,
  NavigationControl,
  AttributionControl
} from 'react-map-gl/maplibre'

// eslint-disable-next-line import/no-webpack-loader-syntax
import maplibregl from '!maplibre-gl'

import { grey } from '@mui/material/colors'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import MeAvatar from './MeAvatar'

import * as geoHelper from './helpers/geo'

const config = require('./helpers/config.json')

const builtUpAreaTiles = config.builtUpAreaTiles
const libraryTiles = config.libraryTiles
const libraryBuildingsTiles = config.libraryBuildingsTiles
const libraryAuthorityTiles = config.libraryAuthorityTiles
const stopTiles = config.stopTiles
const tripTiles = config.tripTiles

function LibraryMap (props) {
  const [{ isochrones }] = useApplicationStateValue()

  const theme = useTheme()

  const { containerStyle, clickMap } = props
  const [
    {
      searchType,
      searchPosition,
      currentService,
      displayClosedLibraries,
      nearestLibraryLine
    }
  ] = useSearchStateValue()
  const [
    { mapZoom, mapPosition, mapSettings, mapFlyToPosition, mapBounds },
    dispatchView
  ] = useViewStateValue()

  const [map, setMap] = useState(null)

  let currentServiceMask = null
  if (currentService && currentService.geojson) {
    currentServiceMask = geoHelper.getMaskFromGeoJson(
      JSON.parse(currentService.geojson)
    )
  }

  useEffect(() => {
    if (mapBounds && map) {
      map.fitBounds(mapBounds, {
        padding: 20
      })
    }
  }, [mapBounds, map])

  useEffect(() => {
    if (mapFlyToPosition && map) {
      map.flyTo({
        center: mapFlyToPosition,
        zoom: 18
      })
    }
  }, [mapFlyToPosition, map])

  const setViewState = viewState => {
    dispatchView({
      type: 'SetMapPosition',
      mapZoom: viewState.zoom,
      mapPosition: [viewState.longitude, viewState.latitude]
    })
  }

  return (
    <Map
      ref={setMap}
      mapLib={maplibregl}
      style={containerStyle}
      mapStyle='https://zoomstack.librarydata.uk/light.json'
      longitude={mapPosition[0]}
      latitude={mapPosition[1]}
      zoom={mapZoom}
      maxZoom={18}
      onMove={evt => setViewState(evt.viewState)}
      onClick={evt => clickMap(map, evt)}
    >
      <AttributionControl customAttribution='Contains OS data © Crown copyright and database right 2023' />
      {currentService && currentService.geojson && currentServiceMask ? ( // eslint-disable-line
        <Source type='geojson' data={currentServiceMask}>
          <Layer
            type='line'
            paint={{
              'line-opacity': 0.4,
              'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1, 18, 4],
              'line-color': '#455a64'
            }}
          />
          <Layer
            type='fill'
            paint={{
              'fill-opacity': 0.1,
              'fill-color': '#455a64'
            }}
          />
        </Source>
      ) : null}
      {nearestLibraryLine && (
        <Source type='geojson' data={nearestLibraryLine}>
          <Layer
            type='line'
            paint={{
              'line-opacity': 0.4,
              'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1, 18, 4],
              'line-color': theme.palette.primary.main
            }}
          />
          <Layer
            type='symbol'
            layout={{
              'symbol-placement': 'line',
              'text-field': [
                'concat',
                ['round', ['/', ['to-number', ['get', 'distance']], 1609]],
                ' mile(s)'
              ],
              'text-font': ['Source Sans Pro Bold'],
              'text-allow-overlap': false,
              'text-size': {
                base: 1.2,
                stops: [
                  [6, 14],
                  [22, 24]
                ]
              }
            }}
            paint={{
              'text-halo-color': 'rgba(255, 255, 255, 0.9)',
              'text-halo-width': 3,
              'text-halo-blur': 0,
              'text-color': theme.palette.primary.main
            }}
          />
        </Source>
      )}
      {mapSettings.builtUpAreas ? ( // eslint-disable-line
        <Source type='vector' tiles={[builtUpAreaTiles]}>
          <Layer
            type='fill'
            source-layer='built_up_areas'
            minzoom={5}
            paint={{
              'fill-color': theme.palette.primary.main,
              'fill-opacity': 0.2
            }}
          />
          <Layer
            type='line'
            source-layer='built_up_areas'
            minzoom={10}
            paint={{
              'line-color': theme.palette.primary.main,
              'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1, 18, 4],
              'line-opacity': 0.4
            }}
          />
          <Layer
            type='symbol'
            source-layer='built_up_areas'
            minzoom={12}
            layout={{
              'text-field': ['get', 'name'],
              'text-font': ['Source Sans Pro Bold'],
              'text-allow-overlap': false,
              'text-size': {
                base: 1.2,
                stops: [
                  [6, 14],
                  [22, 24]
                ]
              }
            }}
            paint={{
              'text-color': theme.palette.primary.main,
              'text-halo-color': 'rgba(255, 255, 255, 0.9)',
              'text-halo-width': 1,
              'text-halo-blur': 1,
              'text-opacity': 0.9
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
                <Source type='geojson' data={isochrones[point][transport].geo}>
                  <Layer // Shaded isochrone lines
                    type='fill'
                    paint={{
                      'fill-opacity': 0.15,
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
                      'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        6,
                        1,
                        18,
                        4
                      ],
                      'line-color': config.travel.filter(
                        t => t.name === transport
                      )[0].colour
                    }}
                  />
                  <Layer // Distances labels
                    type='symbol'
                    layout={{
                      'text-field': [
                        'concat',
                        ['to-string', ['/', ['get', 'value'], 60]],
                        ' min'
                      ],
                      'text-font': ['Source Sans Pro Bold'],
                      'symbol-placement': 'line-center',
                      'text-allow-overlap': false,
                      'text-padding': 2,
                      'text-max-angle': 85,
                      'text-size': {
                        base: 1.2,
                        stops: [
                          [8, 15],
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
                  <Layer // Population labels
                    type='symbol'
                    layout={{
                      'text-field': [
                        'number-format',
                        ['get', 'total_pop'],
                        { locale: 'en' }
                      ],
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
                          [10, 16],
                          [22, 22]
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
        <Layer // Buildings lines
          type='line'
          source-layer='library_buildings'
          minzoom={16}
          layout={{
            'line-join': 'round',
            'line-cap': 'square'
          }}
          paint={{
            'line-color': '#455a64',
            'line-opacity': 0.6,
            'line-width': ['interpolate', ['linear'], ['zoom'], 14, 2, 18, 3]
          }}
        />
        <Layer // Buildings fill
          type='fill'
          source-layer='library_buildings'
          minzoom={16}
          paint={{
            'fill-color': '#455a64',
            'fill-opacity': 0.1
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
              'fill-color': grey.A100,
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
            'line-offset': ['interpolate', ['linear'], ['zoom'], 14, 1, 18, 4],
            'line-opacity': 1,
            'line-width': ['interpolate', ['linear'], ['zoom'], 14, 1, 18, 4],
            'line-dasharray': [2, 0.5]
          }}
        />
      </Source>
      <Source type='vector' tiles={[stopTiles]}>
        {mapSettings.mobileLibraryStops ? ( // eslint-disable-line
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
        {mapSettings.mobileLibraryStops ? ( // eslint-disable-line
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
        {displayClosedLibraries ? ( // eslint-disable-line
          <Layer // Closed library names
            type='symbol'
            source-layer='libraries'
            minzoom={11}
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
        {displayClosedLibraries ? ( // eslint-disable-line
          <Layer // Closed library years
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
        {displayClosedLibraries ? ( // eslint-disable-line
          <Layer // Closed library circles
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
        {mapSettings.libraries ? ( // eslint-disable-line
          <Layer // Library type label
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
                'ICL',
                'Independent library',
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
        {mapSettings.libraries ? ( // eslint-disable-line
          <Layer // Library name
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
        {mapSettings.libraries ? ( // eslint-disable-line
          <Layer // Library circles
            type='circle'
            source-layer='libraries'
            minzoom={5}
            maxzoom={18}
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
      {searchPosition && searchPosition.length > 1 ? ( // eslint-disable-line
        <Marker longitude={searchPosition[0]} latitude={searchPosition[1]}>
          <MeAvatar searchType={searchType} />
        </Marker>
      ) : null}
      <NavigationControl position='bottom-left' />
    </Map>
  )
}

export default LibraryMap
