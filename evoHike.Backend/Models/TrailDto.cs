using NetTopologySuite.Geometries;

namespace evoHike.Backend.Models
{
    public class TrailDto
    {
        public string Id { get; set; } = string.Empty;
        public required string Name { get; set; }
        public string? Location { get; set; }
        public double Length { get; set; }
        public int Difficulty { get; set; }
        public double ElevationGain { get; set; }
        public double Rating { get; set; }
        public int ReviewCount { get; set; }
        public int? EstimatedDuration { get; set; }
        public required string CoverPhotoPath { get; set; }
        public Geometry? RouteLine { get; set; }
    }
}