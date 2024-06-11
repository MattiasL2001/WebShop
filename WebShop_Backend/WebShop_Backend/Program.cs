using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WebShop_Backend.Helpers;
using WebShop_Backend.Services;
using WebShop_Backend.Infrastructure;
using WebShop_Backend.Infrastructure.Repositorys;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Add services to the container.
builder.Services.AddDbContext<WebShopContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        policy =>
        {
            policy.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
        });
});

builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();

builder.Services.AddAutoMapper(typeof(MappingProfiler));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("CorsPolicy");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

var logger = services.GetRequiredService<ILogger<Program>>();

logger.LogInformation("API starting...");

try
{
    var context = services.GetRequiredService<WebShopContext>();
    context.Database.Migrate();

    if (!context.Products.Any())
    {
        FakeData.InitializeData(30);
    }
}
catch (Exception ex)
{
    logger.LogError(ex, "Migration errror...");
}

app.Run();
