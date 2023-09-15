import React from 'react'

import { Link } from 'react-router-dom'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import InfoIcon from '@mui/icons-material/InfoOutlined'
import LocationOnIcon from '@mui/icons-material/LocationOnRounded'

import { lighten } from '@mui/material'

import { grey } from '@mui/material/colors'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

function PostcodeInfo () {
  const [{ searchType, searchPostcode, nearestLibrary }, dispatchSearch] =
    useSearchStateValue()
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line

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
            <Typography variant='subtitle1' color='text.secondary'>
              {`Your closest library is ${Math.round(
                nearestLibrary?.distance / 1609
              )} mile(s) away`}
            </Typography>
            <Typography variant='h6' color='text.secondary'>
              {`${nearestLibrary?.name}`}
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              backgroundColor: theme => lighten(grey[200], 0.6)
            }}
          >
            <Button
              size='small'
              startIcon={<LocationOnIcon />}
              onClick={viewMap}
              component={Link}
              to='/map'
            >
              View on map
            </Button>
            <Button
              startIcon={<InfoIcon />}
              sx={{ marginLeft: theme => theme.spacing(1) }}
              onClick={viewLibrary}
            >
              Library details
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  )
}

export default PostcodeInfo