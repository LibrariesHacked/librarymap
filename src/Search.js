import React from 'react'

import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/core/styles'

import Libraries from './Libraries'
import PostcodeSearch from './PostcodeSearch'
import MobileLibraries from './MobileLibraries'
import ServiceFilter from './ServiceFilter'

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles()

  return (
    <div>
      <Typography component='h2' variant='h3' color='secondary' className={classes.title}>Find my library</Typography>
      <Typography component='p' variant='subtitle1' className={classes.subtitle}>Search by postcode or library service</Typography>
      <div className={classes.search}>
        <PostcodeSearch settings />
      </div>
      <div className={classes.search}>
        <ServiceFilter />
      </div>
      <Libraries />
      <br />
      <MobileLibraries />
    </div>
  )
}

export default Search
