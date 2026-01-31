using NetTopologySuite.Geometries;

namespace evoHike.Backend.Utils;

public static class GeoUtils
{
    private const double EarthRadiusKm = 6371.0;

    public static double CalculateLengthKm(Geometry? geometry)
    {
        if (geometry == null) 
            return 0;

        double totalDistance = 0;

        switch (geometry)
        {
            case LineString ls:
                totalDistance += CalculateLineLength(ls.Coordinates);
                break;
            case MultiLineString mls:
                foreach (var geom in mls.Geometries)
                {
                    if (geom is LineString subLine)
                        totalDistance += CalculateLineLength(subLine.Coordinates);
                }
                break;
            case GeometryCollection gc:
                totalDistance += gc.Geometries.Sum(CalculateLengthKm);
                break;
        }

        return Math.Round(totalDistance, 2);
    }

    private static double CalculateLineLength(Coordinate[] coords)
    {
        double length = 0;
        for (int i = 0; i < coords.Length - 1; i++)
        {
            length += EquirectangularDistance(coords[i], coords[i + 1]);
        }
        return length;
    }

    private static double EquirectangularDistance(Coordinate p1, Coordinate p2)
    {
        var lat1 = ToRadians(p1.Y);
        var lat2 = ToRadians(p2.Y);
        var lon1 = ToRadians(p1.X);
        var lon2 = ToRadians(p2.X);

        var x = (lon2 - lon1) * Math.Cos((lat1 + lat2) / 2);
        var y = lat2 - lat1;

        return Math.Sqrt(x * x + y * y) * EarthRadiusKm;
    }

    private static double ToRadians(double degrees) => degrees * Math.PI / 180.0;
}
