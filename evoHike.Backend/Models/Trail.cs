namespace evoHike.Backend.Models
{

    public enum DifficultyLevel
    {
        Easy,
        Medium,
        Hard,
        Expert
    }

    public class Trail
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public required string Location { get; set; }

        public double Length { get; set; }

        public DifficultyLevel Difficulty { get; set; }

        public double Elevation { get; set; }
    }
}
