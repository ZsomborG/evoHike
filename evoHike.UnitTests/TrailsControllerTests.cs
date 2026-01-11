using evoHike.Backend.Controllers;
using evoHike.Backend.Models;
using evoHike.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace evoHike.UnitTests;

    [TestFixture]
    public class TrailsControllerTests
    {
        private Mock<ITrailService> _mocktrailService;
        private TrailsController _controller;

        [SetUp]
        public void Setup()
        {
            _mocktrailService = new Mock<ITrailService>();
            _controller = new TrailsController(_mocktrailService.Object);
        }

        [Test]
        public async Task GetTrails_ReturnsOkResult_WithListOfTrails()
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
            
            _mocktrailService.Setup(
                    service => service.GetAllTrailsAsync())
                    .ReturnsAsync(fakeTrails);
            
            var result = await _controller.GetTrails();

            var actionResult = result.Result as OkObjectResult;
            Assert.That(actionResult, Is.Not.Null);
            Assert.That(actionResult.StatusCode, Is.EqualTo(200));
            
            var returnedTrails = (actionResult.Value as IEnumerable<Trail>)?.ToList();
            Assert.That(returnedTrails, Is.Not.Null);
            Assert.That(returnedTrails, Has.Count.EqualTo(2));
        }

        [Test]
        public async Task GetTrails_ReturnBadRequest_WhenServiceThrowsException()
        {
            _mocktrailService.Setup(
                    service => service.GetAllTrailsAsync())
                    .ThrowsAsync(new Exception("Database error"));
            
            var result = await _controller.GetTrails();
            
            var actionResult = result.Result as BadRequestObjectResult;
            Assert.That(actionResult, Is.Not.Null);
            Assert.That(actionResult.StatusCode, Is.EqualTo(400));
            Assert.That(actionResult.Value, Is.EqualTo("Database error"));
        }
        
    }