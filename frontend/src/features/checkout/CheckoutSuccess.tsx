import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import type { Order } from "../../app/models/order";
import { Link, useLocation } from "react-router-dom";
import {
  currencyFormat,
  formatAddressString,
  formatPaymentString,
} from "../../lib/util";

export default function CheckoutSuccess() {
  const { state } = useLocation();
  const order = (state?.data as Order) || JSON.parse(sessionStorage.getItem("checkoutOrder") || "null");

  if (!order) return <Typography>Problem accessing the order</Typography>;

  return (
    <Container maxWidth="md">
      <>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          Thanks for your very real order!
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Your order{" "}
          <strong>#{order.id} will be processed very shortly.</strong>
        </Typography>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary">
              Order data
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary">
              Payment method
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {formatPaymentString(order.paymentSummary)}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary">
              Shipping address
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {formatAddressString(order.shippingAddress)}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary">
              Amount
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {currencyFormat(order.total)}
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
          <Button
            component={Link}
            to="/catalog"
            variant="outlined"
            color="primary"
          >
            Continue shopping
          </Button>
        </Box>
      </>
    </Container>
  );
}
