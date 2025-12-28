using evoHike.Backend.Data;
using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Services
{
    public class TrailService(EvoHikeContext _context) : ITrailService
    {
        public async Task<IEnumerable<Trail>> GetAllTrailsAsync()
        {
            var trails = await _context.Trails.ToListAsync();
            if (trails == null || trails.Count == 0)
            {
                throw new Exception("Nem találok semmilyen útvonalat");
            }

            return trails;
        }
    }
}