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
          <Typography variant='body1' className={classes.footerText}>Built by Libraries Hacked</Typography><br />
          <Typography variant='button'>
            <Link component={RouteLink} to='/data' title='Maintaining the data used on this site and licensing' className={classes.tapTarget}>Data</Link>
          </Typography>
        </Grid>
        <Grid className={classes.footerRight} item xs={12} sm={6} md={6} lg={6} xl={6}>
          <FavoriteIcon color='error' className={classes.loveIcon} />
        </Grid>
      </Grid>
    </div>
  )
}

export default Footer
