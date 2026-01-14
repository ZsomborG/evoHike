using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace evoHike.Backend.Models
{
    [Table("PlannedHikes")]
    public class PlannedHikeEntity
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(HikingTrail))]
        public int HikingTrailId { get; set; }

        public HikingTrail? HikingTrail { get; set; }

        public DateTime PlannedStartDateTime { get; set; }

        public DateTime PlannedEndDateTime { get; set; }

        public HikeStatus Status { get; set; }

        public DateTime? CompletedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}