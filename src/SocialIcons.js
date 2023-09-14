import IconButton from '@mui/material/IconButton'

import TwitterIcon from '@mui/icons-material/Twitter'
import FacebookIcon from '@mui/icons-material/FacebookRounded'
import YouTubeIcon from '@mui/icons-material/YouTube'

function SocialIcons (props) {
  const { facebookPageName, twitterHandle, youTubeId } = props

  const handleOpenFacebook = () => {
    window.open(`https://www.facebook.com/${facebookPageName}`, '_blank')
  }

  const handleOpenTwitter = () => {
    window.open(`https://twitter.com/${twitterHandle}`, '_blank')
  }

  const handleOpenYouTube = () => {
    window.open(`https://www.youtube.com/user/${youTubeId}`, '_blank')
  }

  return (
    <>
      <IconButton
        size='large'
        aria-label='twitter'
        color='secondary'
        onClick={handleOpenTwitter}
      >
        <TwitterIcon />
      </IconButton>
      <IconButton
        size='large'
        aria-label='facebook'
        color='secondary'
        onClick={handleOpenFacebook}
      >
        <FacebookIcon />
      </IconButton>
      <IconButton
        size='large'
        aria-label='youtube'
        color='secondary'
        onClick={handleOpenYouTube}
      >
        <YouTubeIcon />
      </IconButton>
    </>
  )
}

export default SocialIcons
