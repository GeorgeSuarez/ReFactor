import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBasket } from "../../lib/hooks/useBasket";
import {
  useFetchAddressQuery,
  useUpdateUserAddressMutation,
} from "../account/accountApi";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { currencyFormat } from "../../lib/util";
import { useForm } from "react-hook-form";

const steps = ["Address", "Payment", "Review"];

type AddressForm = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export default function CheckoutStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const { basket } = useBasket();
  const { data: savedAddress, isLoading: addressLoading } = useFetchAddressQuery();
  const [updateAddress] = useUpdateUserAddressMutation();
  const [saveAddressChecked, setSaveAddressChecked] = useState(false);
  const elements = useElements();
  const stripe = useStripe();
  const [submitting, setSubmitting] = useState(false);
  const { total } = useBasket();
  const stripePaymentMethodRef = useRef<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<AddressForm>({
    mode: "onBlur",
    defaultValues: savedAddress ?? {
      name: "", line1: "", line2: "", city: "", state: "", postal_code: "", country: "US",
    },
  });

  useEffect(() => {
    if (savedAddress) reset(savedAddress);
  }, [savedAddress, reset]);

  const onAddressSubmit = async (data: AddressForm) => {
    if (saveAddressChecked) {
      const { line2, ...rest } = data;
      await updateAddress({ ...rest, line2: line2 || null });
    }
    handleNext();
  };

  const handleNext = async () => {
    if (activeStep === 1) {
      if (!stripe) return;

      const pmResponse = await fetch("/api/payments/test-pm", {
        method: "POST",
        credentials: "include",
      });
      if (!pmResponse.ok) return toast.error("Failed to create test payment");
      const pmData = await pmResponse.json();
      stripePaymentMethodRef.current = pmData.id;
    }

    if (activeStep === 2) {
      await confirmPayment();
    }

    if (activeStep < 2) setActiveStep((step) => step + 1);
  };

  const confirmPayment = async () => {
    setSubmitting(true);
    try {
      if (!basket?.clientSecret)
        throw new Error("Unable to process payment");
      if (!stripePaymentMethodRef.current) throw new Error("Missing payment method");

      const shippingAddress = { ...savedAddress } as AddressForm;
      if (!shippingAddress) throw new Error("Missing shipping address");

      const paymentSummary = {
        last4: "4242", brand: "visa", exp_month: 12, exp_year: 2034,
      };
      const orderModel = { shippingAddress, paymentSummary };
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderModel),
      });
      if (!response.ok) throw new Error("Failed to create order");
      const order = await response.json();

      const stripeInstance = stripe ?? (window as any).Stripe(
        import.meta.env.VITE_STRIPE_PK,
      );
      if (!stripeInstance) throw new Error("Stripe failed to initialize");
      const result = await stripeInstance.confirmCardPayment(
        basket.clientSecret,
        { payment_method: stripePaymentMethodRef.current },
      );
      if (result.error) throw new Error(result.error.message);
      navigate("/checkout/success", { state: { data: order } });
    } catch (error) {
      console.error("confirmPayment error:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed");
      setActiveStep((step) => step - 1);
    } finally {
      setSubmitting(false);
    }
  };

  if (addressLoading)
    return <Typography variant="h6">Loading checkout...</Typography>;

  const fieldSx = {
    "& .MuiInputBase-root": { fontFamily: '"DM Mono", monospace', fontSize: "0.875rem" },
    "& .MuiInputLabel-root": { fontFamily: '"Inter", sans-serif', fontSize: "0.8125rem" },
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 2 }}>
        {activeStep === 0 && (
          <Box component="form" id="address-form" onSubmit={handleSubmit(onAddressSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField label="Full name" {...register("name", { required: "Required" })}
                error={!!errors.name} helperText={errors.name?.message} sx={fieldSx} />
              <TextField label="Address line 1" {...register("line1", { required: "Required" })}
                error={!!errors.line1} helperText={errors.line1?.message} sx={fieldSx} />
              <TextField label="Address line 2" {...register("line2")} sx={fieldSx} />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField label="City" {...register("city", { required: "Required" })}
                  error={!!errors.city} helperText={errors.city?.message} sx={{ flex: 1, ...fieldSx }} />
                <TextField label="State" {...register("state", { required: "Required" })}
                  error={!!errors.state} helperText={errors.state?.message} sx={{ flex: 1, ...fieldSx }} />
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField label="ZIP code" {...register("postal_code", { required: "Required" })}
                  error={!!errors.postal_code} helperText={errors.postal_code?.message} sx={{ flex: 1, ...fieldSx }} />
                <TextField label="Country" {...register("country", { required: "Required" })}
                  error={!!errors.country} helperText={errors.country?.message} sx={{ flex: 1, ...fieldSx }} />
              </Box>
              <FormControlLabel
                sx={{ display: "flex", justifyContent: "end" }}
                control={
                  <Checkbox checked={saveAddressChecked}
                    onChange={(e) => setSaveAddressChecked(e.target.checked)} />
                }
                label="Save as default address"
              />
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <PaymentElement />
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h4" sx={{ fontSize: "1rem", mb: 2, fontFamily: '"DM Mono", monospace' }}>
              Review your order
            </Typography>
            {basket?.items.map((item) => (
              <Box key={item.productId} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">{item.name} x {item.quantity}</Typography>
                <Typography variant="body2" sx={{ fontFamily: '"DM Mono", monospace' }}>
                  {currencyFormat(item.price * item.quantity)}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">Subtotal</Typography>
              <Typography variant="body2" sx={{ fontFamily: '"DM Mono", monospace' }}>
                {currencyFormat(basket?.items.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0)}
              </Typography>
            </Box>
            {stripePaymentMethodRef.current && (
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Typography variant="body2">Payment</Typography>
                <Typography variant="body2" sx={{ fontFamily: '"DM Mono", monospace' }}>Visa ending in 4242</Typography>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", pt: 2 }}>
          {activeStep > 0 && (
            <LoadingButton onClick={() => setActiveStep((s) => s - 1)}>
              Back
            </LoadingButton>
          )}
          <Box sx={{ flex: 1 }} />
          {activeStep === 0 ? (
            <LoadingButton
              type="submit" form="address-form"
              disabled={!isValid}
              variant="contained"
              sx={{ fontFamily: '"DM Mono", monospace' }}
            >
              Next
            </LoadingButton>
          ) : (
            <LoadingButton
              onClick={handleNext}
              disabled={submitting}
              loading={submitting}
              variant="contained"
              sx={{ fontFamily: '"DM Mono", monospace' }}
            >
              {activeStep === steps.length - 1 ? `Pay ${currencyFormat(total)}` : "Next"}
            </LoadingButton>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
