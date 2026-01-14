using evoHike.Backend.Models;

namespace evoHike.Backend.Services
{
    public interface ITrailService
    {
        Task<IEnumerable<HikingTrail>> GetAllTrailsAsync();
        Task<HikingTrail?> GetTrailByIdAsync(int id);
        Task<IEnumerable<PointOfInterest>> GetPoisNearTrailAsync(int trailId, double distanceMeters);
    }
}