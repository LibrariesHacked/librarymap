import React, { useEffect } from 'react'

import { useParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'

function Service () {
  const [{ services }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{ currentService }, dispatchSearch] = useSearchStateValue() //eslint-disable-line

  let { service_system_name } = useParams()

  useEffect(() => {
    services.forEach(service => {
      if (service.systemName === service_system_name) {
        dispatchSearch({
          type: 'FilterByService',
          service: service
        })
      }
    })
  }, [services, dispatchSearch, service_system_name])

  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <Typography component='h1' variant='h2'>
          {`${currentService?.name} Libraries`}
        </Typography>
      </Box>
    </>
  )
}

export default Service
