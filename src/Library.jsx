import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import LocationCityIcon from '@mui/icons-material/LocationCityRounded'

import LibraryDetails from './LibraryDetails'
import LibraryMap from './LibraryMap'
import SiteBreadcrumbs from './SiteBreadcrumbs'

import grey from '@mui/material/colors/grey'

import { useApplicationStateValue } from './context/applicationState'
import { useViewStateValue } from './context/viewState'

import * as libraryModel from './models/library'

function Library () {
  const [{ services }] = useApplicationStateValue()
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line

  const [library, setLibrary] = useState({})

  const { serviceSystemName, librarySystemName } = useParams()

  useEffect(() => {
    const getLibrary = async (serviceSystemName, librarySystemName) => {
      const libraryData = await libraryModel.getLibraryBySystemName(
        serviceSystemName,
        librarySystemName
      )
      setLibrary(libraryData)
      dispatchView({
        type: 'FlyTo',
        mapFlyToPosition: [libraryData.longitude, libraryData.latitude],
        mapZoom: 17
      })
    }
    services.forEach(service => {
      if (service.systemName === serviceSystemName) {
        // Get the library
        getLibrary(serviceSystemName, librarySystemName)
      }
    })
  }, [services, serviceSystemName, librarySystemName, dispatchView])

  return (
    <>
      {Object.keys(library).length > 0 ? (
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
              <LibraryDetails library={library} />
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ border: '1px solid', borderColor: grey[200] }}>
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
      ) : (
        <CircularProgress color='primary' size={30} />
      )}
    </>
  )
}

export default Library
