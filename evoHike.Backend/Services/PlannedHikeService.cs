using evoHike.Backend.Data;
using evoHike.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace evoHike.Backend.Services
{
    public class PlannedHikeService : IPlannedHikeService
    {
        private readonly EvoHikeContext _context;
        public PlannedHikeService(EvoHikeContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PlannedHikeEntity>> GetAllPlannedHikesAsync()
        {
            return await _context.PlannedHikes
                .Include(ph => ph.HikingTrail)
                .OrderBy(ph => ph.PlannedStartDateTime)
                .ToListAsync();
        }

        public async Task<PlannedHikeEntity> CreatePlannedHikeAsync(PlannedHikeEntity plannedHike)
        {
            plannedHike.Status = HikeStatus.Planned;

            _context.PlannedHikes.Add(plannedHike);
            await _context.SaveChangesAsync();

            return plannedHike;
        }

        public async Task<bool> MarkHikeAsCompletedAsync(int id)
        {
            var hike = await _context.PlannedHikes.FindAsync(id);

            if (hike == null)
            {
                return false;
            }

            hike.Status = HikeStatus.Completed;
            hike.CompletedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}