using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentTaskManagement.Data;
using StudentTaskManagement.Models;

namespace StudentTaskManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Route: api/task
    public class TaskController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        // Inject database context
        public TaskController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET: api/task
        // Returns all tasks (used by admin)
        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            return Ok(await _db.Tasks.ToListAsync());
        }

        // GET: api/task/{username}
        // Returns tasks assigned to a specific student
        [HttpGet("{username}")]
        public async Task<IActionResult> GetStudentTasks(string username)
        {
            var tasks = await _db.Tasks
                .Where(t => t.AssignedTo == username)
                .ToListAsync();

            return Ok(tasks);
        }

        // POST: api/task
        // Adds a new task
        [HttpPost]
        public async Task<IActionResult> AddTask([FromBody] TaskItem task)
        {
            _db.Tasks.Add(task); // Insert into database
            await _db.SaveChangesAsync(); // Save changes
            return Ok(task);
        }

        // PUT: api/task/{id}
        // Updates an existing task
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem updated)
        {
            var task = await _db.Tasks.FindAsync(id);

            // If task not found
            if (task == null) return NotFound();

            // Update fields
            task.Title = updated.Title;
            task.AssignedTo = updated.AssignedTo;
            task.Deadline = updated.Deadline;
            task.IsCompleted = updated.IsCompleted;

            await _db.SaveChangesAsync();
            return Ok(task);
        }

        // DELETE: api/task/{id}
        // Deletes a task
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _db.Tasks.FindAsync(id);

            // If task not found
            if (task == null) return NotFound();

            _db.Tasks.Remove(task); // Remove from database
            await _db.SaveChangesAsync();

            return Ok();
        }
    }
}