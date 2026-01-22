using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace evoHike.Backend.Models;

public class PointOfInterest
{
    [Key]
    public int PointOfInterestId { get; set; }
    public required string PointOfInterestName { get; set; }
    public required string PointOfInterestType { get; set; }
    public required Point Location { get; set; }
}
