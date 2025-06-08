import React, { useEffect, useState } from 'react'

import BenchImage from './bench.svg'

import { useTheme } from '@mui/material/styles'

import Map, {
  Source,
  Layer,
  Marker,
  NavigationControl
} from 'react-map-gl/maplibre'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import MeAvatar from './MeAvatar'

import * as geoHelper from './helpers/geo'

import config from './helpers/config.json'

const builtUpAreaTiles = config.builtUpAreaTiles
const libraryTiles = config.libraryTiles
const libraryBuildingsTiles = config.libraryBuildingsTiles
const libraryAuthorityTiles = config.libraryAuthorityTiles
const mobileTiles = config.mobileTiles
const openBenchesTiles = config.openBenchesTiles

function LibraryMap (props) {
  const [{ isochrones }] = useApplicationStateValue()

  const theme = useTheme()

  const { containerStyle, clickMap } = props
  const [
    {
      searchDistance,
      searchType,
      searchPosition,
      currentService,
      currentLibraryId,
      displayClosedLibraries,
      nearestLibrariesLines
    }
  ] = useSearchStateValue()
  const [
    { mapZoom, mapPosition, mapSettings, mapFlyToPosition, mapBounds },
    dispatchView
  ] = useViewStateValue()

  const [mapFocusMask, setMapFocusMask] = useState(null)

  const [map, setMap] = useState(null)

  useEffect(() => {
    let mask = null
    if (currentService && currentService.geojson) {
      mask = geoHelper.getMaskFromGeoJson(currentService.geojson)
      setMapFocusMask(mask)
    } else if (
      searchType === 'postcode' &&
      searchPosition &&
      searchPosition.length > 1
    ) {
      const bufferedPoint = geoHelper.getBufferedPoint(
        searchPosition,
        searchDistance
      )
      mask = geoHelper.getMaskFromGeoJson(bufferedPoint)
      dispatchView({
        type: 'FitToBounds',
        mapBounds: geoHelper.getMapBounds(bufferedPoint.coordinates[0])
      })
    }
    setMapFocusMask(mask)
  }, [currentService, searchType, searchDistance, searchPosition])

  useEffect(() => {
    if (mapBounds && map) {
      map.fitBounds(mapBounds, {
        padding: 100
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
      style={containerStyle}
      mapStyle='https://api.maptiler.com/maps/dataviz/style.json?key=1OK05AJqNta7xYzrG2kA'
      longitude={mapPosition[0]}
      latitude={mapPosition[1]}
      zoom={mapZoom}
      maxZoom={18}
      onMove={evt => setViewState(evt.viewState)}
      onClick={evt => clickMap(map, evt)}
      onLoad={() => {
        const benchImg = new window.Image(256, 256)
        benchImg.onload = () => {
          map.addImage('memorialbench', benchImg)
        }
        benchImg.src = BenchImage
      }}
    >
      {mapFocusMask ? ( // eslint-disable-line
        <Source type='geojson' data={mapFocusMask}>
          <Layer
            key='library_circles_mask'
            beforeId='library_circles'
            type='line'
            paint={{
              'line-opacity': 0.4,
              'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1, 18, 4],
              'line-color': theme.palette.secondary.main
            }}
          />
          <Layer
            type='fill'
            paint={{
              'fill-opacity': 0.1,
              'fill-color': theme.palette.secondary.main
            }}
          />
        </Source>
      ) : null}
      {nearestLibrariesLines &&
        nearestLibrariesLines.map((libraryLine, idx) => {
          return (
            <Source
              type='geojson'
              data={libraryLine}
              key={'libraryLine_' + idx}
            >
              <Layer
                type='line'
                paint={{
                  'line-opacity': 0.9,
                  'line-width': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    6,
                    1,
                    18,
                    3
                  ],
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
                    ' mi'
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
          )
        })}
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
            'line-color': theme.palette.staticLibraries.main,
            'line-opacity': 0.6,
            'line-width': ['interpolate', ['linear'], ['zoom'], 14, 2, 18, 3]
          }}
        />
        <Layer // Buildings fill
          type='fill'
          source-layer='library_buildings'
          minzoom={16}
          paint={{
            'fill-color': theme.palette.staticLibraries.main,
            'fill-opacity': 0.1
          }}
        />
      </Source>
      <Source type='vector' tiles={[libraryAuthorityTiles]}>
        {mapSettings.authorityBoundary
          ? (
            <Layer
              type='line'
              source-layer='library_authority_boundaries'
              minzoom={6}
              layout={{
                'line-join': 'round',
                'line-cap': 'square'
              }}
              paint={{
                'line-color': theme.palette.secondary.main,
                'line-opacity': 1,
                'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1, 18, 4]
              }}
            />
            )
          : null}
        {mapSettings.authorityBoundary
          ? (
            <Layer
              type='fill'
              source-layer='library_authority_boundaries'
              minzoom={6}
              paint={{
                'fill-color': theme.palette.secondary.main,
                'fill-opacity': 0.1
              }}
            />
            )
          : null}
      </Source>
      <Source type='vector' tiles={[mobileTiles]} minzoom={0} maxzoom={14}>
        {mapSettings.mobileLibraryStops ? ( // eslint-disable-line
          <Layer
            type='circle'
            source-layer='stops'
            minzoom={5}
            {...(currentService && {
              filter: [
                '==',
                currentService.code,
                ['get', 'Local authority code']
              ]
            })}
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
              'circle-color': theme.palette.secondary.main,
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
              'circle-opacity': 0.7
            }}
          />
        ) : null}
        {mapSettings.mobileLibraryStops ? ( // eslint-disable-line
          <Layer
            type='symbol'
            source-layer='stops'
            minzoom={11}
            layout={{
              'text-ignore-placement': false,
              'text-field': ['concat', 'Mobile stop: ', ['get', 'name']],
              'text-font': ['Source Sans Pro Bold'],
              'text-line-height': 1,
              'text-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                11,
                10,
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
              'text-color': theme.palette.secondary.main
            }}
          />
        ) : null}
        {mapSettings.mobileLibraryStops
          ? (
            <Layer
              type='symbol'
              source-layer='stops'
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
                'text-color': theme.palette.secondary.main
              }}
            />
            )
          : null}
        <Layer
          type='line'
          source-layer='trips'
          minzoom={14}
          {...(currentService && {
            filter: ['==', currentService.code, ['get', 'Local authority code']]
          })}
          layout={{
            'line-join': 'round',
            'line-cap': 'square'
          }}
          paint={{
            'line-color': theme.palette.mobileLibraries.main,
            'line-offset': ['interpolate', ['linear'], ['zoom'], 14, 1, 18, 4],
            'line-opacity': 1,
            'line-width': ['interpolate', ['linear'], ['zoom'], 14, 1, 18, 4],
            'line-dasharray': [2, 0.5]
          }}
        />
      </Source>
      <Source type='vector' tiles={[libraryTiles]} minzoom={0} maxzoom={14}>
        {displayClosedLibraries ? ( // eslint-disable-line
          <Layer // Closed library names
            type='symbol'
            source-layer='libraries'
            minzoom={8}
            filter={
              currentService
                ? [
                    'all',
                    ['has', 'Year closed'],
                    ['==', currentService.code, ['get', 'Local authority code']]
                  ]
                : ['has', 'Year closed']
            }
            layout={{
              'text-ignore-placement': false,
              'text-field': ['to-string', ['get', 'Library name']],
              'text-font': ['Source Sans Pro Bold'],
              'text-line-height': 1,
              'text-size': ['interpolate', ['linear'], ['zoom'], 10, 8, 18, 14],
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
              'text-color': theme.palette.secondary.main,
              'text-opacity': 0.9
            }}
          />
        ) : null}
        {displayClosedLibraries ? ( // eslint-disable-line
          <Layer // Closed library years
            type='symbol'
            source-layer='libraries'
            minzoom={12}
            filter={
              currentService
                ? [
                    'all',
                    ['has', 'Year closed'],
                    ['==', currentService.code, ['get', 'Local authority code']]
                  ]
                : ['has', 'Year closed']
            }
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
              'text-color': theme.palette.error.main,
              'text-opacity': 0.9
            }}
          />
        ) : null}
        {displayClosedLibraries ? ( // eslint-disable-line
          <Layer // Closed library circles
            type='circle'
            source-layer='libraries'
            minzoom={11}
            filter={
              currentService
                ? [
                    'all',
                    ['has', 'Year closed'],
                    ['==', currentService.code, ['get', 'Local authority code']]
                  ]
                : ['has', 'Year closed']
            }
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
              'circle-color': theme.palette.error.main,
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
              'circle-stroke-opacity': 1,
              'circle-opacity': 1
            }}
          />
        ) : null}
        {mapSettings.libraries ? ( // eslint-disable-line
          <Layer // Library type label
            type='symbol'
            source-layer='libraries'
            minzoom={13}
            filter={
              currentService
                ? [
                    'all',
                    ['!', ['has', 'Year closed']],
                    ['==', currentService.code, ['get', 'Local authority code']]
                  ]
                : ['!', ['has', 'Year closed']]
            }
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
              'text-color': theme.palette.secondary.main
            }}
            onClick={clickMap}
          />
        ) : null}
        {mapSettings.libraries ? ( // eslint-disable-line
          <Layer // Library name
            type='symbol'
            source-layer='libraries'
            minzoom={10}
            filter={
              currentService
                ? [
                    'all',
                    ['!', ['has', 'Year closed']],
                    ['==', currentService.code, ['get', 'Local authority code']]
                  ]
                : ['!', ['has', 'Year closed']]
            }
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
                10,
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
              'text-color': theme.palette.secondary.main,
              'text-opacity': 1
            }}
          />
        ) : null}
        {mapSettings.libraries && ( // eslint-disable-line
          <Layer // Library circles
            key='library_circles'
            id='library_circles'
            type='circle'
            source-layer='libraries'
            minzoom={5}
            maxzoom={18}
            filter={
              currentService
                ? [
                    'all',
                    ['!', ['has', 'Year closed']],
                    ['!=', ['get', 'id'], currentLibraryId],
                    ['==', currentService.code, ['get', 'Local authority code']]
                  ]
                : [
                    'all',
                    ['!', ['has', 'Year closed']],
                    ['!=', ['get', 'id'], currentLibraryId]
                  ]
            }
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
              'circle-color': theme.palette.staticLibraries.main,
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
              'circle-stroke-opacity': 1,
              'circle-opacity': 0.7
            }}
          />
        )}
      </Source>
      <Source type='vector' tiles={[openBenchesTiles]} minzoom={5} maxzoom={14}>
        <Layer
          type='symbol'
          source-layer='benches'
          minzoom={16}
          maxzoom={22}
          layout={{
            'icon-image': 'memorialbench', // reference the image
            'icon-size': 0.1
          }}
        />
        <Layer
          type='symbol'
          source-layer='benches'
          minzoom={18}
          maxzoom={22}
          layout={{
            'text-field': ['get', 'popupContent'],
            'text-font': ['Source Sans Pro SemiBold'],
            'text-allow-overlap': false,
            'text-anchor': 'top',
            'text-offset': [0, 1.5],
            'text-size': {
              base: 1.2,
              stops: [
                [18, 12],
                [22, 14]
              ]
            }
          }}
          paint={{
            'text-color': theme.palette.secondary.main,
            'text-halo-color': 'rgba(255, 255, 255, 0.9)',
            'text-halo-width': 1,
            'text-halo-blur': 1,
            'text-opacity': 0.9
          }}
        />
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
