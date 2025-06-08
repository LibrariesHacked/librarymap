import React from 'react'
import { Link, useMatch } from 'react-router-dom'

import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'

import BusinessIcon from '@mui/icons-material/BusinessRounded'
import HomeIcon from '@mui/icons-material/Home'

import { useApplicationStateValue } from './context/applicationState'

function SiteBreadcrumbs (props) {
  const { currentPageName } = props

  const homePage = useMatch('/')
  const servicePage = useMatch('/service/:serviceSystemName')
  const libraryPage = useMatch('/service/:serviceSystemName/:librarySystemName')

  const [{ services }] = useApplicationStateValue()

  const Icon = props.currentPageIcon

  let serviceName = ''
  if (servicePage || libraryPage) {
    serviceName = services.find(
      service =>
        service.systemName ===
        (servicePage?.params?.serviceSystemName ||
          libraryPage?.params?.serviceSystemName)
    )?.name
  }

  return (
    <div role='presentation'>
      <Breadcrumbs>
        {!homePage && (
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: theme => theme.palette.text.primary
            }}
            component={Link}
            to='/'
          >
            <HomeIcon sx={{ mr: 0.5 }} />
            Home
          </Typography>
        )}
        {libraryPage && (
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: theme => theme.palette.text.primary
            }}
            component={Link}
            to={`/service/${libraryPage.params.serviceSystemName}`}
          >
            <BusinessIcon sx={{ mr: 0.5 }} />
            {serviceName}
          </Typography>
        )}
        <Typography sx={{ display: 'flex', alignItems: 'center' }}>
          <Icon sx={{ mr: 0.5 }} />
          {currentPageName}
        </Typography>
      </Breadcrumbs>
    </div>
  )
}

export default SiteBreadcrumbs
