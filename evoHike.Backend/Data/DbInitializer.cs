using evoHike.Backend.Models;

namespace evoHike.Backend.Data;

public static class DbInitializer
{
    public static void Initialize(EvoHikeContext context)
    {

        if (context.Trails.Any())
        {
            return;
        }

        var trails = new Trail[]
        {
            new Trail
            {
                Name = "Bükkinyúlsz",
                ShortDescription = "Kellemes séta a Bükkben.",
                Length = 30, 
                ElevationGain = 200,
                EstimatedDuration = 120,
                CoverPhotoPath = "nincs",
                PointsOfInterests = "{}"
            },
            new Trail
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