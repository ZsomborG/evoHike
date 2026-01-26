namespace evoHike.Backend.Models.DTOs
{
    public class PlanHikeRequest
    {
        public int RouteId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public List<string>? ChecklistItems { get; set; }
    }
}