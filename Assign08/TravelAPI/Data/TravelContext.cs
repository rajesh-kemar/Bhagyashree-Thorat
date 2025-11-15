using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TravelApi.Models;

namespace TravelApi.Data
{
    public class TravelContext : IdentityDbContext<AppUser>
    {
        public TravelContext(DbContextOptions<TravelContext> options) : base(options) { }

        public DbSet<Trip> Trips { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }

        public DbSet<DriverTripSummary> DriverTripSummaries { get; set; } // keyless, okay
        public DbSet<DispatcherInvite> DispatcherInvites { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // IMPORTANT

            // Trip relations
            modelBuilder.Entity<Trip>()
                .HasOne(t => t.Vehicle)
                .WithMany(v => v.Trips)
                .HasForeignKey(t => t.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Trip>()
                .HasOne(t => t.Driver)
                .WithMany(d => d.Trips)
                .HasForeignKey(t => t.DriverId)
                .OnDelete(DeleteBehavior.Restrict);

            // Keyless View
            modelBuilder.Entity<DriverTripSummary>().HasNoKey();
        }
    }
}
