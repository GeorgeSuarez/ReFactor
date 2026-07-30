import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { DarkMode, LightMode, ShoppingCart } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setDarkMode } from "./uiSlice";
import { useFetchBasketQuery } from "../../features/basket/basketApi";
import UserMenu from "./UserMenu";
import { useUserInfoQuery } from "../../features/account/accountApi";
import { Link, NavLink } from "react-router-dom";

const midLinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];

const rightLinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];

export default function NavBar() {
  const { data: user } = useUserInfoQuery();
  const { isLoading, darkMode } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const { data: basket } = useFetchBasketQuery();

  const itemCount =
    basket?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            component={NavLink}
            to="/"
            variant="h4"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              fontWeight: 500,
              fontFamily: '"DM Mono", monospace',
              letterSpacing: "-0.03em",
              "&:hover": { opacity: 0.8 },
            }}
          >
            ~/ReFactor
          </Typography>
          <IconButton onClick={() => dispatch(setDarkMode())} size="small">
            {darkMode ? (
              <DarkMode sx={{ fontSize: 16, color: "text.secondary" }} />
            ) : (
              <LightMode sx={{ fontSize: 16, color: "warning.main" }} />
            )}
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          {midLinks.map(({ title, path }) => (
            <Button
              key={path}
              component={NavLink}
              to={path}
              size="small"
              sx={{
                color: "text.secondary",
                fontFamily: '"DM Mono", monospace',
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                "&:hover": { color: "primary.main" },
                "&.active": {
                  color: "primary.main",
                },
              }}
            >
              {title}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            component={Link}
            to="/basket"
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {rightLinks.map(({ title, path }) => (
                <Button
                  key={path}
                  component={NavLink}
                  to={path}
                  size="small"
                  sx={{
                    color: "text.secondary",
                    fontFamily: '"DM Mono", monospace',
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    "&:hover": { color: "primary.main" },
                    "&.active": {
                      color: "primary.main",
                    },
                  }}
                >
                  {title}
                </Button>
              ))}
            </Box>
          )}
        </Box>
      </Toolbar>
      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress color="secondary" />
        </Box>
      )}
    </AppBar>
  );
}
