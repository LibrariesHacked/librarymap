import { createTheme } from '@mui/material/styles'

import { blueGrey, deepOrange } from '@mui/material/colors'

const theme = createTheme({
    palette: {
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
      }
    }
  })

  export default theme