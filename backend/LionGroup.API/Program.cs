using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using LionGroup.API.Data;
using LionGroup.API.Interfaces;
using LionGroup.API.Middleware;
using LionGroup.API.Services;

// Enable legacy timestamp behavior so Npgsql accepts DateTime without explicit UTC kind
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Database (PostgreSQL/Supabase, SQL Server for local dev, SQLite fallback)
var defaultConn = builder.Configuration.GetConnectionString("DefaultConnection");
var dbProvider = builder.Configuration["DATABASE_PROVIDER"];

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    // Check if configured for PostgreSQL (Supabase, Neon, etc.)
    if (string.Equals(dbProvider, "PostgreSql", StringComparison.OrdinalIgnoreCase) ||
        string.Equals(dbProvider, "Supabase", StringComparison.OrdinalIgnoreCase) ||
        (!string.IsNullOrWhiteSpace(defaultConn) && (defaultConn.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase) ||
                                                     defaultConn.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) ||
                                                     defaultConn.Contains("supabase", StringComparison.OrdinalIgnoreCase) ||
                                                     (defaultConn.Contains("Host=", StringComparison.OrdinalIgnoreCase) && (defaultConn.Contains("5432") || defaultConn.Contains("6543"))))))
    {
        var connStr = FormatPostgreSqlConnectionString(defaultConn!);

        options.UseNpgsql(connStr, npgsqlOptions =>
        {
            npgsqlOptions.EnableRetryOnFailure(
                maxRetryCount: 3,
                maxRetryDelay: TimeSpan.FromSeconds(5),
                errorCodesToAdd: null);
        });
    }
    else if (string.Equals(dbProvider, "Sqlite", StringComparison.OrdinalIgnoreCase) ||
        (!string.IsNullOrWhiteSpace(defaultConn) && (defaultConn.Contains(".db", StringComparison.OrdinalIgnoreCase) || defaultConn.StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase))))
    {
        var sqliteConn = !string.IsNullOrWhiteSpace(defaultConn) && defaultConn.Contains(".db") ? defaultConn : "Data Source=liongroup.db";
        options.UseSqlite(sqliteConn);
    }
    else if (builder.Environment.IsDevelopment())
    {
        var localSqlServer = !string.IsNullOrWhiteSpace(defaultConn) ? defaultConn : "Server=localhost;Database=LionGroupMaharashtraDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true";
        options.UseSqlServer(localSqlServer, sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 3,
                maxRetryDelay: TimeSpan.FromSeconds(5),
                errorNumbersToAdd: null);
        });
    }
    else if (!string.IsNullOrWhiteSpace(defaultConn) && defaultConn.Contains("Server=", StringComparison.OrdinalIgnoreCase) && !defaultConn.Contains("localhost", StringComparison.OrdinalIgnoreCase))
    {
        // Real cloud SQL Server (Azure/AWS) provided in production
        options.UseSqlServer(defaultConn, sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 3,
                maxRetryDelay: TimeSpan.FromSeconds(5),
                errorNumbersToAdd: null);
        });
    }
    else
    {
        // Cloud Production Default (Render, Koyeb, Docker): SQLite
        options.UseSqlite("Data Source=liongroup.db");
    }
});

// 2. Register Application Services (Dependency Injection)
builder.Services.AddHttpClient(); // For Supabase Storage API calls
builder.Services.AddScoped<IFileStorageService, FileStorageService>();
builder.Services.AddScoped<IMemberService, MemberService>();
builder.Services.AddScoped<IActivityService, ActivityService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IGalleryService, GalleryService>();
builder.Services.AddScoped<IAboutService, AboutService>();
builder.Services.AddScoped<IHomeService, HomeService>();
builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<IMembershipApplicationService, MembershipApplicationService>();
builder.Services.AddScoped<IDonationService, DonationService>();

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
app.UseCors("AllowReactApp");
app.UseStaticFiles();
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
        "/api/contact",
        "/api/donations"
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

// Helper to safely parse PostgreSQL / Supabase connection strings (handles special characters like @ or # in passwords)
static string FormatPostgreSqlConnectionString(string raw)
{
    if (string.IsNullOrWhiteSpace(raw)) return raw;

    var conn = raw.Trim().Trim('"', '\'');

    // If already in ADO.NET Key-Value format (Host=...;Database=...;Username=...;Password=...)
    if (conn.Contains("Host=", StringComparison.OrdinalIgnoreCase) ||
        conn.Contains("Server=", StringComparison.OrdinalIgnoreCase))
    {
        if (!conn.Contains("SSL Mode=", StringComparison.OrdinalIgnoreCase) && !conn.Contains("sslmode=", StringComparison.OrdinalIgnoreCase))
        {
            conn = conn.TrimEnd(';') + ";SSL Mode=Require;Trust Server Certificate=true;";
        }
        return conn;
    }

    // If in postgresql:// or postgres:// URI format
    if (conn.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase) ||
        conn.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase))
    {
        try
        {
            // Match pattern: postgresql://[user]:[password]@[host]:[port]/[database]
            // Password group uses non-greedy match before the LAST '@' preceding host
            var match = System.Text.RegularExpressions.Regex.Match(
                conn,
                @"^postgres(?:ql)?:\/\/(?<user>[^:]+):(?<pass>.+)@(?<host>[^:\/@]+)(?::(?<port>\d+))?\/(?<db>[^?]+)"
            );

            if (match.Success)
            {
                var user = match.Groups["user"].Value;
                var pass = match.Groups["pass"].Value;
                var host = match.Groups["host"].Value;
                var port = match.Groups["port"].Success ? match.Groups["port"].Value : "5432";
                var db = match.Groups["db"].Value;

                try { pass = Uri.UnescapeDataString(pass); } catch { }

                return $"Host={host};Port={port};Database={db};Username={user};Password={pass};Pooling=true;SSL Mode=Require;Trust Server Certificate=true;";
            }
        }
        catch
        {
            // Fallback to raw string
        }
    }

    return conn;
}
