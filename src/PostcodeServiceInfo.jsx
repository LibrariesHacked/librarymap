import React from 'react'

import { Link } from 'react-router-dom'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import ArrowRightIcon from '@mui/icons-material/ArrowRightTwoTone'

import { lighten } from '@mui/material'

import grey from '@mui/material/colors/grey'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'

function PostcodeServiceInfo () {
  const [{ serviceLookup }] = useApplicationStateValue()
  const [{ searchType, searchPostcode, nearestLibrary, postcodeServiceCode }] =
    useSearchStateValue()

  const postcodeService = serviceLookup[postcodeServiceCode]

  return (
    <>
      {searchType === 'postcode' && searchPostcode && nearestLibrary && (
        <Card
          elevation={0}
          sx={{
            border: 2,
            borderColor: grey[200]
          }}
        >
          <CardContent>
            <Typography variant='h5' component='span' color='text.secondary'>
              {postcodeService?.niceName} Libraries
            </Typography>
            <br />
            <Typography variant='body1' component='span' color='text.secondary'>
              Library services are provided by local authorities.
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              backgroundColor: theme => lighten(grey[300], 0.6)
            }}
          >
            <Button
              color='primary'
              variant='contained'
              endIcon={<ArrowRightIcon />}
              to={`/service/${postcodeService.systemName}`}
              component={Link}
              disableElevation
            >
              {postcodeService?.niceName}
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  )
}

export default PostcodeServiceInfo
