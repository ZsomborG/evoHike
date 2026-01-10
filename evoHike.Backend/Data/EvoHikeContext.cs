using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Data
{
    public class EvoHikeContext : DbContext
    {
        public EvoHikeContext(DbContextOptions<EvoHikeContext> options) : base(options)
        {
        }

        public DbSet<RouteEntity> Trails { get; set; }
        public DbSet<PlannedHikeEntity> PlannedHikes { get; set; }
    }
}