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
                TrailName = "Nehéz terep (Bükkihűlsz)",
                Description = "Nehéz terep, csak profiknak.",
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
            },

 

            new HikingTrail
            {
                TrailName = "Nagymaros - Prédikálószék",
                Description = "A Dunakanyar legszebb panorámája.",
                TrailSymbol = "▲",
                StartLocation = "Nagymaros",
                EndLocation = "Prédikálószék", 
                Length = 9.2,
                Elevation = 560,
                EstimatedDuration = 180,
                Difficulty = 2,
                Rating = 0,
                ReviewCount = 0,
                CoverPhotoPath = "nincs",
                CreatedAt = DateTime.UtcNow,
                RouteLine = geometryFactory.CreateLineString([
                    new Coordinate(18.96, 47.79),
                    new Coordinate(18.94, 47.78)
                ])
            },

            new HikingTrail
            {
                TrailName = "Rám-szakadék kaland",
                Description = "Izgalmas szurdoktúra létrákkal és vízesésekkel.",
                TrailSymbol = "Z",
                StartLocation = "Dömös",
                EndLocation = "Dömös",
                Length = 7.1,
                Elevation = 320,
                EstimatedDuration = 150,
                Difficulty = 3,
                Rating = 0,
                ReviewCount = 0,
                CoverPhotoPath = "nincs",
                CreatedAt = DateTime.UtcNow,
                RouteLine = geometryFactory.CreateLineString([
                    new Coordinate(18.91, 47.76),
                    new Coordinate(18.90, 47.75)
                ])
            },

            new HikingTrail
            {
                TrailName = "Spartacus-ösvény",
                Description = "Kanyargós vadászösvény pazar kilátással.",
                TrailSymbol = "Z+",
                StartLocation = "Pilisszentlászló",
                EndLocation = "Visegrád",
                Length = 14.0,
                Elevation = 410,
                EstimatedDuration = 240,
                Difficulty = 2,
                Rating = 0,
                ReviewCount = 0,
                CoverPhotoPath = "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=600",
                CreatedAt = DateTime.UtcNow,
                RouteLine = geometryFactory.CreateLineString([
                    new Coordinate(18.98, 47.77),
                    new Coordinate(19.00, 47.78)
                ])
            },

            new HikingTrail
            {
                TrailName = "Vörös-kő extrém kör",
                Description = "Extrém nehézségű, meredek emelkedőkkel tarkított körtúra.",
                TrailSymbol = "P▲",
                StartLocation = "Leányfalu",
                EndLocation = "Vörös-kő",
                Length = 18.5,
                Elevation = 1150,
                EstimatedDuration = 360,
                Difficulty = 4,
                Rating = 0,
                ReviewCount = 0,
                CoverPhotoPath = "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=600",
                CreatedAt = DateTime.UtcNow,
                RouteLine = geometryFactory.CreateLineString([
                    new Coordinate(19.08, 47.72),
                    new Coordinate(19.06, 47.73)
                ])
            }
        };

        context.HikingTrails.AddRange(trails);
        context.SaveChanges();
    }
}