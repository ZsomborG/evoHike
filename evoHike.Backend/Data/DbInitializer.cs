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
            },

            new RouteEntity
            {
                Name = "Nagymaros - Prédikálószék",
                ShortDescription = "A Dunakanyar legszebb panorámája.",
                Length = 9200,
                ElevationGain = 560,
                EstimatedDuration = 180,
                CoverPhotoPath = "nincs",
                PointsOfInterests = "{}"
            },

            new RouteEntity
            {
                Name = "Rám-szakadék kaland",
                ShortDescription = "Izgalmas szurdoktúra létrákkal és vízesésekkel.",
                Length = 7100,
                ElevationGain = 320,
                EstimatedDuration = 150,
                CoverPhotoPath = "nincs",
                PointsOfInterests = "{}"
            },

            new RouteEntity
            {
                Name = "Spartacus-ösvény",
                ShortDescription = "Kanyargós vadászösvény pazar kilátással.",
                Length = 14000,
                ElevationGain = 410,
                EstimatedDuration = 240,
                CoverPhotoPath = "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=600",
                PointsOfInterests = "{}"
            },

            new RouteEntity
            {
                Name = "Vörös-kő extrém kör",
                ShortDescription = "Extrém nehézségű, meredek emelkedőkkel tarkított körtúra.",
                Length = 18500,
                ElevationGain = 1150,
                EstimatedDuration = 360,
                CoverPhotoPath = "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=600",
                PointsOfInterests = "{}"
            }
    };

        context.Trails.AddRange(trails);
        context.SaveChanges();
    }
}