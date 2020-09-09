import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'

import BusinessIcon from '@material-ui/icons/BusinessTwoTone'

import { makeStyles } from '@material-ui/core/styles'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1)
  },
  chip: {
    marginRight: theme.spacing(1)
  }
}))

function ServiceFilter () {
  const [{ services, serviceLookup }] = useApplicationStateValue()
  const [{ serviceFilter }, dispatchSearch] = useSearchStateValue()

  const [serviceMenuAnchor, setServiceMenuAnchor] = useState(null)

  const openServiceMenu = (element) => setServiceMenuAnchor(element)

  const closeServiceMenu = () => setServiceMenuAnchor(null)

  const chooseService = (serviceCode) => {
    dispatchSearch({ type: 'FilterByService', serviceCode: serviceCode })
    closeServiceMenu()
  }

  const clearServiceFilter = () => {
    dispatchSearch({ type: 'ClearAll' })
  }

  const classes = useStyles()

  return (
    <>
      {serviceFilter.length === 0 ? (
        <Tooltip title='Choose library service'>
          <Button color='primary' className={classes.button} onClick={(e) => openServiceMenu(e.currentTarget)} startIcon={<BusinessIcon />}>
            Select service
          </Button>
        </Tooltip>
      ) : <Chip className={classes.chip} color='primary' variant='outlined' onDelete={clearServiceFilter} label={serviceLookup[serviceFilter[0]].Name} />}
      <Menu
        id='menu-library-service'
        anchorEl={serviceMenuAnchor}
        keepMounted
        open={Boolean(serviceMenuAnchor)}
        onClose={() => closeServiceMenu()}
      >
        {
          services
            .sort((a, b) => a.Name.localeCompare(b.Name))
            .map(s => {
              return <MenuItem key={'mnu_itm_org_' + s.Code} onClick={() => chooseService(s.Code)}>{s.Name}</MenuItem>
            })
        }
      </Menu>
    </>
  )
}

export default ServiceFilter
