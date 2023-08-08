import React from 'react'

import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ListSubheader from '@mui/material/ListSubheader'
import Typography from '@mui/material/Typography'

import InfoIcon from '@mui/icons-material/InfoOutlined'
import LocationOnIcon from '@mui/icons-material/LocationOnRounded'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

function PostcodeInfo () {
  const [{ serviceLookup }] = useApplicationStateValue()
  const [
    {
      searchType,
      searchPostcode,
      searchPosition,
      nearestLibrary,
      postcodeServiceCode
    },
    dispatchSearch
  ] = useSearchStateValue()
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line

  const postcodeService = serviceLookup[postcodeServiceCode]

  const viewLibrary = () => {
    dispatchSearch({
      type: 'SetCurrentLibrary',
      currentLibraryId: nearestLibrary.id
    })
    dispatchView({ type: 'SetLibraryDialog', libraryDialogOpen: true })
  }

  const viewMap = () => {
    dispatchView({
      type: 'FlyTo',
      mapFlyToPosition: [searchPosition[0], searchPosition[1]],
      mapZoom: 16
    })
  }

  return (
    <>
      {searchType === 'postcode' && searchPostcode && nearestLibrary && (
        <>
          <ListSubheader
            disableSticky
            disableGutters
          >{`Search results`}</ListSubheader>
          <Typography variant='body' color='text.secondary'>
            {`${searchPostcode} is within ${postcodeService?.name}. `}
            {`Your closest library is ${
              nearestLibrary?.name
            }, about ${Math.round(
              nearestLibrary?.distance / 1609
            )} mile(s) away.`}
          </Typography>
          <Box sx={{ paddingTop: theme => theme.spacing(2) }}>
            <Button
              variant='text'
              startIcon={<LocationOnIcon />}
              onClick={viewMap}
              component={Link}
              to={'/map'}
            >
              View on map
            </Button>
            <Button
              variant='text'
              startIcon={<InfoIcon />}
              sx={{ marginLeft: theme => theme.spacing(1) }}
              onClick={viewLibrary}
            >
              Library details
            </Button>
          </Box>
        </>
      )}
    </>
  )
}

export default PostcodeInfo
