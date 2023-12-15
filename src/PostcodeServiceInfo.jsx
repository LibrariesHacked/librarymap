import React from 'react'

import { Link } from 'react-router-dom'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import WebsiteIcon from '@mui/icons-material/LaunchRounded'

import { lighten } from '@mui/material'

import grey from '@mui/material/colors/grey'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'

function PostcodeServiceInfo () {
  const [{ serviceLookup }] = useApplicationStateValue()
  const [{ searchType, searchPostcode, nearestLibrary, postcodeServiceCode }] =
    useSearchStateValue()

  const postcodeService = serviceLookup[postcodeServiceCode]

  const handleGoToLibraryServiceWebsite = () => {
    window.open(postcodeService?.extended?.serviceUrl, '_blank')
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
            <Typography
              variant='subtitle1'
              component='span'
              color='text.secondary'
            >
              {'Your library service is '}
            </Typography>
            <Typography variant='h6' component='span' color='text.secondary'>
              {postcodeService?.niceName}
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              backgroundColor: theme => lighten(grey[200], 0.6)
            }}
          >
            <Button
              color='secondary'
              startIcon={<WebsiteIcon />}
              onClick={handleGoToLibraryServiceWebsite}
              component={Link}
            >
              Website
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  )
}

export default PostcodeServiceInfo
