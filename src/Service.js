import React, { useEffect } from 'react'

import { useParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import BusinessIcon from '@mui/icons-material/BusinessRounded'

import LibraryMap from './LibraryMap'
import Libraries from './Libraries'
import MobileLibraries from './MobileLibraries'
import SiteBreadcrumbs from './SiteBreadcrumbs'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

function Service () {
  const [{ services }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{ currentService }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line

  const { serviceSystemName } = useParams()

  useEffect(() => {
    services.forEach(service => {
      if (service.systemName === serviceSystemName) {
        dispatchSearch({
          type: 'FilterByService',
          service: service
        })

        // Position map to service
        const coords = JSON.parse(service.bbox).coordinates[0]
        dispatchView({ type: 'FitToBounds', mapBounds: [coords[0], coords[2]] })
      }
    })
  }, [services, dispatchSearch, serviceSystemName, dispatchView])

  return (
    <>
      <SiteBreadcrumbs
        currentPageName={currentService?.name}
        currentPageIcon={BusinessIcon}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Typography component='h1' variant='h3'>
          {`${currentService?.name} Libraries`}
        </Typography>
      </Box>
      <Box sx={{ border: '1px solid #ccc' }}>
        <LibraryMap
          containerStyle={{
            width: '100%',
            height: '500px',
            position: 'relative'
          }}
        />
      </Box>
      <Libraries />
      <MobileLibraries />
    </>
  )
}

export default Service
