using evoHike.Backend.Data;
using evoHike.Backend.Models;
using evoHike.Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace evoHike.UnitTests;

    [TestFixture]
    public class TrailServiceTest
    {
        private EvoHikeContext _context;
        private TrailService _service;
        
        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<EvoHikeContext>()
                .UseInMemoryDatabase(
                    databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _context = new EvoHikeContext(options);
            _service = new TrailService(_context);
        }
        
        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task GetAllTrailsAsync_ReturnsAllTrails()
        {
            var fakeTrails = new List<Trail>
            {
                new Trail
                {
                    Id = 1,
                    Name = "Test Trail 1",
                    Location = "Test Loc 1",
                    Length = 5.0,
                    Difficulty = DifficultyLevel.Easy,
                    Elevation = 100
                },
                new Trail
                {
                    Id = 2,
                    Name = "Test Trail 2",
                    Location = "Test Loc 2",
                    Length = 10.0,
                    Difficulty = DifficultyLevel.Hard,
                    Elevation = 500
                }
            };
            
            await _context.Trails.AddRangeAsync(fakeTrails);
            await _context.SaveChangesAsync();
            
            var result = (await _service.GetAllTrailsAsync()).ToList();
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(2));
        }
        
        [Test]
        public void GetAllTrailsAsync_ThrowsException_WhenNoTrailsFound()
        {
            var ex = Assert.ThrowsAsync<Exception>(async () => await _service.GetAllTrailsAsync());
            Assert.That(ex.Message, Is.EqualTo("Nem találok semmilyen útvonalat"));
        }
    }