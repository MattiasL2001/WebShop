using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WebShop_Backend.Helpers;
using WebShop_Backend.Services;
using WebShop_Backend.Infrastructure;
using WebShop_Backend.Infrastructure.Repositorys;
using Microsoft.AspNetCore.Authentication;
using WebShop_Backend.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using WebShop_Backend.Authentication.Basic;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Add services to the container.
builder.Services.AddDbContext<WebShopContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(BasicAuthenticationDefaults.AuthenticationScheme,
        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
            Scheme = BasicAuthenticationDefaults.AuthenticationScheme,
            In = Microsoft.OpenApi.Models.ParameterLocation.Header,
            Description = "Basic Authorization header.\n\nEnter the client ID as the Email, and the client secret as the password"
        });
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme {

                    Reference = new OpenApiReference {
                        Type = ReferenceType.SecurityScheme,
                        Id = BasicAuthenticationDefaults.AuthenticationScheme
                    }
                },
                new string[] { "Basic " }
            }
        });
    options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme,
        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
            Scheme = JwtBearerDefaults.AuthenticationScheme,
            In = Microsoft.OpenApi.Models.ParameterLocation.Header,
            BearerFormat = "JWT",
            Description = "JWT Authorization header"
        });
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme {

                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                    Id = JwtBearerDefaults.AuthenticationScheme
                }
            },
            new string[] { "Bearer " }
        }
    });
});

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
builder.Services.AddScoped<IAuthenticationRepository, AuthenticationRepository>();

builder.Services.AddAutoMapper(typeof(MappingProfiler));

builder.Services.AddAuthentication(options =>
{
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
})
  .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>(BasicAuthenticationDefaults.AuthenticationScheme, null)
  .AddScheme<JwtBearerOptions, JwtBearerHandler>(JwtBearerDefaults.AuthenticationScheme, options =>
{
    var jwtBearerSettings = builder.Configuration.GetSection("JwtBearer").Get<JwtBearerSettings>();

    if (jwtBearerSettings == null)
    {
        throw new NullReferenceException();
    }

    options.SaveToken = true;
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
    {
        ValidIssuer = jwtBearerSettings.Issuer,
        ValidAudience = jwtBearerSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtBearerSettings.SigningKey)),
        ClockSkew = TimeSpan.Zero,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
    };
});

builder.Services.AddOptions<JwtBearerSettings>()
    .Bind(builder.Configuration.GetSection("JwtBearer"))
    .ValidateDataAnnotations();

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
        FakeData.InitializeData(10);
    }
}
catch (Exception ex)
{
    logger.LogError(ex, "Migration error...");
}

app.Run();
