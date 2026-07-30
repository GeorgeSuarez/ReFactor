import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import type { Product } from "../../app/models/product";
import { useAddBasketItemMutation } from "../basket/basketApi";
import { Link } from "react-router-dom";
import { currencyFormat } from "../../lib/util";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const [addBasketItem, { isLoading }] = useAddBasketItemMutation();
  const handleAddToCart = async () => {
    await addBasketItem({ product, quantity: 1 });
  };

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100%",
        height: 420,
      }}
    >
      <Box
        sx={{
          height: 180,
          minHeight: 180,
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          component="img"
          src={product.pictureUrl}
          alt={product.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </Box>
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 2,
          "&:last-child": { pb: 2 },
        }}
      >
        <Typography variant="caption" sx={{ color: "primary.main" }}>
          {product.type}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontSize: "0.9375rem",
            lineHeight: 1.3,
            fontWeight: 500,
            fontFamily: '"DM Mono", monospace',
          }}
        >
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.muted",
            fontFamily: '"DM Mono", monospace',
            fontSize: "0.75rem",
          }}
        >
          // {product.brand}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ pt: 1, borderTop: 1, borderColor: "divider" }}>
          <Typography
            variant="h4"
            sx={{
              color: "secondary.main",
              fontFamily: '"DM Mono", monospace',
              fontWeight: 500,
              mb: 1,
            }}
          >
            {currencyFormat(product.price)}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Button
              size="small"
              variant="contained"
              disabled={isLoading}
              onClick={handleAddToCart}
              sx={{
                flex: 1,
                fontFamily: '"DM Mono", monospace',
                fontSize: "1rem",
              }}
            >
              Add
            </Button>
            <Button
              size="small"
              component={Link}
              to={`/catalog/${product.id}`}
              sx={{
                flex: 1,
                fontFamily: '"DM Mono", monospace',
                fontSize: "1rem",
                color: "text.secondary",
              }}
            >
              View
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
