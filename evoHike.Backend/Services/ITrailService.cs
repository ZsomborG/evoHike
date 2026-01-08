using evoHike.Backend.Models;

namespace evoHike.Backend.Services
{
    public interface ITrailService
    {
        Task<IEnumerable<Trail>> GetAllTrailsAsync();
        Task<Trail?> GetTrailByIdAsync(Guid id);
    }
}