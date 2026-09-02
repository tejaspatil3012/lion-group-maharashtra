using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using LionGroup.API.Data;
using LionGroup.API.Interfaces;
using LionGroup.API.Middleware;
using LionGroup.API.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Database (SQL Server)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=localhost;Database=LionGroupMaharashtraDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null);
    }));

// 2. Register Application Services (Dependency Injection)
builder.Services.AddScoped<IFileStorageService, FileStorageService>();
builder.Services.AddScoped<IMemberService, MemberService>();
builder.Services.AddScoped<IActivityService, ActivityService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IGalleryService, GalleryService>();
builder.Services.AddScoped<IAboutService, AboutService>();
builder.Services.AddScoped<IHomeService, HomeService>();
builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<IMembershipApplicationService, MembershipApplicationService>();

// 3. Configure Controllers & JSON serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// 4. Configure Swagger / OpenAPI UI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "LION GROUP MAHARASHTRA RAJYA - API",
        Version = "v1",
        Description = "RESTful APIs for Lion Group Maharashtra Rajya Public Informational Website and Member Portal"
    });
});

// 5. Configure CORS for React SPA (Localhost, Vercel, Netlify, Render)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// 6. Global Exception Middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

// 7. Configure Swagger UI Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Lion Group API v1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "Lion Group API - Swagger UI";
    });
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

// Root route welcome & status message with Swagger link
app.MapGet("/", () => Results.Json(new
{
    status = "Online",
    application = "LION GROUP MAHARASHTRA RAJYA - REST API Backend",
    swaggerUi = "http://localhost:5128/swagger",
    frontendWebsite = "http://localhost:5173",
    endpoints = new[]
    {
        "/api/home",
        "/api/about",
        "/api/members",
        "/api/members/leadership",
        "/api/activities",
        "/api/events",
        "/api/gallery",
        "/api/contact"
    }
}));

// 8. Auto-migrate / Seed Database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        await DbInitializer.InitializeAsync(context);
        logger.LogInformation("Database initialized and seeded successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while initializing the database: {Message}", ex.Message);
    }
}

app.Run();
