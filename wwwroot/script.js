// Base API URL (backend connection)
const API_URL = "http://localhost:5000/api";

// =====================
// LOGIN
// =====================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    // Handles login form submission
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent page reload

    // Get input values
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

        try {
            // Send POST request to API
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

            if (!res.ok) throw new Error();

            // Save logged-in user in browser
    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data));

            // Redirect based on role
    window.location.href =
        data.role === "admin"
            ? "admin-dashboard.html"
            : "student-dashboard.html";
        } catch {
            const errorMsg = document.getElementById("errorMsg");
            if (errorMsg) errorMsg.textContent = "Invalid username or password";
        }
    });
}

// =====================
// GET USER
// =====================
function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

// =====================
// LOGOUT
// =====================
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) logoutBtn.addEventListener("click", logout);

// =====================
// HELPER: CHECK OVERDUE
// =====================
function isOverdue(deadline) {
    const today = new Date();
    const dueDate = new Date(deadline);
    return dueDate < today;
}

// =====================
// ADMIN DASHBOARD
// =====================
const taskTable = document.querySelector("#taskTable tbody");
const taskForm = document.getElementById("taskForm");
const assignedToSelect = document.getElementById("assignedTo");

const students = ["student1", "student2"];

if (assignedToSelect) {
    assignedToSelect.innerHTML = `<option value="">Select Student</option>`;
    students.forEach(s => {
        const option = document.createElement("option");
        option.value = s;
        option.textContent = s;
        assignedToSelect.appendChild(option);
    });
}

if (taskTable) loadAllTasks();

// Fetch all tasks from API and Display tasks in table
async function loadAllTasks() {
    try {
        const res = await fetch(`${API_URL}/task`);
        if (!res.ok) throw new Error();

        const tasks = await res.json();
        taskTable.innerHTML = "";

        tasks.forEach(task => {
            const overdue = isOverdue(task.deadline);

            const statusText = task.isCompleted
                ? "✅ Done"
                : overdue
                    ? "⚠️ Overdue"
                    : "❌ Pending";

            const row = `
                <tr>
                    <td>${task.assignedTo}</td>
                    <td>${task.title}</td>
                    <td>${new Date(task.deadline).toLocaleDateString()}</td>
                    <td>${statusText}</td>
                    <td>
                        <button onclick='editTask(${JSON.stringify(task)})'>Edit</button>
                        <button onclick="deleteTask(${task.id})">Delete</button>
                    </td>
                </tr>
            `;
            taskTable.innerHTML += row;
        });

    } catch (err) {
        console.error("Error loading tasks:", err);
        taskTable.innerHTML = `<tr><td colspan="5">Failed to load tasks</td></tr>`;
    }
}

// =====================
// ADD / UPDATE TASK
// =====================

// If ID exists → UPDATE
// If no ID → ADD new task
if (taskForm) {
    taskForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("taskId").value;
        const title = document.getElementById("title").value.trim();
        const assignedTo = document.getElementById("assignedTo").value;
        const deadline = document.getElementById("deadline").value;

        if (!title || !assignedTo || !deadline) return;

        const taskData = {
            title,
            assignedTo,
            deadline,
            isCompleted: false
        };

        try {
            if (id) {
                await fetch(`${API_URL}/task/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, ...taskData })
                });
            } else {
                await fetch(`${API_URL}/task`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(taskData)
                });
            }

            taskForm.reset();
            document.getElementById("taskId").value = "";
            loadAllTasks();

        } catch (err) {
            console.error("Error saving task:", err);
        }
    });
}

// =====================
// EDIT TASK
// =====================
function editTask(task) {
    document.getElementById("taskId").value = task.id;
    document.getElementById("title").value = task.title;
    document.getElementById("assignedTo").value = task.assignedTo;
    document.getElementById("deadline").value = task.deadline.split("T")[0];
}

// =====================
// DELETE TASK
// =====================
async function deleteTask(id) {
    try {
        const res = await fetch(`${API_URL}/task/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Delete failed:", text);
        }

        loadAllTasks();

    } catch (err) {
        console.error("Error deleting task:", err);
    }
}

// =====================
// STUDENT DASHBOARD
// =====================
const studentTable = document.querySelector("#studentTaskTable tbody");

if (studentTable) loadStudentTasks();

async function loadStudentTasks() {
    const user = getUser();
    if (!user) return;

    try {
        const res = await fetch(`${API_URL}/task/${user.username}`);
        if (!res.ok) throw new Error();

        const tasks = await res.json();
        studentTable.innerHTML = "";

        tasks.forEach(task => {
            const overdue = isOverdue(task.deadline);

            const statusText = task.isCompleted
                ? "✅ Done"
                : overdue
                    ? "⚠️ Overdue"
                    : "❌ Pending";

            const row = `
                <tr>
                    <td>${task.title}</td>
                    <td>${new Date(task.deadline).toLocaleDateString()}</td>
                    <td>${statusText}</td>
                    <td>
                        ${
                            !task.isCompleted
                                ? `<button onclick="markComplete(${task.id}, '${task.title}', '${task.assignedTo}', '${task.deadline}')">Complete</button>`
                                : ""
                        }
                    </td>
                </tr>
            `;
            studentTable.innerHTML += row;
        });

    } catch (err) {
        console.error("Error loading student tasks:", err);
        studentTable.innerHTML = `<tr><td colspan="4">Failed to load tasks</td></tr>`;
    }
}

// =====================
// MARK COMPLETE
// =====================
async function markComplete(id, title, assignedTo, deadline) {
    try {
        await fetch(`${API_URL}/task/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id,
                title,
                assignedTo,
                deadline,
                isCompleted: true
            })
        });

        loadStudentTasks();

    } catch (err) {
        console.error("Error updating task:", err);
    }
}