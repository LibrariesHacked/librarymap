import React from 'react'

import { Link } from 'react-router-dom'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import WebsiteIcon from '@mui/icons-material/LaunchRounded'

import { lighten } from '@mui/material'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'

function ServiceInfo () {
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
            border: 2,
            borderColor: theme => lighten(theme.palette.secondary.main, 0.5)
          }}
        >
          <CardContent>
            <Typography
              variant='subtitle1'
              component='span'
              color='text.secondary'
            >
              {`Your library service is `}
            </Typography>
            <Typography variant='h6' component='span' color='text.secondary'>
              {postcodeService?.niceName}
            </Typography>
          </CardContent>
          <CardActions sx={{ backgroundColor: theme => lighten(theme.palette.secondary.main, 0.9) }}>
            <Button
              variant='text'
              color='secondary'
              startIcon={<WebsiteIcon />}
              onClick={handleGoToLibraryServiceWebsite}
              component={Link}
            >
              Service website
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  )
}

export default ServiceInfo
