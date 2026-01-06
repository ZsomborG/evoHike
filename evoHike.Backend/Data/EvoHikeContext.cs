using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace evoHike.Backend.Data
{
    public class EvoHikeContext : DbContext
    {
        public EvoHikeContext(DbContextOptions<EvoHikeContext> options) : base(options)
        {
        }

        public DbSet<Trail> Trails { get; set; }
    }
}
