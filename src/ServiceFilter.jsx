import React, { useState } from 'react'

import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

import BusinessIcon from '@mui/icons-material/BusinessRounded'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import * as serviceModel from './models/service'

function ServiceFilter () {
  const [{ services, serviceLookup }, dispatchApplication] =
    useApplicationStateValue()
  const [{ serviceFilter }, dispatchSearch] = useSearchStateValue()
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line

  const [serviceMenuAnchor, setServiceMenuAnchor] = useState(null)

  const openServiceMenu = element => setServiceMenuAnchor(element)

  const closeServiceMenu = () => setServiceMenuAnchor(null)

  const chooseService = async service => {
    closeServiceMenu()
    const serviceFull = await serviceModel.getService(service.code)
    const coords = serviceFull.bbox.coordinates[0]
    dispatchApplication({ type: 'UpdateServiceGeo', service: serviceFull })
    dispatchSearch({ type: 'FilterByService', service })
    dispatchView({ type: 'FitToBounds', mapBounds: [coords[0], coords[2]] })
  }

  const clearServiceFilter = () => {
    dispatchSearch({ type: 'ClearAll' })
  }

  return (
    <>
      {serviceFilter.length === 0 ? (
        <Tooltip title='Choose library authority'>
          <Button
            size='large'
            color='primary'
            onClick={e => openServiceMenu(e.currentTarget)}
            startIcon={<BusinessIcon />}
          >
            Select library authority
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
