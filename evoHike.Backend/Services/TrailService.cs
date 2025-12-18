using evoHike.Backend.Data;
using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Services
{
    public class TrailService(EvoHikeContext context) : ITrailService
    {
        public async Task<IEnumerable<Trail>> GetAllTrailsAsync()
        {
            return await context.Trails.ToListAsync();
        }
    }
}