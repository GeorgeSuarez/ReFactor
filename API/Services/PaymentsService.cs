using Stripe;

namespace API.Services;

public class PaymentsService
{
    private readonly IConfiguration _config;
    private readonly DiscountService _discountService;
    private readonly PaymentIntentService _paymentIntentService;

    public PaymentsService(IConfiguration config, DiscountService discountService)
    {
        _config = config;
        _discountService = discountService;
        var client = new StripeClient(_config["StripeSettings:SecretKey"]);
        _paymentIntentService = new PaymentIntentService(client);
    }

    public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket, bool removeDiscount = false)
    {
        var intent = new PaymentIntent();
        long subtotal = basket.Items.Sum(x => x.Quantity * x.Product.Price);
        long deliveryFee = subtotal > 10000 ? 0 : 500;
        long discount = 0;

        if (basket.Coupon != null)
        {
            discount = await _discountService.CalculateDiscountFromAmount(basket.Coupon, subtotal, removeDiscount);
        }

        var totalAmount = subtotal - discount + deliveryFee;

        if (string.IsNullOrEmpty(basket.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = totalAmount,
                Currency = "usd",
                PaymentMethodTypes = ["card"]
            };
            intent = await _paymentIntentService.CreateAsync(options);
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = totalAmount
            };

            await _paymentIntentService.UpdateAsync(basket.PaymentIntentId, options);
        }

        return intent;
    }
}
