using evoHike.Backend;
using evoHike.Backend.Data;
using evoHike.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHttpClient<WeatherService>();
builder.Services.AddApplicationCors(builder.Configuration);
builder.Services.AddApplicationSwagger();
builder.Services.AddApplicationDatabase(builder.Configuration);
builder.Services.AddScoped<ITrailService, TrailService>();
builder.Services.AddScoped<IPlannedHikeService, PlannedHikeService>();

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
