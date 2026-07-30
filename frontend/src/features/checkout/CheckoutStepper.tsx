import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBasket } from "../../lib/hooks/useBasket";
import {
  useFetchAddressQuery,
  useUpdateUserAddressMutation,
} from "../account/accountApi";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type {
  StripeAddressElementChangeEvent,
} from "@stripe/stripe-js";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { currencyFormat, formatPaymentString } from "../../lib/util";

const steps = ["Address", "Payment", "Review"];

export default function CheckoutStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const { basket } = useBasket();
  const { data, isLoading } = useFetchAddressQuery();
  const [updateAddress] = useUpdateUserAddressMutation();
  const [saveAddressChecked, setSaveAddressChecked] = useState(false);
  const elements = useElements();
  const stripe = useStripe();
  const [addressComplete, setAddressComplete] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { total } = useBasket();
  const stripePaymentMethodRef = useRef<string | null>(null);
  const navigate = useNavigate();

  let name, resetAddress;
  if (data) {
    ({ name, ...resetAddress } = data);
  }

  const handleNext = async () => {
    if (activeStep === 0 && saveAddressChecked && elements) {
      const address = await getStripeAddress();
      if (address) await updateAddress(address);
    }

    if (activeStep === 1) {
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

  const getStripeAddress = async () => {
    const addressElement = elements?.getElement("address");
    if (!addressElement) return null;
    const {
      value: { name, address },
    } = await addressElement.getValue();

    if (name && address) return { ...address, name };
    return null;
  };

  const confirmPayment = async () => {
    setSubmitting(true);
    try {
      if (!basket?.clientSecret)
        throw new Error("Unable to process payment");

      const shippingAddress = await getStripeAddress() ?? data;
      if (!shippingAddress) throw new Error("Missing shipping address");
      if (!stripePaymentMethodRef.current) throw new Error("Missing payment method");

      const paymentSummary = { last4: "4242", brand: "visa", exp_month: 12, exp_year: 2034 };
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

  const handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    if (event.complete) setAddressComplete(true);
  };

  if (isLoading)
    return <Typography variant="h6">Loading checkout...</Typography>;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: activeStep === 0 ? "block" : "none" }}>
          <AddressElement
            options={{
              mode: "shipping",
              defaultValues: {
                name: name,
                address: resetAddress,
              },
            }}
            onChange={handleAddressChange}
          />
          <FormControlLabel
            sx={{ display: "flex", justifyContent: "end" }}
            control={
              <Checkbox
                checked={saveAddressChecked}
                onChange={(e) =>
                  setSaveAddressChecked((e.target as HTMLInputElement).checked)
                }
              />
            }
            label="Save as default address"
          />
        </Box>
        <Box sx={{ display: activeStep === 1 ? "block" : "none" }}>
          <PaymentElement />
        </Box>
        <Box sx={{ display: activeStep === 2 ? "block" : "none" }}>
          <Typography variant="h6" gutterBottom>
            Review your order
          </Typography>
          {basket?.items.map((item) => (
            <Box
              key={item.productId}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography>
                {item.name} x {item.quantity}
              </Typography>
              <Typography>{currencyFormat(item.price * item.quantity)}</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Subtotal</Typography>
            <Typography>{currencyFormat(basket?.items.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0)}</Typography>
          </Box>
          {stripePaymentMethodRef.current && (
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography>Payment</Typography>
              <Typography>Visa ending in 4242</Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            paddingTop: 2,
            justifyContent: "space-between",
          }}
        >
          <LoadingButton
            onClick={handleNext}
            disabled={
              (activeStep === 0 && !addressComplete && !data) ||
              submitting
            }
            loading={submitting}
          >
            {activeStep === steps.length - 1
              ? `Pay ${currencyFormat(total)}`
              : "Next"}
          </LoadingButton>
        </Box>
      </Box>
    </Paper>
  );
}
