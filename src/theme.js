import { createTheme } from '@mui/material/styles'

import { blueGrey, blue, grey, green, deepOrange } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    background: {
      default: grey.A100
    },
    primary: {
      main: blue[700]
    },
    secondary: {
      main: blueGrey[500]
    },
    staticLibraries: {
      main: green[700]
    },
    mobileLibraries: {
      main: deepOrange[700]
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: 48
        }
      }
    }
  }
})

export default theme
