import React from 'react'

import { Link } from 'react-router-dom'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import ArrowRightIcon from '@mui/icons-material/ArrowRightTwoTone'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import LocationOnIcon from '@mui/icons-material/LocationOnRounded'

import { lighten } from '@mui/material'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'
import { useApplicationStateValue } from './context/applicationState'

function PostcodeInfoMobileStop () {
  const [
    { searchType, searchPostcode, nearestMobileLibraryStops },
    dispatchSearch
  ] = useSearchStateValue()
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line
  const [{ serviceLookup }] = useApplicationStateValue()

  const nearestMobileLibraryStop = nearestMobileLibraryStops?.[0]

  const viewStop = () => {
    dispatchSearch({
      type: 'SetCurrentStop',
      currentStopId: nearestMobileLibraryStop.id,
      currentPoint: [
        nearestMobileLibraryStop.longitude,
        nearestMobileLibraryStop.latitude
      ]
    })
    dispatchView({ type: 'SetStopDialog', stopDialogOpen: true })
  }

  const viewMap = () => {
    dispatchView({
      type: 'FlyTo',
      mapFlyToPosition: [
        nearestMobileLibraryStop.longitude,
        nearestMobileLibraryStop.latitude
      ],
      mapZoom: 18
    })
  }

  const serviceSystemName =
    serviceLookup[nearestMobileLibraryStop?.organisationCode]?.systemName

  return (
    <>
      {searchType === 'postcode' && searchPostcode && nearestMobileLibraryStop && (
        <Card
          elevation={0}
          sx={theme => ({
            border: 2,
            borderColor: lighten(theme.palette.mobileLibraries.main, 0.6)
          })}
        >
          <CardContent>
            <Typography variant='h5' component='span' color='text.secondary'>
              {`${Math.round(
                nearestMobileLibraryStop?.distance / 1609
              )} miles from nearest mobile`}
            </Typography>
            <Typography
              color='mobileLibraries.main'
              variant='h5'
              component='p'
              sx={{ fontWeight: 600 }}
            >
              {`${nearestMobileLibraryStop?.name}`}
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              backgroundColor: theme =>
                lighten(theme.palette.mobileLibraries.main, 0.9),
              justifyContent: 'space-between'
            }}
          >
            <Button
              color='secondary'
              variant='text'
              endIcon={<ArrowRightIcon />}
              to={`/service/${serviceSystemName}/${nearestMobileLibraryStop?.systemName}  `}
              component={Link}
              disableElevation
            >
              Stop page
            </Button>
            <Button
              size='small'
              endIcon={<LocationOnIcon />}
              onClick={viewMap}
              component={Link}
              to='/map'
              color='secondary'
            >
              On map
            </Button>
            <IconButton onClick={viewStop} color='secondary' size='small'>
              <InfoIcon />
            </IconButton>
          </CardActions>
        </Card>
      )}
    </>
  )
}

export default PostcodeInfoMobileStop
