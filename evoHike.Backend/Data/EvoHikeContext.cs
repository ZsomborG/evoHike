using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace evoHike.Backend.Data
{
    public class EvoHikeContext : DbContext
    {
        public EvoHikeContext(DbContextOptions<EvoHikeContext> options) : base(options)
        {
            if (Configs.UseInMemory)
            {
                // Legyen valamilyen adatunk, ha memória adatbázist használunk
                Trails?.Add(new Trail { Id = 1, Name = "Bükkinyúlsz", Location = "Bükk", Length = 30, Difficulty = DifficultyLevel.Medium, Elevation = 2 });
                Trails?.Add(new Trail { Id = 2, Name = "Bükkihűlsz", Location = "Bükk", Length = 20, Difficulty = DifficultyLevel.Hard, Elevation = 10 });

                SaveChangesAsync();
            }
            else
            {
                // biztosítja, hogy létrejöjjön az MSSql DB, ha az nem létezne. Utána már feltöltheted a DB-t értékekkel.
                Database.EnsureCreated();
            }
        }

        public DbSet<Trail> Trails { get; set; }
    }
}
