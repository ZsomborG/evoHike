using evoHike.Backend.Models;

namespace evoHike.Backend.Services
{
    public interface ITrailService
    {
        Task<IReadOnlyList<HikingTrail>> GetAllTrailsAsync();
        Task<HikingTrail?> GetTrailByIdAsync(int id);
        Task<IEnumerable<PointOfInterest>> GetPoisNearTrailAsync(int trailId, double distanceMeters);
    }
}