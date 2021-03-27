import React from 'react'
import { Link } from 'react-router-dom'

import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import MaterialLink from '@material-ui/core/Link'
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
  bullet: {
    margin: theme.spacing(2)
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
          <Typography variant='button'>
            <MaterialLink href='https://www.librarylab.uk/library-map' target='_blank' title='About the library map library lab project' className={classes.tapTarget}>About this project</MaterialLink>
            <span className={classes.bullet}> &#8226; </span>
            <MaterialLink component={Link} to='/data' title='Maintaining the data used on this site and licensing' className={classes.tapTarget}>Data</MaterialLink>
            <span className={classes.bullet}> &#8226; </span>
            <MaterialLink href='https://github.com/LibrariesHacked/librarymap' target='_blank' title='Project on GitHub' className={classes.tapTarget}>GitHub</MaterialLink>
          </Typography><br />
          <Typography variant='body2' className={classes.footerText}>A Library Lab project by Libraries Hacked.</Typography>
        </Grid>
        <Grid className={classes.footerRight} item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Typography variant='body1' className={classes.footerText}>In memory of Paul Rowe <FavoriteIcon color='primary' className={classes.loveIcon} /></Typography><br />
          <Typography variant='button'>
            <MaterialLink href='https://www.mind.org.uk/donate/' title='Donate to Mind' className={classes.tapTarget} target='_blank'>Donate to Mind</MaterialLink>
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default Footer
