using Microsoft.EntityFrameworkCore;
using StudentTaskManagement.Data;

var builder = WebApplication.CreateBuilder(args);

// Register controllers (API endpoints)
builder.Services.AddControllers();

// Enable CORS (for frontend connection)
builder.Services.AddCors();

// Configure SQLite database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=tasks.db"));

var app = builder.Build();

// Allow all frontend requests (for development)
app.UseCors(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader());

app.UseAuthorization();

// Map API routes
app.MapControllers();

// Force app to run on this port
app.Urls.Add("http://localhost:5000");

app.Run();