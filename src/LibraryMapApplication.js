import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Container from '@material-ui/core/Container'

import StopDetails from './StopDetails'
import LibraryDetails from './LibraryDetails'

import { makeStyles } from '@material-ui/core/styles'

import AppHeader from './AppHeader'
import Footer from './Footer'
import LibraryMap from './LibraryMap'
import Notification from './Notification'
import Search from './Search'
import { MemoMarkdownPage } from './MarkdownPage'

import Data from './pages/data.md'

import * as serviceModel from './models/service'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  root: {
    flexGrow: 1
  }
}))

function LibraryMapApplication () {
  const [{ }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{ }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ }, dispatchView] = useViewStateValue() //eslint-disable-line

  useEffect(() => {
    // Initial data setup
    async function getServices () {
      const services = await serviceModel.getServices()
      const serviceLookup = {}
      const serviceSystemNameLookup = {}
      services.forEach(service => {
        serviceLookup[service.code] = service
        serviceSystemNameLookup[service.systemName] = service
      })
      dispatchApplication({ type: 'AddServices', services: services, serviceLookup: serviceLookup })
      // Process any service query parameters
      const currentUrlParams = new URLSearchParams(window.location.search)
      const serviceName = currentUrlParams.get('service')
      if (serviceName && serviceSystemNameLookup[serviceName]) {
        const service = serviceSystemNameLookup[serviceName]
        const coords = JSON.parse(service.bbox).coordinates[0]
        dispatchSearch({ type: 'FilterByService', service: service })
        dispatchView({ type: 'FitToBounds', bounds: [coords[0], coords[2]] })
      }
    }
    getServices()
  }, []) //eslint-disable-line

  const classes = useStyles()

  const Page404 = ({ location }) => (
    <div>
      <h2>Sorry! That page was not found</h2>
    </div>
  )

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <AppHeader loading={false} site={3} />
        <Container maxWidth='lg'>
          <main className={classes.content}>
            <Switch>
              <Route path='/' exact render={() => <Search />} />
              <Route path='/map' exact render={() => <LibraryMap />} />
              <Route path='/data' exact render={() => <MemoMarkdownPage page={Data} />} />
              <Route path={['/http:', '/https:']} component={props => { window.location.replace(props.location.pathname.substr(1)); return null }} />
              <Route component={Page404} />
            </Switch>
          </main>
        </Container>
        <Container maxWidth='lg'>
          <Footer />
        </Container>
        <Notification />
      </div>
      <StopDetails />
      <LibraryDetails />
    </BrowserRouter>
  )
}

export default LibraryMapApplication
