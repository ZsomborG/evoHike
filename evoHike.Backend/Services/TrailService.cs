using evoHike.Backend.Data;
using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Services
{
    public class TrailService(EvoHikeContext _context) : ITrailService
    {
        public async Task<IReadOnlyList<HikingTrail>> GetAllTrailsAsync()
        {
            var trails = await _context.HikingTrails
                .AsNoTracking()
                .ToListAsync();

            return trails.Count == 0
                ? []
                : trails;
        }

        public async Task<HikingTrail?> GetTrailByIdAsync(int id)
        {
            return await _context.HikingTrails
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.TrailID == id);
        }

        public async Task<IEnumerable<PointOfInterest>> GetPoisNearTrailAsync(int trailId, double distanceMeters)
        {
            var trail = await _context.HikingTrails.FindAsync(trailId);
            if (trail == null || trail.RouteLine == null)
            {
                return [];
            }

            return await _context.PointsOfInterest
                .Where(poi => poi.Location.IsWithinDistance(trail.RouteLine, distanceMeters))
                .AsNoTracking()
                .ToListAsync();
        }
    }
}