using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace evoHike.Backend.Models;

public class PointOfInterest
{
    [Key]
    public int POIID { get; set; }
    public required string POIName { get; set; }
    public required string POIType { get; set; }
    public required Point Location { get; set; }
}
