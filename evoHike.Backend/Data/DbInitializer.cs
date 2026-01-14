using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite;
using NetTopologySuite.Geometries;

namespace evoHike.Backend.Data;

public static class DbInitializer
{
    public static void Initialize(EvoHikeContext context)
    {
        if (!context.Database.IsInMemory())
        {
            context.Database.EnsureDeleted();
            context.Database.Migrate();
        }

        if (context.HikingTrails.Any())
        {
            return;
        }

        var geometryFactory = NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326);

        var trails = new HikingTrail[]
        {
            new HikingTrail
            {
                TrailName = "Bükkinyúlsz",
                Description = "Kellemes séta a Bükkben.",
                TrailSymbol = "P",
                StartLocation = "Szilvásvárad",
                EndLocation = "Istállós-kő",
                Length = 5.5,
                Elevation = 300,
                EstimatedDuration = 90,
                Difficulty = 1,
                Rating = 4.5,
                ReviewCount = 10,
                CoverPhotoPath = "",
                CreatedAt = DateTime.UtcNow,
                RouteLine = geometryFactory.CreateLineString([
                    new Coordinate(20.39, 48.10),
                    new Coordinate(20.41, 48.11)
                ])
            },
            new HikingTrail
            {
                TrailName = "Nehéz terep",
                Description = "Csak profiknak.",
                TrailSymbol = "K",
                StartLocation = "Bánkút",
                EndLocation = "Bánkút",
                Length = 12.0,
                Elevation = 800,
                EstimatedDuration = 240,
                Difficulty = 3,
                Rating = 4.8,
                ReviewCount = 5,
                CoverPhotoPath = "",
                CreatedAt = DateTime.UtcNow,
                RouteLine = geometryFactory.CreateLineString([
                    new Coordinate(20.48, 48.09),
                    new Coordinate(20.50, 48.08)
                ])
            }
        };

        context.HikingTrails.AddRange(trails);
        context.SaveChanges();
    }
}