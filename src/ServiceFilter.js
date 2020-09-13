import React, { useState } from 'react'
import { withRouter } from 'react-router'

import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'

import BusinessIcon from '@material-ui/icons/BusinessTwoTone'

import { makeStyles } from '@material-ui/core/styles'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1)
  },
  chip: {
    marginRight: theme.spacing(1)
  }
}))

function ServiceFilter (props) {
  const [{ services, serviceLookup }] = useApplicationStateValue()
  const [{ serviceFilter }, dispatchSearch] = useSearchStateValue()
  const [{ }, dispatchView] = useViewStateValue()//eslint-disable-line

  const [serviceMenuAnchor, setServiceMenuAnchor] = useState(null)

  const openServiceMenu = (element) => setServiceMenuAnchor(element)

  const closeServiceMenu = () => setServiceMenuAnchor(null)

  const chooseService = (service) => {
    const coords = JSON.parse(service.bbox).coordinates[0]
    dispatchSearch({ type: 'FilterByService', service: service })
    dispatchView({ type: 'FitToBounds', bounds: [coords[0], coords[2]] })
    const currentUrlParams = new URLSearchParams(window.location.search)
    currentUrlParams.set('service', service.systemName)
    props.history.push(window.location.pathname + '?' + currentUrlParams.toString())
    closeServiceMenu()
  }

  const clearServiceFilter = () => {
    dispatchSearch({ type: 'ClearAll' })
    const currentUrlParams = new URLSearchParams(window.location.search)
    currentUrlParams.delete('service')
    props.history.push(window.location.pathname)
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
      ) : <Chip className={classes.chip} color='primary' onDelete={clearServiceFilter} label={serviceLookup[serviceFilter[0]].name} />}
      <Menu
        id='menu-library-service'
        anchorEl={serviceMenuAnchor}
        keepMounted
        open={Boolean(serviceMenuAnchor)}
        onClose={() => closeServiceMenu()}
      >
        {
          services
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(s => {
              return <MenuItem key={'mnu_itm_org_' + s.code} onClick={() => chooseService(s)}>{s.name}</MenuItem>
            })
        }
      </Menu>
    </>
  )
}

export default withRouter(ServiceFilter)
