using Microsoft.AspNetCore.Mvc;

namespace StudentTaskManagement.Controllers
{
    // Model used to receive login data from the frontend (username & password)
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    [ApiController] // Marks this as an API controller
    [Route("api/[controller]")] // Route: api/auth
    public class AuthController : ControllerBase
    {
        // Temporary hardcoded users (no database yet)
        private readonly List<User> users = new List<User>
        {
            new User { Username = "admin", Password = "admin123", Role = "admin" },
            new User { Username = "student1", Password = "123", Role = "student" },
            new User { Username = "student2", Password = "123", Role = "student" }
        };

        // POST: api/auth/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginData)
        {
            // Check if user exists and credentials match
            var user = users.FirstOrDefault(u =>
                u.Username == loginData.Username &&
                u.Password == loginData.Password);

            // If no match, return Unauthorized (401)
            if (user == null)
                return Unauthorized(new { message = "Invalid username or password" });

            // If valid, return user info (no password for security)
            return Ok(new
            {
                username = user.Username,
                role = user.Role
            });
        }

        // Internal model for users (used only in this controller)
        private class User
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public string Role { get; set; } = string.Empty;
        }
    }
}