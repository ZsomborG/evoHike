using NetTopologySuite.Geometries;

namespace evoHike.Backend.Models
{
    public class PoiDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Type { get; set; }
        public required Geometry Location { get; set; }
    }
}