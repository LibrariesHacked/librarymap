import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import LocationCityIcon from '@mui/icons-material/LocationCityRounded'

import LibraryMap from './LibraryMap'
import SiteBreadcrumbs from './SiteBreadcrumbs'

import { useApplicationStateValue } from './context/applicationState'

import * as libraryModel from './models/library'

function Library () {
  const [{ services }] = useApplicationStateValue()

  const [library, setLibrary] = useState({})

  const { serviceSystemName, librarySystemName } = useParams()

  useEffect(() => {
    const getLibrary = async (serviceSystemName, librarySystemName) => {
      const libraryData = await libraryModel.getLibraryBySystemName(
        serviceSystemName,
        librarySystemName
      )
      setLibrary(libraryData)
    }
    services.forEach(service => {
      if (service.systemName === serviceSystemName) {
        // Get the library
        getLibrary(serviceSystemName, librarySystemName)
      }
    })
  }, [services, serviceSystemName, librarySystemName])

  return (
    <>
      <SiteBreadcrumbs
        currentPageName={library.name}
        currentPageIcon={LocationCityIcon}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Typography component='h1' variant='h3'>
          {`${library?.name}`}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          Library details
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ border: '1px solid #ccc' }}>
            <LibraryMap
              containerStyle={{
                width: '100%',
                height: '250px',
                position: 'relative'
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default Library
