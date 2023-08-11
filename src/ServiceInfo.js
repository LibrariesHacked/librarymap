import React from 'react'

import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ListSubheader from '@mui/material/ListSubheader'
import AccountIcon from '@mui/icons-material/AccountCircleRounded'

import grey from '@mui/material/colors/grey'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'

function ServiceInfo () {
  const [{ serviceLookup }] = useApplicationStateValue()
  const [{ searchType, searchPostcode, nearestLibrary, postcodeServiceCode }] =
    useSearchStateValue()

  const postcodeService = serviceLookup[postcodeServiceCode]

  const handleJoinLibraryService = () => {
    window.open(postcodeService?.url, '_blank')
  }

  return (
    <>
      {searchType === 'postcode' && searchPostcode && nearestLibrary && (
        <Box
          sx={{
            backgroundColor: grey[200],
            padding: theme => theme.spacing(1),
            borderRadius: '6px'
          }}
        >
          <ListSubheader disableSticky disableGutters>
            {postcodeService?.name}
          </ListSubheader>
          {`${searchPostcode} is within ${postcodeService?.niceName} libraries.`}
          <Box sx={{ paddingTop: theme => theme.spacing(2) }}>
            <Button
              variant='text'
              startIcon={<AccountIcon />}
              onClick={handleJoinLibraryService}
              component={Link}
            >
              Join
            </Button>
          </Box>
        </Box>
      )}
    </>
  )
}

export default ServiceInfo
