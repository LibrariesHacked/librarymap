import React, { useEffect } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Container from '@material-ui/core/Container'

import StopDetails from './StopDetails'
import LibraryDetails from './LibraryDetails'

import { makeStyles } from '@material-ui/core/styles'

import AppHeader from './AppHeader'
import Libraries from './Libraries'
import LibraryMap from './LibraryMap'
import Notification from './Notification'

import { useApplicationStateValue } from './context/applicationState'

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
  const [{ }, dispatchApplicationState] = useApplicationStateValue() //eslint-disable-line

  useEffect(() => {
    // Initial data setup
  }, []) //eslint-disable-line

  const classes = useStyles()

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <AppHeader loading={false} site={2} />
        <Container maxWidth='lg'>
          <main className={classes.content}>
            <Route path='/' exact render={() => <Libraries />} />
            <Route path='/map' exact render={() => <LibraryMap />} />
            <Route path={['/http:', '/https:']} component={props => { window.location.replace(props.location.pathname.substr(1)); return null }} />
          </main>
        </Container>
        <Notification />
      </div>
      <StopDetails />
      <LibraryDetails />
    </BrowserRouter>
  )
}

export default LibraryMapApplication
