import React from 'react'

import { Link } from 'react-router-dom'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import ArrowRightIcon from '@mui/icons-material/ArrowRightTwoTone'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import LocationOnIcon from '@mui/icons-material/LocationOnRounded'

import { lighten } from '@mui/material'

import { grey } from '@mui/material/colors'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'
import { useApplicationStateValue } from './context/applicationState'

function PostcodeInfo () {
  const [{ searchType, searchPostcode, nearestLibrary }, dispatchSearch] =
    useSearchStateValue()
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line
  const [{ serviceLookup }] = useApplicationStateValue()

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
          sx={{
            border: 1,
            borderColor: grey[200]
          }}
        >
          <CardContent>
            <Typography variant='h5' component='span' color='text.secondary'>
              {`${nearestLibrary?.name}`}
            </Typography>
            <br />
            <Typography variant='subtitle1' color='text.secondary'>
              {`${Math.round(nearestLibrary?.distance / 1609)} miles away`}
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              backgroundColor: theme => lighten(grey[200], 0.6)
            }}
          >
            <Button
              color='primary'
              variant='text'
              endIcon={<ArrowRightIcon />}
              to={`/service/${serviceSystemName}/${nearestLibrary?.systemName}  `}
              component={Link}
              disableElevation
            >
              {nearestLibrary?.name}
            </Button>
            <Button
              endIcon={<InfoIcon />}
              sx={{ marginLeft: theme => theme.spacing(1) }}
              onClick={viewLibrary}
            >
              Quick info
            </Button>
            <Button
              size='small'
              endIcon={<LocationOnIcon />}
              onClick={viewMap}
              component={Link}
              to='/map'
            >
              Map
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  )
}

export default PostcodeInfo
