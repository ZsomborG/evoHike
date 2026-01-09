using evoHike.Backend.Data;
using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Services
{
    public class TrailService(EvoHikeContext _context) : ITrailService
    {
        public async Task<IEnumerable<Trail>> GetAllTrailsAsync()
        {
            var trails = await _context.Trails
                .AsNoTracking()
                .ToListAsync();

            if (trails == null || trails.Count == 0)
            {
                throw new Exception("Can't find route");
            }

            return trails;
        }

        public async Task<Trail?> GetTrailByIdAsync(Guid id)
        {
            return await _context.Trails
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }
    }
}