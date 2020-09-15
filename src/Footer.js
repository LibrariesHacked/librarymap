import React from 'react'
import RouteLink from 'react-router-dom/Link'

import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

import FavoriteIcon from '@material-ui/icons/FavoriteTwoTone'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(5),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(5),
    width: '100%'
  },
  grid: {
    marginTop: theme.spacing(2)
  },
  loveIcon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  footerText: {
    verticalAlign: 'middle',
    display: 'inline-flex'
  },
  footerRight: {
    textAlign: 'right'
  },
  tapTarget: {
    lineHeight: 2.2,
    fontSize: 16
  }
}))

function Footer () {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Divider />
      <Grid container spacing={3} className={classes.grid}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Typography variant='body1' className={classes.footerText}>A library lab project built by Libraries Hacked.</Typography><br />
          <Typography variant='button'>
            <Link component={RouteLink} to='/data' title='Maintaining the data used on this site and licensing' className={classes.tapTarget}>Data</Link><br />
            <Link href='https://github.com/LibrariesHacked/librarymap' target='_blank' title='Project on GitHub' className={classes.tapTarget}>GitHub</Link><br/>
            <Link href='https://www.librarylab.co.uk' target='_blank' title='About the library lab projects and documentation for each' className={classes.tapTarget}>About Library lab</Link>
          </Typography>
        </Grid>
        <Grid className={classes.footerRight} item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Typography variant='body1' className={classes.footerText}>To the memory of Paul Rowe <FavoriteIcon color='primary' className={classes.loveIcon} /></Typography><br />
          <Typography variant='button'>
            <Link href='https://www.mind.org.uk/donate/' title='Donate to Mind' className={classes.tapTarget} target='_blank'>Donate to Mind</Link>
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default Footer
