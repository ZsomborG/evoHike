using evoHike.Backend;
using evoHike.Backend.Services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new NetTopologySuite.IO.Converters.GeoJsonConverterFactory());
    });
builder.Services.AddHttpClient<WeatherService>();
builder.Services.AddApplicationCors(builder.Configuration);
builder.Services.AddApplicationSwagger();
builder.Services.AddApplicationDatabase(builder.Configuration);
builder.Services.AddScoped<ITrailService, TrailService>();
builder.Services.AddScoped<IPlannedHikeService, PlannedHikeService>();
builder.Services.AddScoped<DataImportService>();

var app = builder.Build();

app.RegisterMiddlewares();

app.InitializeDatabase();

app.MapControllers();

app.Run();
