import { useForm, type FieldValues } from "react-hook-form";
import { useBasket } from "../../../lib/hooks/useBasket";
import {
  useAddCouponMutation,
  useRemoveCouponMutation,
} from "../../../features/basket/basketApi";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { currencyFormat } from "../../../lib/util";
import { Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

export default function OrderSummary() {
  const { subtotal, deliveryFee, discount, basket, total } = useBasket();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const [addCoupon] = useAddCouponMutation();
  const [removeCoupon, { isLoading }] = useRemoveCouponMutation();

  const onSubmit = async (data: FieldValues) => {
    await addCoupon(data.code);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "lg",
        mx: "auto",
      }}
    >
      <Paper sx={{ mb: 2, p: 3, width: "100%", borderRadius: 3 }}>
        <Typography variant="h6" component="p" sx={{ fontWeight: "bold" }}>
          Order Summary
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          Orders over $100 qualify for free delivery!
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography color="textSecondary">Subtotal</Typography>
            <Typography>{currencyFormat(subtotal)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography color="textSecondary">Discount</Typography>
            <Typography color="success">-{currencyFormat(discount)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography color="textSecondary">Delivery fee </Typography>
            <Typography>{currencyFormat(deliveryFee)}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography color="textSecondary">Total</Typography>
            <Typography>{currencyFormat(total)}</Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          {!location.pathname.includes("checkout") && (
            <Button
              component={Link}
              to="/checkout"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 1 }}
            >
              {" "}
              Checkout{" "}
            </Button>
          )}
          <Button component={Link} to="/catalog" fullWidth>
            Continue Shopping{" "}
          </Button>
        </Box>
      </Paper>

      {/* Coupon Code section */}
      {location.pathname.includes("checkout") && (
        <Paper sx={{ width: "100%", borderRadius: 3, p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="subtitle1" component="label">
              Do you have a voucher code?
            </Typography>

            {basket?.coupon && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }} variant="body2">
                  {basket.coupon.name} applied
                </Typography>
                <LoadingButton
                  loading={isLoading}
                  onClick={() => removeCoupon()}
                >
                  <Delete color="error" />
                </LoadingButton>
              </Box>
            )}

            <TextField
              label="Voucher code"
              variant="outlined"
              fullWidth
              disabled={!!basket?.coupon}
              {...register("code", { required: "Voucher code missing" })}
              sx={{ my: 2 }}
            />

            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              color="primary"
              disabled={!!basket?.coupon}
              fullWidth
            >
              Apply code
            </LoadingButton>
          </form>
        </Paper>
      )}
    </Box>
  );
}
