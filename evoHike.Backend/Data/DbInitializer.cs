using evoHike.Backend.Models;

namespace evoHike.Backend.Data;

public static class DbInitializer
{
    public static void Initialize(EvoHikeContext context)
    {
        context.Database.EnsureCreated();

        if (context.Trails.Any())
        {
            return;
        }

        var trails = new Trail[]
        {
            new Trail { Name = "Bükkinyúlsz", Location = "Bükk", Length = 30, Difficulty = DifficultyLevel.Medium, Elevation = 2 },
            new Trail { Name = "Bükkihűlsz", Location = "Bükk", Length = 20, Difficulty = DifficultyLevel.Hard, Elevation = 10 }
        };

        context.Trails.AddRange(trails);
        context.SaveChanges();
    }
}