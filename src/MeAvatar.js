import React from 'react'

import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'

import { useSearchStateValue } from './context/searchState'

import Face from '@mui/icons-material/FaceTwoTone'

function MeAvatar () {
  const [{ searchType }] = useSearchStateValue()

  return (
    <Tooltip title='Me'>
      <Avatar>
        <Face />
      </Avatar>
    </Tooltip>
  )
}

export default MeAvatar
