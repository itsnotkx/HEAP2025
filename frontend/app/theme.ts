
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Schibsted Grotesk", Arial, sans-serif',
  },
    components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Schibsted Grotesk", Arial, sans-serif',
        },
      },
    },
  },
});

export default theme;