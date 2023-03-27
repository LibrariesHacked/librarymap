import React, { useState } from 'react'

import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

import BusinessIcon from '@mui/icons-material/BusinessTwoTone'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

function ServiceFilter () {
  const [{ services, serviceLookup }] = useApplicationStateValue()
  const [{ serviceFilter }, dispatchSearch] = useSearchStateValue()
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line

  const [serviceMenuAnchor, setServiceMenuAnchor] = useState(null)

  const openServiceMenu = element => setServiceMenuAnchor(element)

  const closeServiceMenu = () => setServiceMenuAnchor(null)

  const chooseService = service => {
    closeServiceMenu()
    const coords = JSON.parse(service.bbox).coordinates[0]
    dispatchSearch({ type: 'FilterByService', service: service })
    dispatchView({ type: 'FitToBounds', mapBounds: [coords[0], coords[2]] })
  }

  const clearServiceFilter = () => {
    dispatchSearch({ type: 'ClearAll' })
  }

  return (
    <>
      {serviceFilter.length === 0 ? (
        <Tooltip title='Choose library service'>
          <Button
            size='large'
            color='primary'
            onClick={e => openServiceMenu(e.currentTarget)}
            startIcon={<BusinessIcon />}
          >
            Select library service
          </Button>
        </Tooltip>
      ) : (
        <Chip
          color='primary'
          onDelete={clearServiceFilter}
          label={serviceLookup[serviceFilter[0]].name}
        />
      )}
      <Menu
        id='menu-library-service'
        anchorEl={serviceMenuAnchor}
        keepMounted
        open={Boolean(serviceMenuAnchor)}
        onClose={() => closeServiceMenu()}
      >
        {services
          .sort((a, b) => a.niceName.localeCompare(b.niceName))
          .map(s => {
            return (
              <MenuItem
                key={'mnu_itm_org_' + s.code}
                onClick={() => chooseService(s)}
              >
                {s.niceName}
              </MenuItem>
            )
          })}
      </Menu>
    </>
  )
}

export default ServiceFilter
