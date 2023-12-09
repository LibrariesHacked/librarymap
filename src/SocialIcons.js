import IconButton from '@mui/material/IconButton'

import TwitterIcon from '@mui/icons-material/Twitter'
import FacebookIcon from '@mui/icons-material/FacebookRounded'
import YouTubeIcon from '@mui/icons-material/YouTube'

function SocialIcons (props) {
  const { facebookPageName, twitterHandle, youTubeId } = props

  const handleOpenSocial = url => {
    window.open(url, '_blank')
  }

  const SocialButton = ({ url, icon }) => {
    const Icon = icon
    return (
      <IconButton
        size='large'
        color='primary'
        onClick={() => handleOpenSocial(url)}
        sx={{
          border: theme => `1px solid ${theme.palette.grey[200]}`,
          backgroundColor: theme => theme.palette.grey[50],
          margin: theme => theme.spacing(1)
        }}
      >
        {Icon}
      </IconButton>
    )
  }

  return (
    <>
      {twitterHandle && (
        <SocialButton
          url={`https://twitter.com/${twitterHandle}`}
          icon={<TwitterIcon />}
        />
      )}
      {youTubeId && (
        <SocialButton
          url={`https://www.youtube.com/channel/${youTubeId}`}
          icon={<YouTubeIcon />}
        />
      )}
      {facebookPageName && (
        <SocialButton
          url={`https://www.facebook.com/${facebookPageName}`}
          icon={<FacebookIcon />}
        />
      )}
    </>
  )
}

export default SocialIcons
