using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Data;

public static class DbInitializer
{
    public static void Initialize(EvoHikeContext context)
    {
        context.Database.Migrate();

        if (context.Trails.Any())
        {
            return;
        }

        var trails = new RouteEntity[]
        {
            new RouteEntity
            {
                Name = "Bükkinyúlsz",
                ShortDescription = "Kellemes séta a Bükkben.",
                Length = 30,
                ElevationGain = 200,
                EstimatedDuration = 120,
                CoverPhotoPath = "nincs",
                PointsOfInterests = "{}"
            },
            new RouteEntity
            {
                Name = "Bükkihűlsz",
                ShortDescription = "Nehéz terep, csak profiknak.",
                Length = 20,
                ElevationGain = 1000,
                EstimatedDuration = 300,
                CoverPhotoPath = "nincs",
                PointsOfInterests = "{}"
            }
        };

        context.Trails.AddRange(trails);
        context.SaveChanges();
    }
}