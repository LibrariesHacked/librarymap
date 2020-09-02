import React from 'react'

import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/core/styles'

import { useSearchStateValue } from './context/searchState'

import Libraries from './Libraries'
import PostcodeSearch from './PostcodeSearch'
import MobileLibraries from './MobileLibraries'
import { Divider } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(8)
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

function Search () {
  const [{ searchDistance }] = useSearchStateValue() //eslint-disable-line

  const classes = useStyles()

  return (
    <div>
      <Typography component='h2' variant='h6' color='secondary' className={classes.title}>Your library</Typography>
      <Typography component='p' variant='body1' className={classes.subtitle}>Search by postcode to find libraries within {searchDistance / 1609} mile(s)</Typography>
      <div className={classes.search}>
        <PostcodeSearch settings />
      </div>
      <Libraries />
      <Divider variant='inset' light className={classes.divider} />
      <MobileLibraries />
    </div>
  )
}

export default Search
