using System.Text;
using evoHike.Backend.Data;
using evoHike.Backend.Models;
using evoHike.Backend.Utils;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;

namespace evoHike.Backend.Services;

public class DataImportService(EvoHikeContext context)
{
    public async Task<string> ImportTrailsAsync(string folderPath)
    {
        var report = new StringBuilder();
        int importedCount = 0, skippedCount = 0;

        if (!Directory.Exists(folderPath)) 
            return $"Directory not found: {folderPath}";

        var reader = new GeoJsonReader();

        foreach (var file in Directory.GetFiles(folderPath, "*.geojson"))
        {
            try
            {
                var json = await File.ReadAllTextAsync(file);
                var featureCollection = reader.Read<FeatureCollection>(json);
                if (featureCollection == null) continue;

                foreach (var feature in featureCollection)
                {
                    var validGeometry = ImportHelper.ExtractValidLineGeometry(feature.Geometry);

                    if (validGeometry == null)
                    {
                        skippedCount++;
                        continue;
                    }

                    var attr = feature.Attributes;
                    var rawName = ImportHelper.GetAttributeValue(attr, "name")
                                  ?? Path.GetFileNameWithoutExtension(file);
                    var nameInfo = ImportHelper.ParseTrailDetails(rawName, Path.GetFileNameWithoutExtension(file));

                    var lengthKm = ImportHelper.ParseDouble(ImportHelper.GetAttributeValue(attr, "distance", "length"));
                    if (lengthKm <= 0)
                        lengthKm = GeoUtils.CalculateLengthKm(validGeometry);

                    var elevation = ImportHelper.ParseDouble(ImportHelper.GetAttributeValue(attr, "ascent", "ele"));

                    var trail = new HikingTrail
                    {
                        TrailName = nameInfo.Name,
                        StartLocation = ImportHelper.GetAttributeValue(attr, "from") 
                                        ?? nameInfo.Start,
                        EndLocation = ImportHelper.GetAttributeValue(attr, "to") 
                                      ?? nameInfo.End,
                        TrailSymbol = ImportHelper.GetAttributeValue(attr, "osmc:symbol", "jel", "symbol"),
                        Description = ImportHelper.GetAttributeValue(attr, "description"),
                        Length = lengthKm,
                        Elevation = elevation,
                        EstimatedDuration = ImportHelper.CalculateDurationMinutes(lengthKm, elevation),
                        CoverPhotoPath = "",
                        RouteLine = validGeometry
                    };

                    trail.RouteLine.SRID = 4326;
                    context.HikingTrails.Add(trail);
                    importedCount++;
                }
            }
            catch (Exception ex)
            {
                report.AppendLine($"Error processing {Path.GetFileName(file)}: {ex.Message}");
            }
        }

        await context.SaveChangesAsync();
        report.AppendLine($"Import Complete. Imported: {importedCount}, Skipped: {skippedCount}");
        return report.ToString();
    }

    public async Task<string> ImportPoisAsync(string filePath)
    {
        if (!File.Exists(filePath)) return $"POI file not found: {filePath}";

        try
        {
            var json = await File.ReadAllTextAsync(filePath);
            var collection = new GeoJsonReader().Read<FeatureCollection>(json);
            int imported = 0;

            foreach (var feature in collection ?? [])
            {
                if (feature.Geometry is not Point point)
                    continue;

                var poi = new PointOfInterest
                {
                    PointOfInterestName = ImportHelper.GetAttributeValue(feature.Attributes, "name") 
                              ?? "Unnamed POI",
                    PointOfInterestType = ImportHelper.GetAttributeValue(feature.Attributes, "tourism", "amenity", "natural")
                              ?? "General",
                    Location = point
                };
                poi.Location.SRID = 4326;
                context.PointsOfInterest.Add(poi);
                imported++;
            }

            await context.SaveChangesAsync();
            return $"POIs: Imported {imported}";
        }
        catch (Exception ex)
        {
            return $"Error importing POIs: {ex.Message}";
        }
    }
}