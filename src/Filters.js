import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import ListSubheader from '@material-ui/core/ListSubheader'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import BusinessIcon from '@material-ui/icons/BusinessTwoTone'
import DirectionBusIcon from '@material-ui/icons/DirectionsBusTwoTone'
import DirectionsIcon from '@material-ui/icons/DirectionsTwoTone'

import { makeStyles } from '@material-ui/core/styles'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'

import PostcodeSearch from './PostcodeSearch'

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1)
  },
  chip: {
    marginRight: theme.spacing(1)
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  search: {
    alignContent: 'center',
    textAlign: 'center',
    display: 'table',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '10px'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '5px'
  },
  title: {
    textAlign: 'center'
  }
}))

function Filters () {
  const [{ organisations, organisationLookup, mobiles, mobileLookup, routeLookup, routes }] = useApplicationStateValue()
  const [{ searchDistance, organisationFilter, mobileFilter, routeFilter }, dispatchSearch] = useSearchStateValue()

  const [organisationMenuAnchor, setOrganisationMenuAnchor] = useState(null)

  const openOrganisationMenu = (element) => setOrganisationMenuAnchor(element)

  const closeOrganisationMenu = () => setOrganisationMenuAnchor(null)

  const chooseOrganisation = (organisationId) => {
    dispatchSearch({ type: 'FilterByOrganisation', organisationId: organisationId })
    closeOrganisationMenu()
  }

  const clearOrganisationFilter = () => {
    dispatchSearch({ type: 'ClearAll' })
  }

  const countries = new Set(organisations.map(org => org.country))

  const classes = useStyles()

  return (
    <>
      <div className={classes.search}>
        {organisationFilter.length === 0 ? (
          <Tooltip title='Choose library service'>
            <Button color='primary' className={classes.button} onClick={(e) => openOrganisationMenu(e.currentTarget)}>
              <BusinessIcon className={classes.leftIcon} />Select service
            </Button>
          </Tooltip>
        ) : <Chip className={classes.chip} color='primary' variant='outlined' onDelete={clearOrganisationFilter} label={organisationLookup[organisationFilter[0]].name} />}
      </div>
      <Menu
        id='menu-library-service'
        anchorEl={organisationMenuAnchor}
        keepMounted
        open={Boolean(organisationMenuAnchor)}
        onClose={() => closeOrganisationMenu()}
      >
        {
          Array.from(countries)
            .sort((a, b) => a.localeCompare(b))
            .map((country, idx) => {
              const menuItems = [<ListSubheader key={'lst_' + idx} disableSticky>{country}</ListSubheader>]
              const orgList = organisations
                .sort((a, b) => a.name.localeCompare(b.name))
                .filter(org => org.country === country)
                .map(org => {
                  return <MenuItem key={'mnu_itm_org_' + org.id} onClick={() => chooseOrganisation(org.id)}>{org.name}</MenuItem>
                })
              return menuItems.concat(orgList)
            })
        }
      </Menu>
    </>
  )
}

export default Filters
