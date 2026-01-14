using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace evoHike.Backend.Models;

public class HikingTrail
{
    [Key]
    public int TrailID { get; set; }
    public required string TrailName { get; set; }
    public string? TrailSymbol { get; set; }
    public string? Description { get; set; }
    public string? StartLocation { get; set; }
    public string? EndLocation { get; set; }
    public string? Network { get; set; }
    public string? Wikidata { get; set; }
    public string? Wikipedia { get; set; }
    public string? Website { get; set; }
    public double Length { get; set; }
    public int Difficulty { get; set; }
    public double Elevation { get; set; }
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public required string CoverPhotoPath { get; set; }
    public int? EstimatedDuration { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Geometry? RouteLine { get; set; }
}
