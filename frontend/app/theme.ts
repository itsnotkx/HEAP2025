import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2EC4B6",
    },
    secondary: {
      main: "#B8A2C8",
    },
  },
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
