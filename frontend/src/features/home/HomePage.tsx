import { Box, Button, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const featured = {
  name: "Angular Speedster Board 2000",
  type: "Snowboard",
  framework: "Angular",
  price: 20000,
  image: "/images/products/sb-ang1.png",
};

export default function HomePage() {
  return (
    <Box sx={{ maxWidth: 960, mx: "auto", px: 2 }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, md: 5 },
          mb: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={featured.image}
            alt={featured.name}
            sx={{
              width: { xs: "100%", md: 320 },
              height: { xs: 240, md: 320 },
              objectFit: "contain",
              borderRadius: 1,
              bgcolor: "action.hover",
              p: 2,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              sx={{ color: "primary.main", mb: 1, display: "block" }}
            >
              // featured component
            </Typography>
            <Typography variant="h1" sx={{ mb: 2 }}>
              {featured.name}
            </Typography>
            <Box sx={{ mb: 3 }}>
              {[
                { label: "type: ", value: featured.type },
                { label: "framework: ", value: featured.framework },
                {
                  label: "price: ",
                  value: `$${(featured.price / 100).toFixed(2)}`,
                },
              ].map(({ label, value }) => (
                <Typography
                  key={label}
                  variant="body2"
                  sx={{
                    fontFamily: '"DM Mono", monospace',
                    color: "text.secondary",
                    mb: 0.5,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: "text.muted",
                      width: 80,
                      display: "contents",
                    }}
                  >
                    // {label}
                  </Box>
                  {value}
                </Typography>
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/catalog"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontFamily: '"DM Mono", monospace',
                }}
              >
                Browse catalog
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to={`/catalog/1`}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontFamily: '"DM Mono", monospace',
                }}
              >
                View specs
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="caption"
          sx={{ color: "text.muted", mb: 1, display: "block" }}
        >
          // browse by category
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {["boards", "boots", "gloves", "hats"].map((cat) => (
            <Button
              key={cat}
              component={Link}
              to={`/catalog?types=${cat}`}
              variant="outlined"
              sx={{
                px: 3,
                py: 1,
                fontFamily: '"DM Mono", monospace',
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {cat}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
