using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace evoHike.Backend.Models
{
    [Table("Routes")]
    public class RouteEntity
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(150)]
        public required string Name { get; set; }

        [MaxLength(500)]
        public string? ShortDescription { get; set; }

        public string? RoutePlan { get; set; }

        [MaxLength(500)]
        public string? CoverPhotoPath { get; set; }

        public double Length { get; set; }

        public int EstimatedDuration { get; set; }

        public int ElevationGain { get; set; }

        public string? PointsOfInterests { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}