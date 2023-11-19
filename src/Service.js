import React, { useEffect } from 'react'

import { useParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import ListSubheader from '@mui/material/ListSubheader'
import Typography from '@mui/material/Typography'

import BusinessIcon from '@mui/icons-material/BusinessRounded'

import LibraryMap from './LibraryMap'
import Libraries from './Libraries'
import MobileLibraries from './MobileLibraries'
import ServiceActions from './ServiceActions'
import ServiceDetails from './ServiceDetails'
import SiteBreadcrumbs from './SiteBreadcrumbs'
import SocialIcons from './SocialIcons'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import * as stopModel from './models/stop'
import * as libraryModel from './models/library'
import * as serviceModel from './models/service'

function Service () {
  const [{ services }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{ currentService }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ loadingLibraryOrMobileLibrary }, dispatchView] = useViewStateValue() //eslint-disable-line

  const { serviceSystemName } = useParams()

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
        if (feature.sourceLayer === 'stop') {
          await clickStop(feature, event.point)
          break
        }
      }
    }
    dispatchView({
      type: 'ToggleLoadingLibraryOrMobileLibrary'
    })
  }

  const clickLibrary = async (feature, point) => {
    const id = feature.properties.id
    const library = await libraryModel.getLibraryById(id)
    dispatchSearch({
      type: 'SetCurrentLibrary',
      currentLibraryId: id,
      currentPoint: [library.longitude, library.latitude]
    })
    dispatchView({ type: 'SetLibraryDialog', libraryDialogOpen: true })
  }

  const clickStop = async (feature, point) => {
    const id = feature.properties.id
    const stop = await stopModel.getStopById(id)
    dispatchSearch({
      type: 'SetCurrentStop',
      currentStopId: id,
      currentPoint: [stop.longitude, stop.latitude]
    })
    dispatchView({ type: 'SetStopDialog', stopDialogOpen: true })
  }

  useEffect(() => {
    const setService = async service => {
      const serviceFull = await serviceModel.getService(service.code)
      const coords = serviceFull.bbox.coordinates[0]
      dispatchApplication({ type: 'UpdateServiceGeo', service: serviceFull })
      dispatchView({ type: 'FitToBounds', mapBounds: [coords[0], coords[2]] })
      dispatchSearch({
        type: 'FilterByService',
        service: service
      })
    }

    services.forEach(service => {
      if (service.systemName === serviceSystemName) setService(service)
    })
  }, [
    services,
    serviceSystemName,
    dispatchSearch,
    dispatchView,
    dispatchApplication
  ])

  return (
    <>
      <SiteBreadcrumbs
        currentPageName={currentService?.name}
        currentPageIcon={BusinessIcon}
      />
      {currentService && currentService.extended && (
        <>
          <Box sx={{ textAlign: 'center', margin: theme => theme.spacing() }}>
            <Typography component='h1' variant='h2'>
              {`${currentService?.niceName}`}
            </Typography>
            <SocialIcons
              facebookPageName={currentService?.extended?.facebookPageName}
              twitterHandle={currentService?.extended?.twitterHandle}
              youTubeId={currentService?.extended?.youTubeId}
            />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <ServiceDetails service={currentService} />
              <ServiceActions service={currentService} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <ListSubheader disableGutters disableSticky>
                  Map of libraries
                </ListSubheader>
                <LibraryMap
                  containerStyle={{
                    width: '100%',
                    height: '500px',
                    position: 'relative'
                  }}
                  clickMap={clickMap}
                />
              </Box>
            </Grid>
          </Grid>
          <Libraries />
          <MobileLibraries />
        </>
      )}
    </>
  )
}

export default Service
