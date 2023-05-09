import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import grey from '@mui/material/colors/grey'

import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'

import Footer from './Footer'
import Header from './Header'
import Home from './Home'
import LibraryDetails from './LibraryDetails'
import LibraryMap from './LibraryMap'
import Notification from './Notification'
import Service from './Service'
import StopDetails from './StopDetails'

import { MemoMarkdownPage } from './MarkdownPage'

import Accessibility from './pages/accessibility.md'
import Data from './pages/data.md'
import Privacy from './pages/privacy.md'

import * as serviceModel from './models/service'

import { useApplicationStateValue } from './context/applicationState'
import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

function LibraryMapApplication () {
  const [{}, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{}, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ loadingLibraryOrMobileLibrary }, dispatchView] = useViewStateValue() //eslint-disable-line

  useEffect(() => {
    // Initial data setup
    async function getServices () {
      const services = await serviceModel.getServices()
      const servicesExtended = await serviceModel.getServicesExtended()
      const serviceLookup = {}
      services.forEach(service => {
        serviceLookup[service.code] = service
        servicesExtended.forEach(serviceExtended => {
          if (serviceExtended.code === service.code) {
            service.extended = serviceExtended
          }
        })
      })
      dispatchApplication({
        type: 'AddServices',
        services: services,
        serviceLookup: serviceLookup
      })
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
      <Header />
      <Container maxWidth='false' sx={{ backgroundColor: grey.A100 }}>
        <Container
          sx={{
            paddingBottom: theme => theme.spacing(2)
          }}
        >
          <main>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/map' element={<LibraryMap />} />
              <Route path='/data' element={<MemoMarkdownPage page={Data} />} />
              <Route
                path='/accessibility'
                element={<MemoMarkdownPage page={Accessibility} />}
              />
              <Route
                path='/privacy'
                element={<MemoMarkdownPage page={Privacy} />}
              />
              <Route path='/service/:service_system_name' element={<Service />} />
              <Route element={Page404} />
            </Routes>
          </main>
        </Container>
      </Container>
      <Container sx={{ marginTop: theme => theme.spacing(2) }}>
        <Footer />
      </Container>
      <Notification />
      <StopDetails />
      <LibraryDetails />
      <Backdrop open={loadingLibraryOrMobileLibrary} invisible>
        <CircularProgress color='inherit' />
      </Backdrop>
    </BrowserRouter>
  )
}

export default LibraryMapApplication
