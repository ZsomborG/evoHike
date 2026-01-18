using evoHike.Backend;
using evoHike.Backend.Data;
using evoHike.Backend.Services;
using OpenMeteo;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<WeatherService>();
builder.Services.AddApplicationCors(builder.Configuration);
builder.Services.AddApplicationSwagger();
builder.Services.AddApplicationDatabase(builder.Configuration);
builder.Services.AddScoped<ITrailService, TrailService>();
builder.Services.AddScoped<IPlannedHikeService, PlannedHikeService>();
builder.Services.AddScoped<OpenMeteoClient>();

var app = builder.Build();

app.RegisterMiddlewares();

app.InitializeDatabase();

app.MapControllers();

app.MapGet("/trails", (EvoHikeContext db) =>
db.Trails.ToList()
)
.WithName("GetTrails")
.WithOpenApi();

app.Run();
