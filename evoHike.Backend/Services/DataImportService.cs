using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using evoHike.Backend.Data;
using evoHike.Backend.Models;
using evoHike.Backend.Utils;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;

namespace evoHike.Backend.Services;

public partial class DataImportService(EvoHikeContext context)
{
    private static string? GetAttributeValue(IAttributesTable attributes, params string[] keys)
    {
        return (from key in keys
            where attributes.Exists(key)
            select attributes[key]
                ?.ToString()).FirstOrDefault(val => !string.IsNullOrWhiteSpace(val));
    }

    private static double ParseDouble(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return 0;
        
        if (double.TryParse(value,
                NumberStyles.Any,
                CultureInfo.InvariantCulture,
                out var result))
            return result;

        return 0;
    }

    [GeneratedRegex(@"\(([^)]+)\)")]
    private static partial Regex ParenthesisContentRegex();

    public async Task<string> ImportTrailsAsync(string folderPath)
    {
        var report = new StringBuilder();
        var importedCount = 0;
        var skippedCount = 0;
        if (!Directory.Exists(folderPath))
            return $"Directory not found: {folderPath}";

        var files = Directory.GetFiles(folderPath, "*.geojson");
        var reader = new GeoJsonReader();
        var nameRegex = ParenthesisContentRegex();

        foreach (var file in files)
            try
            {
                var json = await File.ReadAllTextAsync(file);
                var featureCollection = reader.Read<FeatureCollection>(json);
                if (featureCollection == null)
                    continue;

                foreach (var feature in featureCollection)
                {
                    Geometry? validGeometry = null;

                    switch (feature.Geometry)
                    {
                        case LineString ls:
                            validGeometry = ls;
                            break;
                        
                        case MultiLineString mls:
                            validGeometry = mls;
                            break;
                        
                        case GeometryCollection gc:
                        {
                            var lines = new List<LineString>();
                            
                            for (var i = 0; i < gc.NumGeometries; i++)
                                if (gc.GetGeometryN(i) is LineString subLine)
                                    lines.Add(subLine);
                            
                            if (lines.Count > 0)
                                validGeometry = new MultiLineString(lines.ToArray());
                            
                            break;
                        }
                    }

                    if (validGeometry == null)
                    {
                        skippedCount++;
                        continue;
                    }

                    var attr = feature.Attributes;
                    var originalName = GetAttributeValue(attr, "name") ?? Path.GetFileNameWithoutExtension(file);
                    
                    string finalName = originalName;
                    string? parsedStart = null;
                    string? parsedEnd = null;

                    var matches = nameRegex.Matches(originalName);
                    if (matches.Count > 0)
                    {
                        var content = matches[^1].Groups[1].Value.Trim();
                        finalName = content;

                        var parts = content.Split([" - ", " – ", " — "], 
                            StringSplitOptions.RemoveEmptyEntries 
                            | StringSplitOptions.TrimEntries);
                        if (parts.Length > 0)
                        {
                            parsedStart = parts[0];
                            if (parts.Length > 1)
                                parsedEnd = parts[^1];
                        }
                    }

                    var startLoc = GetAttributeValue(attr, 
                                       "from")
                                   ?? parsedStart;
                    var endLoc = GetAttributeValue(attr, 
                                     "to")
                                 ?? parsedEnd;
                    var symbol = GetAttributeValue(attr, 
                        "osmc:symbol",
                        "jel",
                        "symbol");
                    var network = GetAttributeValue(attr,
                        "network");
                    var wikidata = GetAttributeValue(attr,
                        "wikidata");
                    var wikipedia = GetAttributeValue(attr,
                        "wikipedia");
                    var website = GetAttributeValue(attr,
                        "website",
                        "contact:website",
                        "url");
                    var description = GetAttributeValue(attr,
                        "description");
                    var lengthKm = ParseDouble(GetAttributeValue(attr,
                        "distance",
                        "length"));

                    if (lengthKm <= 0)
                        lengthKm = GeoUtils.CalculateLengthKm(validGeometry);

                    var walkingHours = lengthKm / 4.0;
                    
                    var elevationGain = ParseDouble(GetAttributeValue(attr, "ascent", "ele", "elevation"));
                    var elevationHours = elevationGain / 600.0;
                    
                    var totalMinutes = (int)Math.Round((walkingHours + elevationHours) * 60);
                    
                    var trail = new HikingTrail
                    {
                        TrailName = finalName,
                        Description = description,
                        TrailSymbol = symbol,
                        StartLocation = startLoc,
                        EndLocation = endLoc,
                        Network = network,
                        Wikidata = wikidata,
                        Wikipedia = wikipedia,
                        Website = website,
                        Length = lengthKm,
                        Difficulty = 0,
                        Elevation = elevationGain,
                        Rating = 0,
                        ReviewCount = 0,
                        CoverPhotoPath = "",
                        EstimatedDuration = totalMinutes,
                        RouteLine = validGeometry
                    };
                    
                    if (trail.RouteLine != null)
                        trail.RouteLine.SRID = 4326;
                    context.HikingTrails.Add(trail);
                    importedCount++;
                }
            }
            catch (Exception ex)
            {
                report.AppendLine($"Error processing {Path.GetFileName(file)}: {ex.Message}");
            }

        await context.SaveChangesAsync();
        report.AppendLine("Import Complete.");
        report.AppendLine($"Imported: {importedCount}");
        report.AppendLine($"Skipped (Invalid Geometry): {skippedCount}");
        return report.ToString();
    }

    public async Task<string> ImportPoisAsync(string filePath)
    {
        if (!File.Exists(filePath))
            return $"POI file not found: {filePath}";

        var imported = 0;

        try
        {
            var reader = new GeoJsonReader();
            var json = await File.ReadAllTextAsync(filePath);
            var featureCollection = reader.Read<FeatureCollection>(json);
            if (featureCollection == null)
                return "POI Feature collection is null";

            foreach (var feature in featureCollection)
                if (feature.Geometry is Point point)
                {
                    var type = GetAttributeValue(feature.Attributes,
                                   "tourism")
                               ?? GetAttributeValue(feature.Attributes,
                                   "amenity")
                               ?? GetAttributeValue(feature.Attributes,
                                   "natural")
                               ?? "General";
                    var poi = new PointOfInterest
                    {
                        POIName = GetAttributeValue(feature.Attributes,
                                   "name")
                               ?? "Unnamed POI",
                        POIType = type,
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
