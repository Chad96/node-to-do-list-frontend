const API_URL = 'http://localhost:5000/api/todos';
const backendURL = 'https://node-to-do-list-l01e.onrender.com';

// Fetch Todos
async function fetchTodos() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('You must be logged in to view todos.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`${API_URL}?userId=${userId}`);
    const todos = await response.json();
    renderTodos(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
}

// Render Todos
function renderTodos(todos) {
  console.log('Rendering Todos:', todos); // Log to check if data is updated

  const todoTasks = document.getElementById('todoTasks');
  const inProgressTasks = document.getElementById('inProgressTasks');
  const doneTasks = document.getElementById('doneTasks');

  todoTasks.innerHTML = '';
  inProgressTasks.innerHTML = '';
  doneTasks.innerHTML = '';

  todos.forEach(todo => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.innerHTML = `
      <p>${todo.task} - ${todo.priority} - ${todo.status}</p>
      <button onclick="editTodo('${todo._id}', '${todo.task}', '${todo.priority}')">📝 Edit</button>
      <button onclick="deleteTodo('${todo._id}')">❌ Delete</button>
      <button onclick="moveTodo('${todo._id}', '${todo.status}')">🔄 Move</button>
    `;

    if (todo.status === 'todo') todoTasks.appendChild(taskElement);
    else if (todo.status === 'in-progress') inProgressTasks.appendChild(taskElement);
    else if (todo.status === 'done') doneTasks.appendChild(taskElement);
  });
}

// Add Todo
window.addTodo = async (task, status, priority) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('You must be logged in to add todos.');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, status, priority, userId }),
    });
    const newTodo = await response.json();
    fetchTodos();
  } catch (error) {
    console.error('Error adding todo:', error);
  }
};

// Edit Todo
window.editTodo = async (id, currentTask, currentPriority) => {
  const newTask = prompt('Edit Task:', currentTask);
  const newPriority = prompt('Edit Priority (high, medium, low):', currentPriority);

  if (newTask && newPriority) {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask, priority: newPriority }),
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }
};

// Delete Todo
window.deleteTodo = async (id) => {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }
};

// Move Todo
window.moveTodo = async (id, currentStatus) => {
  const newStatus = currentStatus === 'todo' ? 'in-progress' :
                    currentStatus === 'in-progress' ? 'done' : 'todo';

  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchTodos();
  } catch (error) {
    console.error('Error moving todo:', error);
  }
};

// Initialize
window.addEventListener('load', fetchTodos);