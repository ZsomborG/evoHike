using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Data
{
    public class EvoHikeContext : DbContext
    {
        public EvoHikeContext(DbContextOptions<EvoHikeContext> options) : base(options)
        {
        }

        public DbSet<Trail> Trails { get; set; }
        public DbSet<PlannedHike> PlannedHikes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Trail>()
                .Property(t => t.Id)
                .HasDefaultValueSql("NEWID()");

            modelBuilder.Entity<PlannedHike>()
                .Property(p => p.Id)
                .HasDefaultValueSql("NEWID()");

            modelBuilder.Entity<PlannedHike>()
                .HasOne(p => p.Route)
                .WithMany()
                .HasForeignKey(p => p.RouteId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}