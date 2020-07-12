import React, { useEffect } from 'react'

import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'

import ReactMapboxGl, { ZoomControl, Source, Layer, Marker } from 'react-mapbox-gl'

import LayersIcon from '@material-ui/icons/LayersTwoTone'

import { makeStyles } from '@material-ui/core/styles'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import MeAvatar from './MeAvatar'
import MapSettings from './MapSettings'

const useStyles = makeStyles((theme) => ({
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

const libraryAuthorityTiles = [config.libraryAuthorityTiles]

function LibraryMap () {
  const [{ }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{ searchType, searchPosition }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ mapZoom, mapPosition, mapSettings, mapSettingsDialogOpen }, dispatchView] = useViewStateValue() //eslint-disable-line

  var clickLibrary = () => {
    // Do nothing
  }

  useEffect(() => {
  }, [])

  const classes = useStyles()

  return (
    <>
      <Map
        style='style.json' // eslint-disable-line
        center={mapPosition}
        zoom={mapZoom}
        maxZoom={17}
        pitch={[0]}
        bearing={[0]}
        fitBounds={null}
        containerStyle={{ top: 0, bottom: 0, right: 0, left: 0, height: '100vh', width: '100vw', position: 'absolute' }}
      >
        <Source
          id='src_libraries'
          tileJsonSource={{
            type: 'vector',
            tiles: libraryTiles
          }}
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
              5, 2,
              17, 12
            ],
            'circle-color': ['match', ['get', 'Library type'], 'LAL', '#388e3c', 'LAL-', '#81c784', 'CL', '#1769aa', 'CRL', '#f57c00', 'ICL', '#d32f2f', '#d32f2f'],
            'circle-stroke-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5, 1,
              17, 4
            ],
            'circle-stroke-color': '#FFFFFF',
            'circle-stroke-opacity': 0.7,
            'circle-opacity': 0.7
          }}
          onClick={clickLibrary}
        />
        <Layer
          id='lyr_libraries_closed_circles'
          type='circle'
          sourceId='src_libraries'
          sourceLayer='libraries'
          minZoom={5}
          filter={['has', 'Year closed']}
          paint={{
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5, 1,
              17, 8
            ],
            'circle-color': '#d32f2f',
            'circle-stroke-width': 0,
            'circle-opacity': 0.7
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
              10, 12,
              17, 22
            ],
            'text-offset': [0, 2]
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
          id='lyr_libraries_closed_name_labels'
          type='symbol'
          sourceId='src_libraries'
          sourceLayer='libraries'
          minZoom={10}
          filter={['has', 'Year closed']}
          layout={{
            'text-ignore-placement': false,
            'text-field': ['concat', 'Closed: ', ['to-string', ['get', 'Library name']]],
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
              10, 10,
              17, 20
            ],
            'text-offset': [0, 2]
          }}
          paint={{
            'text-halo-color': 'hsl(0, 0%, 100%)',
            'text-halo-width': 0,
            'text-halo-blur': 0,
            'text-color': '#d32f2f',
            'text-opacity': 0.7
          }}
          onClick={clickLibrary}
        />
        <Layer
          id='lyr_libraries_open_type_labels'
          type='symbol'
          sourceId='src_libraries'
          sourceLayer='libraries'
          minZoom={10}
          filter={['!', ['has', 'Year closed']]}
          layout={{
            'text-ignore-placement': false,
            'text-field': ['match', ['get', 'Library type'], 'LAL', 'Local authority library', 'LAL-', 'Local authority run - unstaffed', 'CL', 'Commissioned library', 'CRL', 'Community run library', 'ICL', 'Independent community library', 'Unknown library'],
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
              10, 10,
              17, 18
            ],
            'text-offset': [0, -2]
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
          id='lyr_libraries_closed_labels'
          type='symbol'
          sourceId='src_libraries'
          sourceLayer='libraries'
          minZoom={10}
          filter={['has', 'Year closed']}
          layout={{
            'text-ignore-placement': false,
            'text-field': ['concat', 'Closed in ', ['get', 'Year closed']],
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
              10, 8,
              17, 16
            ],
            'text-offset': [0, -2]
          }}
          paint={{
            'text-halo-color': 'hsl(0, 0%, 100%)',
            'text-halo-width': 0,
            'text-halo-blur': 1,
            'text-color': '#d32f2f',
            'text-opacity': 0.7
          }}
          onClick={clickLibrary}
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
                    22, 4
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
    </>
  )
}

export default LibraryMap
