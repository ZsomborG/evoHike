using evoHike.Backend.Models;

namespace evoHike.Backend.Services
{
    public interface ITrailService
    {
        Task<IEnumerable<RouteEntity>> GetAllTrailsAsync();
        Task<RouteEntity?> GetTrailByIdAsync(int id);
    }
}