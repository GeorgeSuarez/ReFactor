namespace API.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public DbSet<Product> Products { get; set; }
    public DbSet<Basket> Baskets { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<IdentityRole>()
            .HasData(
                new IdentityRole { Id = "e069461a-10cf-4abf-9930-d070b2a7e40f", Name = "Member", NormalizedName = "MEMBER", ConcurrencyStamp = "aa005b1a-5f91-46c8-ae80-2783d4e9d206" },
                new IdentityRole { Id = "ed2e9149-fa53-484c-a93f-bd33f9e9fcf6", Name = "Admin", NormalizedName = "ADMIN", ConcurrencyStamp = "72eda926-9bff-47cc-95e0-bbc0eb9ec0e3" }
            );
    }
}

