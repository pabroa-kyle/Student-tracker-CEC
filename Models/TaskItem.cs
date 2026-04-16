namespace StudentTaskManagement.Models
{
    // Represents a Task record in the database
    public class TaskItem
    {
        public int Id { get; set; } // Primary key
        public string Title { get; set; } = string.Empty; // Task name
        public string AssignedTo { get; set; } = string.Empty; // Assigned student
        public DateTime Deadline { get; set; } // Due date
        public bool IsCompleted { get; set; } // Status (true = done)
    }
}