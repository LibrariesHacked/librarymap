import React from 'react'

import Link from '@mui/material//Link'
import Typography from '@mui/material/Typography'

import FaceIcon from '@mui/icons-material/FaceRounded'
import GroupIcon from '@mui/icons-material/GroupRounded'
import ComputerIcon from '@mui/icons-material/ComputerRounded'
import DescriptionIcon from '@mui/icons-material/DescriptionRounded'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBusRounded'
import EventIcon from '@mui/icons-material/EventRounded'
import ExploreIcon from '@mui/icons-material/ExploreRounded'
import FindInPageIcon from '@mui/icons-material/FindInPageRounded'
import SpeakerIcon from '@mui/icons-material/SpeakerRounded'
import HomeIcon from '@mui/icons-material/HomeRounded'
import MicIcon from '@mui/icons-material/MicRounded'
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowserRounded'
import PaymentIcon from '@mui/icons-material/PaymentRounded'
import TabletMacIcon from '@mui/icons-material/TabletMacRounded'
import WifiIcon from '@mui/icons-material/WifiRounded'

const config = require('./helpers/config.json')

const linkIcons = {
  FaceIcon: FaceIcon,
  GroupIcon: GroupIcon,
  ComputerIcon: ComputerIcon,
  DescriptionIcon: DescriptionIcon,
  DirectionsBusIcon: DirectionsBusIcon,
  EventIcon: EventIcon,
  ExploreIcon: ExploreIcon,
  FindInPageIcon: FindInPageIcon,
  SpeakerIcon: SpeakerIcon,
  HomeIcon: HomeIcon,
  MicIcon: MicIcon,
  OpenInBrowserIcon: OpenInBrowserIcon,
  PaymentIcon: PaymentIcon,
  TabletMacIcon: TabletMacIcon,
  WifiIcon: WifiIcon
}

function ServiceActions (props) {
  const { service } = props

  return (
    <>
      <Typography component='p' sx={{ columnWidth: '16em' }}>
        {config.service_links
          .filter(s => s.field in service.extended)
          .map((link, idx) => {
            const IconName = linkIcons[link.icon]
            return (
              <Typography
                key={'typ_links_' + idx}
                component='span'
                xs={{
                  verticalAlign: 'middle',
                  display: 'inline-flex',
                  padding: theme => theme.spacing(1)
                }}
              >
                <IconName
                  color='secondary'
                  sx={{ marginRight: theme => theme.spacing(1) }}
                />
                <Link
                  key={'typ_link_' + idx}
                  target='_blank'
                  rel='noopener'
                  href={service.extended[link.field]}
                  variant='subtitle2'
                >
                  {link.text}
                </Link>
                <br />
              </Typography>
            )
          })}
      </Typography>
    </>
  )
}

export default ServiceActions
