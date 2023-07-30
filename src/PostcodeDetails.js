import React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ListSubheader from '@mui/material/ListSubheader'

import { useSearchStateValue } from './context/searchState'
import { Typography } from '@mui/material'

function PostcodeDetails () {
  const [
    { searchType, searchPostcode, searchPosition, nearestLibrary },
    dispatchSearch
  ] = useSearchStateValue() //eslint-disable-line

  return (
    <>
      {searchType === 'postcode' && searchPostcode && nearestLibrary && (
        <>
          <ListSubheader
            disableSticky
            disableGutters
          >{`Search for ${searchPostcode}`}</ListSubheader>
          <Typography variant='body' color='text.secondary'>
            {`The nearest library to ${searchPostcode} is ${nearestLibrary.name}. `}
            {`This postcode is within: ${searchPosition.lat}`}
          </Typography>
          <Box sx={{ paddingTop: theme => theme.spacing(2) }}>
            <Button>View on map</Button>
          </Box>
        </>
      )}
    </>
  )
}

export default PostcodeDetails
