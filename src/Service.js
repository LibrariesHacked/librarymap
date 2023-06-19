import React, { useEffect } from 'react'

import { useParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import LibraryMap from './LibraryMap'
import Libraries from './Libraries'
import MobileLibraries from './MobileLibraries'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'

function Service () {
  const [{ services }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{ currentService }, dispatchSearch] = useSearchStateValue() //eslint-disable-line

  const { serviceSystemName } = useParams()

  useEffect(() => {
    services.forEach(service => {
      if (service.systemName === serviceSystemName) {
        dispatchSearch({
          type: 'FilterByService',
          service: service
        })
      }
    })
  }, [services, dispatchSearch, serviceSystemName])

  return (
    <>
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
