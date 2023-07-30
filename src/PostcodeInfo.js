import React from 'react'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { useSearchStateValue } from './context/searchState'

function PostcodeInfo () {
  const [{ searchType, searchPostcode, searchPosition }, dispatchSearch] =
    useSearchStateValue() //eslint-disable-line

  return (
    <Card variant='outlined' sx={{ minWidth: '100%' }}>
      <CardContent>
        <Typography
          color='text.secondary'
          gutterBottom
          variant='h5'
          component='div'
        >
          {`About ${searchPostcode}`}
        </Typography>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  )
}

export default PostcodeInfo
