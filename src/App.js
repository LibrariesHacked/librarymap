import React from 'react'

import CssBaseline from '@mui/material/CssBaseline'

import { ApplicationStateProvider } from './context/applicationState'
import { SearchStateProvider } from './context/searchState'
import { ViewStateProvider } from './context/viewState'

import LibraryMapApplication from './LibraryMapApplication'

import { ThemeProvider } from '@mui/material/styles'

import theme from './theme'

function App () {
  return (
    <ThemeProvider theme={theme}>
      <ApplicationStateProvider>
        <SearchStateProvider>
          <ViewStateProvider>
            <CssBaseline />
            <LibraryMapApplication />
          </ViewStateProvider>
        </SearchStateProvider>
      </ApplicationStateProvider>
    </ThemeProvider>
  )
}

export default App
