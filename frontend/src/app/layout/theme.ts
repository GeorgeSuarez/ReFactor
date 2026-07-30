import { createTheme } from "@mui/material";

export const palette = {
  surface: "#F7F8FA",
  canvas: "#0D1117",
  merge: "#2EA043",
  warning: "#D29922",
  link: "#58A6FF",
  branch: "#F7786B",
  border: "#D0D7DE",
  textPrimary: "#1F2328",
  textMuted: "#656D76",
};

export const darkPalette = {
  surface: "#161B22",
  canvas: "#0D1117",
  merge: "#3FB950",
  warning: "#D29922",
  link: "#58A6FF",
  branch: "#F7786B",
  border: "#30363D",
  textPrimary: "#E6EDF3",
  textMuted: "#8B949E",
};

export const theme = (darkMode: boolean) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? darkPalette.link : palette.link },
      secondary: { main: darkMode ? darkPalette.branch : palette.branch },
      background: {
        default: darkMode ? darkPalette.canvas : palette.surface,
        paper: darkMode ? darkPalette.surface : "#FFFFFF",
      },
      text: {
        primary: darkMode ? darkPalette.textPrimary : palette.textPrimary,
        secondary: darkMode ? darkPalette.textMuted : palette.textMuted,
      },
      divider: darkMode ? darkPalette.border : palette.border,
    },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      h1: {
        fontFamily: '"DM Mono", monospace',
        fontWeight: 500,
        fontSize: "2.5rem",
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
      },
      h2: {
        fontFamily: '"DM Mono", monospace',
        fontWeight: 500,
        fontSize: "1.75rem",
        letterSpacing: "-0.01em",
      },
      h3: {
        fontFamily: '"DM Mono", monospace',
        fontWeight: 500,
        fontSize: "1.25rem",
      },
      h4: {
        fontFamily: '"DM Mono", monospace',
        fontWeight: 500,
        fontSize: "1rem",
      },
      h5: {
        fontFamily: '"Inter", sans-serif',
        fontWeight: 600,
        fontSize: "1rem",
      },
      h6: {
        fontFamily: '"Inter", sans-serif',
        fontWeight: 600,
        fontSize: "0.875rem",
      },
      body1: {
        fontFamily: '"Inter", sans-serif',
        fontSize: "1rem",
        lineHeight: 1.6,
      },
      body2: {
        fontFamily: '"Inter", sans-serif',
        fontSize: "0.875rem",
        lineHeight: 1.5,
      },
      caption: {
        fontFamily: '"DM Mono", monospace',
        fontSize: "0.75rem",
        lineHeight: 1.4,
        letterSpacing: "0.02em",
      },
      button: {
        fontFamily: '"DM Mono", monospace',
        fontWeight: 500,
        fontSize: "0.8125rem",
        textTransform: "none",
        letterSpacing: "0.01em",
      },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            borderBottom: `1px solid ${darkMode ? darkPalette.border : palette.border}`,
            backgroundColor: darkMode ? darkPalette.canvas : "#FFFFFF",
            backgroundImage: "none",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${darkMode ? darkPalette.border : palette.border}`,
            boxShadow: "none",
            borderRadius: 8,
            transition: "border-color 0.15s ease",
            "&:hover": {
              borderColor: darkMode ? darkPalette.link : palette.link,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            padding: "8px 16px",
            fontWeight: 500,
          },
          containedPrimary: {
            backgroundColor: darkMode ? darkPalette.merge : palette.merge,
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: darkMode ? "#2EA043" : "#238636",
            },
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
          },
        },
      },
    },
  });
