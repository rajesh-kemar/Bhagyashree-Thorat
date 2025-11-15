using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using TravelApi.Data;
using TravelApi.Models;
using TravelApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Use IgnoreCycles instead of Preserve so Angular gets normal arrays
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// Enable Swagger for API testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure EF Core (SQL Server)
builder.Services.AddDbContext<TravelContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS for Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularClient", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",    // Default Angular dev port
                "http://localhost:58185"    // Your current Angular app port
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Register your app services
builder.Services.AddScoped<ITripService, TripService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IDriverService, DriverService>();

var app = builder.Build();

// Enable Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS BEFORE routing and controllers
app.UseCors("AllowAngularClient");

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

// Run the app
app.Run();
