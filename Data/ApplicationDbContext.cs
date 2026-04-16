using Microsoft.EntityFrameworkCore;
using StudentTaskManagement.Models;

namespace StudentTaskManagement.Data
{
    // Handles database connection and tables
    public class ApplicationDbContext : DbContext
    {
        // Constructor receives configuration
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        // Represents "Tasks" table in database
        public DbSet<TaskItem> Tasks { get; set; }
    }
}