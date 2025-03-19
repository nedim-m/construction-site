using backend.Data;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

//  Uèitaj tajni kljuè za JWT (baci grešku ako ne postoji)
var jwtKey = Environment.GetEnvironmentVariable("JWT__Key")
    ?? throw new Exception("JWT key is missing in environment variables!");

//  Dodaj servise u kontejner
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

//  Swagger konfiguracija (JWT autentifikacija)
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Standard Authorization header using the Bearer scheme (\"bearer {token}\")",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

//  JWT autentifikacija
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = false,
            ValidateAudience = false,
        };
    });

//  Onemoguæi preusmjeravanje na login (za REST API)
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = PathString.Empty;  // Onemoguæava preusmjeravanje na login
    options.AccessDeniedPath = PathString.Empty;
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});



builder.Services.AddCors(options =>
{
    options.AddPolicy("NgOrigins", policy =>
    {
        policy.WithOrigins("http://jaric.runasp.net", "https://jaric.runasp.net")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAll",
//        builder => builder.AllowAnyOrigin()
//                          .AllowAnyMethod()
//                          .AllowAnyHeader());
//});




//  Registracija servisa
builder.Services.AddTransient<IProjectServices, ProjectServices>();
builder.Services.AddTransient<IImageServices, ImageServices>();
builder.Services.AddTransient<IContactMessageServices, ContactMessageServices>();
builder.Services.AddTransient<IImageProcessingServices, ImageProcessingServices>();
builder.Services.AddTransient<IAuthServices, AuthServices>();
builder.Services.AddHttpClient();

//  Registracija baze podataka
/*builder.Services.AddDbContext<DataContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));*/

builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


//  Identity konfiguracija (BEZ cookie autentifikacije!)
builder.Services.AddIdentityCore<ApplicationUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<DataContext>()
    .AddDefaultTokenProviders();


builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<UserManager<ApplicationUser>>();
builder.Services.AddScoped<SignInManager<ApplicationUser>>();

var app = builder.Build();

//  Middleware pipeline
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}


app.UseHttpsRedirection();
app.UseCors("NgOrigins");
//app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
