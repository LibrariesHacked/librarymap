import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Container from '@mui/material/Container'

import StopDetails from './StopDetails'
import LibraryDetails from './LibraryDetails'

import Footer from './Footer'
import Header from './Header'
import Home from './Home'
import LibraryMap from './LibraryMap'
import Notification from './Notification'

import { MemoMarkdownPage } from './MarkdownPage'

import Data from './pages/data.md'

import * as serviceModel from './models/service'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

function LibraryMapApplication() {
  const [{ }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{ }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ }, dispatchView] = useViewStateValue() //eslint-disable-line

  useEffect(() => {
    // Initial data setup
    async function getServices() {
      const services = await serviceModel.getServices()
      const serviceLookup = {}
      const serviceSystemNameLookup = {}
      services.forEach(service => {
        serviceLookup[service.code] = service
        serviceSystemNameLookup[service.systemName] = service
      })
      dispatchApplication({
        type: 'AddServices',
        services: services,
        serviceLookup: serviceLookup
      })
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

  const Page404 = ({ location }) => (
    <div>
      <h2>Sorry! That page was not found</h2>
    </div>
  )

  return (
    <BrowserRouter>
      <div>
        <Container maxWidth='lg'>
          <Header />
          <main>
            <Routes>
              <Route path='/' exact element={<Home />} />
              <Route path='/map' exact element={<LibraryMap />} />
              <Route
                path='/data'
                exact
                element={<MemoMarkdownPage page={Data} />}
              />
              <Route element={Page404} />
            </Routes>
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
