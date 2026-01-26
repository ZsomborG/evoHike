using evoHike.Backend.Models;
using evoHike.Backend.Models.DTOs;

namespace evoHike.Backend.Services
{
    public interface IPlannedHikeService
    {
        Task<IEnumerable<PlannedHikeEntity>> GetAllPlannedHikesAsync(HikeStatus? filterStatus = null);

        Task<PlannedHikeEntity> CreatePlannedHikeAsync(PlanHikeRequest request);

        Task<bool> MarkHikeAsCompletedAsync(int id);
    }
}