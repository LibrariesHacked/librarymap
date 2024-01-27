import { createTheme } from '@mui/material/styles'

import { blueGrey, deepOrange, grey } from '@mui/material/colors'

const theme = createTheme({
  typography: {
    fontFamily: ['Urbanist Variable', 'sans-serif'].join(',')
  },
  palette: {
    background: {
      default: grey.A100
    },
    primary: {
      main: deepOrange[500]
    },
    secondary: {
      main: blueGrey[500]
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
