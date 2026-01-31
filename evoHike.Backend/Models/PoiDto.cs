using NetTopologySuite.Geometries;

namespace evoHike.Backend.Models
{
    public class PoiDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public Geometry? Location { get; set; }

        public PoiDto() { }

        public PoiDto(PointOfInterest poi)
        {
            Id = poi.PointOfInterestId;
            Name = poi.PointOfInterestName;
            Type = poi.PointOfInterestType;
            Location = poi.Location;
        }
    }
}