using evoHike.Backend.Models;

namespace evoHike.Backend.Services
{
    public interface IPlannedHikeService
    {
        Task<IEnumerable<PlannedHikeEntity>> GetAllPlannedHikesAsync();
        Task<PlannedHikeEntity> CreatePlannedHikeAsync(PlannedHikeEntity plannedHike);
        Task<bool> MarkHikeAsCompletedAsync(int id);
    }
}