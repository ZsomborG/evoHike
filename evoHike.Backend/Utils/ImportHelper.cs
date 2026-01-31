using System.Globalization;
using System.Text.RegularExpressions;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;

namespace evoHike.Backend.Utils;

public static partial class ImportHelper
{
    private static readonly Regex NameRegex = ParenthesisContentRegex();

    public static string? GetAttributeValue(
        IAttributesTable attributes,
        params string[] keys)
    {
        return (from key in keys
                where attributes.Exists(key)
                select attributes[key]?.ToString())
            .FirstOrDefault(val => !string.IsNullOrWhiteSpace(val));
    }

    public static double ParseDouble(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return 0;

        return double.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out var result)
            ? result
            : 0;
    }

    public static int CalculateDurationMinutes(
        double lengthKm,
        double elevationMeters)
    {
        var walkingHours = lengthKm / 4.0;
        var elevationHours = elevationMeters / 600.0;
        return (int)Math.Round((walkingHours + elevationHours) * 60);
    }

    public static (string Name, string? Start, string? End) ParseTrailDetails(
        string originalName,
        string fallback)
    {
        string finalName = originalName;
        string? start = null, end = null;

        var matches = NameRegex.Matches(originalName);

        if (matches.Count <= 0)
            return (string.IsNullOrWhiteSpace(finalName)
                ? fallback
                : finalName, start, end);

        var content = matches[^1].Groups[1].Value.Trim();
        finalName = content;

        var parts = content.Split([" - ", " – ", " — "], StringSplitOptions.TrimEntries);

        if (parts.Length <= 0)
            return (string.IsNullOrWhiteSpace(finalName)
                ? fallback
                : finalName, start, end);

        start = parts[0];
        if (parts.Length > 1) 
            end = parts[^1];

        return (string.IsNullOrWhiteSpace(finalName)
            ? fallback
            : finalName, start, end);
    }

    public static Geometry? ExtractValidLineGeometry(Geometry geo)
    {
        return geo switch
        {
            LineString ls => ls,
            MultiLineString mls => mls,
            GeometryCollection gc => new MultiLineString(gc.Geometries.OfType<LineString>().ToArray()),
            _ => null
        };
    }

    [GeneratedRegex(@"\(([^)]+)\)", RegexOptions.Compiled)]
    private static partial Regex ParenthesisContentRegex();
}