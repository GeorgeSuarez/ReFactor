import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import NavBar from "./NavBar";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useAppSelector } from "../store/store";
import { theme } from "./theme";

export default function App() {
  const { darkMode } = useAppSelector((state) => state.ui);
  const currentTheme = theme(darkMode);

  return (
    <ThemeProvider theme={currentTheme}>
      <ScrollRestoration />
      <CssBaseline />
      <NavBar />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          py: 6,
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 8 }}>
          <Outlet />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
