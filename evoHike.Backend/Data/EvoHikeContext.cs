using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Data
{
    public class EvoHikeContext : DbContext
    {
        public EvoHikeContext(DbContextOptions<EvoHikeContext> options) : base(options)
        {
        }

        public DbSet<HikingTrail> HikingTrails { get; set; }
        public DbSet<PointOfInterest> PointsOfInterest { get; set; }
        public DbSet<PlannedHikeEntity> PlannedHikes { get; set; }
    }
}