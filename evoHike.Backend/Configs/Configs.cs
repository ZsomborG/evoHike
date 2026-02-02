using evoHike.Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

namespace evoHike.Backend;

public static class Configs
{
    public const string CorsPolicyName = "_myAllowSpecificOrigins";

    public static void AddApplicationCors(this IServiceCollection services, IConfiguration configuration)
    {
        var allowedOrigins = configuration.GetValue<string>("AllowedOrigins");

        services.AddCors(options =>
        {
            options.AddPolicy(name: CorsPolicyName,
                policy =>
                {
                    if (allowedOrigins == "*")
                    {
                        policy.AllowAnyOrigin()
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    }
                    else
                    {
                        policy.WithOrigins(allowedOrigins)
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    }
                });
        });
    }

    public static void AddApplicationSwagger(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            var xmlFilename = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
            options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
        });
    }

    public static void AddApplicationDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var useInMemory = configuration.GetValue<bool>("UseInMemoryDatabase");

        if (useInMemory)
        {
            services.AddDbContext<EvoHikeContext>(options =>
                options.UseInMemoryDatabase("TestDatabase"));
        }
        else
        {
            services.AddDbContext<EvoHikeContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                    x => x.UseNetTopologySuite()));
        }
    }
    public static void RegisterMiddlewares(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseCors(CorsPolicyName);

        app.MapControllers();
    }
    public static void InitializeDatabase(this WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            var context = services.GetRequiredService<EvoHikeContext>();

            DbInitializer.Initialize(context);
        }
    }
}