using evoHike.Backend.Data;
using evoHike.Backend.Models;
using evoHike.Backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace evoHike.Backend.Services
{
    public class PlannedHikeService : IPlannedHikeService
    {
        private readonly EvoHikeContext _context;
        public PlannedHikeService(EvoHikeContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PlannedHikeEntity>> GetAllPlannedHikesAsync(HikeStatus? filterStatus = null)
        {
            var query = _context.PlannedHikes
                .Include(ph => ph.Route)
                .AsQueryable();

            if (filterStatus.HasValue)
            {
                query = query.Where(ph => ph.Status == filterStatus.Value);
            }

            return await query
                .OrderBy(ph => ph.PlannedStartDateTime)
                .ToListAsync();
        }

        public async Task<PlannedHikeEntity> CreatePlannedHikeAsync(PlanHikeRequest request)
        {
            var routeExists = await _context.Trails.AnyAsync(r => r.Id == request.RouteId);
            if (!routeExists)
            {
                throw new ArgumentException("A megadott RouteId nem létezik.");
            }
            if (request.Start < DateTime.UtcNow.AddMinutes(-5))
                throw new ArgumentException("A túra kezdete nem lehet a múltban.");

            if (request.End <= request.Start)
                throw new ArgumentException("A túra vége később kell legyen, mint a kezdete.");

            string? checklistJson = null;
            if (request.ChecklistItems != null && request.ChecklistItems.Any())
            {
                checklistJson = JsonSerializer.Serialize(request.ChecklistItems);
            }

            var newPlan = new PlannedHikeEntity
            {
                RouteId = request.RouteId,
                PlannedStartDateTime = request.Start,
                PlannedEndDateTime = request.End,
                Status = HikeStatus.Planned,
                ChecklistJson = checklistJson,
                CreatedAt = DateTime.UtcNow
            };

            _context.PlannedHikes.Add(newPlan);
            await _context.SaveChangesAsync();

            return newPlan;
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