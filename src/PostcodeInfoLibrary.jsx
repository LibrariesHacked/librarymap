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

function PostcodeInfoLibrary () {
  const [{ searchType, searchPostcode, nearestLibraries }, dispatchSearch] =
    useSearchStateValue()
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line
  const [{ serviceLookup }] = useApplicationStateValue()

  const nearestLibrary = nearestLibraries?.[0]

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
      mapFlyToPosition: [nearestLibrary.longitude, nearestLibrary.latitude],
      mapZoom: 18
    })
  }

  const serviceSystemName =
    serviceLookup[nearestLibrary?.localAuthorityCode]?.systemName

  return (
    <>
      {searchType === 'postcode' && searchPostcode && nearestLibrary && (
        <Card
          elevation={0}
          sx={theme => ({
            border: 2,
            borderColor: lighten(theme.palette.staticLibraries.main, 0.6)
          })}
        >
          <CardContent>
            <Typography variant='h5' component='span' color='text.secondary'>
              {`${Math.round(
                nearestLibrary?.distance / 1609
              )} miles from nearest library`}
            </Typography>
            <Typography
              color='staticLibraries.main'
              variant='h5'
              component='p'
              sx={{ fontWeight: 600 }}
            >
              {`${nearestLibrary?.name}`}
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              backgroundColor: theme =>
                lighten(theme.palette.staticLibraries.main, 0.9),
              justifyContent: 'space-between'
            }}
          >
            <Button
              color='secondary'
              variant='text'
              endIcon={<ArrowRightIcon />}
              to={`/service/${serviceSystemName}/${nearestLibrary?.systemName}  `}
              component={Link}
              disableElevation
            >
              Library page
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
            <IconButton onClick={viewLibrary} color='secondary' size='small'>
              <InfoIcon />
            </IconButton>
          </CardActions>
        </Card>
      )}
    </>
  )
}

export default PostcodeInfoLibrary
