using NetTopologySuite.Geometries;

namespace evoHike.Backend.Models
{
    public class TrailDto
    {
        public string Id { get; set; } = string.Empty; 
        public string Name { get; set; } = string.Empty;
        public string? Location { get; set; } 
        public double Length { get; set; } 
        public int Difficulty { get; set; } 
        public double ElevationGain { get; set; } 
        public double Rating { get; set; } 
        public int ReviewCount { get; set; } 
        public int? EstimatedDuration { get; set; } 
        public string CoverPhotoPath { get; set; } = string.Empty;
        public Geometry? RouteLine { get; set; }

        public TrailDto() { }

        public TrailDto(HikingTrail trail)
        {
            Id = trail.TrailID.ToString();
            Name = trail.TrailName;
            Location = !string.IsNullOrEmpty(trail.StartLocation) 
                ? $"{trail.StartLocation} - {trail.EndLocation}" 
                : trail.StartLocation;
            Length = trail.Length;
            Difficulty = trail.Difficulty;
            ElevationGain = trail.Elevation;
            Rating = trail.Rating;
            ReviewCount = trail.ReviewCount;
            EstimatedDuration = trail.EstimatedDuration;
            CoverPhotoPath = trail.CoverPhotoPath ?? "";
            RouteLine = trail.RouteLine;
        }
    }
}