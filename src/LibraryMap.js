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

const libraryAuthorityTiles = [config.libraryAuthorityTiles]

function LibraryMap () {
  const [{ }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{ searchType, searchPosition }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ mapZoom, mapPosition, mapSettings, mapSettingsDialogOpen }, dispatchView] = useViewStateValue() //eslint-disable-line

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
