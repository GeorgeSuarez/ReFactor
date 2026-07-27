using Stripe;

namespace API.Services;

public class DiscountService
{
    private readonly PromotionCodeService _promotionCodeService;
    private readonly CouponService _couponService;

    public DiscountService(IConfiguration config)
    {
        var client = new StripeClient(config["StripeSettings:SecretKey"]);
        _promotionCodeService = new PromotionCodeService(client);
        _couponService = new CouponService(client);
    }

    public async Task<AppCoupon?> GetCouponFromPromoCode(string code)
    {
        var options = new PromotionCodeListOptions()
        {
            Code = code
        };

        var promotionCodes = await _promotionCodeService.ListAsync(options);

        var promotionCode = promotionCodes.FirstOrDefault();

        if (promotionCode != null && promotionCode.Promotion.Coupon != null)
        {
            return new AppCoupon
            {
                Name = promotionCode.Promotion.Coupon.Name,
                AmountOff = promotionCode.Promotion.Coupon.AmountOff,
                PercentOff = promotionCode.Promotion.Coupon.PercentOff,
                CouponId = promotionCode.Promotion.CouponId,
                PromotionCode = promotionCode.Code

            };
        }

        return null;
    }

    public async Task<long> CalculateDiscountFromAmount(AppCoupon appCoupon, long amount, bool removeDiscount = false)
    {
        var coupon = await _couponService.GetAsync(appCoupon.CouponId);

        if (coupon.AmountOff.HasValue && !removeDiscount)
        {
            return (long)coupon.AmountOff;
        }
        else if (coupon.PercentOff.HasValue && !removeDiscount)
        {
            return (long)Math.Round(amount * (coupon.PercentOff.Value / 100), MidpointRounding.AwayFromZero);
        }

        return 0;
    }

}
