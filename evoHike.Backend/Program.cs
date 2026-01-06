using evoHike.Backend;
using evoHike.Backend.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddApplicationCors(builder.Configuration);
builder.Services.AddApplicationSwagger();
builder.Services.AddApplicationDatabase(builder.Configuration);

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
