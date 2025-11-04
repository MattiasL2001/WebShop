using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Security.Cryptography;
using WebShop_Backend.Application.Services;
using WebShop_Backend.Authentication.Basic;
using WebShop_Backend.Authentication.JwtBearer;
using WebShop_Backend.Helpers;
using WebShop_Backend.Infrastructure;
using WebShop_Backend.Infrastructure.Repositorys;
using WebShop_Backend.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<WebShopContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(BasicAuthenticationDefaults.AuthenticationScheme,
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = BasicAuthenticationDefaults.AuthenticationScheme,
            In = ParameterLocation.Header,
            Description = "Basic Authorization header.\n\nEnter the client ID as the Email, and the client secret as the password"
        });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
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
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = JwtBearerDefaults.AuthenticationScheme,
            In = ParameterLocation.Header,
            BearerFormat = "JWT",
            Description = "JWT Authorization header"
        });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
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
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IPasswordHasherService, PasswordHasherService>();
builder.Services.AddScoped<IAuthenticationRepository, AuthenticationRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

builder.Services.AddAutoMapper(typeof(MappingProfiler));

builder.Services.AddAuthentication(options =>
{
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>(BasicAuthenticationDefaults.AuthenticationScheme, null)
.AddScheme<JwtBearerOptions, JwtBearerHandler>(JwtBearerDefaults.AuthenticationScheme, options =>
{
    var jwtBearerSettings = builder.Configuration.GetSection("JwtBearer").Get<JwtBearerSettings>()
        ?? throw new NullReferenceException();

    var rsa = RSA.Create();
    rsa.ImportFromPem(jwtBearerSettings.PublicKey.ToCharArray());

    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = jwtBearerSettings.Issuer,
        ValidAudience = jwtBearerSettings.Audience,
        IssuerSigningKey = new RsaSecurityKey(rsa),
        ClockSkew = TimeSpan.Zero,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        NameClaimType = "name",
        RoleClaimType = "role"
    };

    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = context =>
        {
            var emailClaim = context.Principal?.FindFirst("email");
            if (emailClaim != null)
            {
                var identity = context.Principal!.Identity as ClaimsIdentity;
                if (!identity!.HasClaim(c => c.Type == ClaimTypes.Email))
                    identity.AddClaim(new Claim(ClaimTypes.Email, emailClaim.Value));
            }
            return Task.CompletedTask;
        }
    };
});


builder.Services.AddOptions<JwtBearerSettings>()
    .Bind(builder.Configuration.GetSection("JwtBearer"))
    .ValidateDataAnnotations();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html");

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
        FakeData.InitializeData(60);
    }
}
catch (Exception ex)
{
    logger.LogError(ex, "Migration error...");
}

app.Run();
