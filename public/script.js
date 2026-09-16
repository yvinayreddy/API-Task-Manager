const API_BASE = '/api';
const tokenKey = 'taskManagerToken';

const authView = document.getElementById('authView');
const appView = document.getElementById('appView');
const authMessage = document.getElementById('authMessage');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const logoutBtn = document.getElementById('logoutBtn');
const tabButtons = document.querySelectorAll('.tab-btn');

function setAuthMessage(message, isSuccess = false) {
  authMessage.textContent = message || '';
  authMessage.classList.toggle('success', isSuccess);
}

function showAuthView() {
  authView.classList.remove('hidden');
  appView.classList.add('hidden');
}

function showAppView() {
  authView.classList.add('hidden');
  appView.classList.remove('hidden');
}

function getToken() {
  return localStorage.getItem(tokenKey);
}

function setToken(token) {
  if (token) {
    localStorage.setItem(tokenKey, token);
  } else {
    localStorage.removeItem(tokenKey);
  }
}

function switchTab(tabName) {
  tabButtons.forEach((button) => {
    const active = button.dataset.tab === tabName;
    button.classList.toggle('active', active);
  });

  const login = document.getElementById('loginForm');
  const register = document.getElementById('registerForm');

  login.classList.toggle('active', tabName === 'login');
  register.classList.toggle('active', tabName === 'register');
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

async function registerUser(event) {
  event.preventDefault();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;

  try {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setToken(data.token);
    setAuthMessage('Registration successful. You are now logged in.', true);
    loadTasks();
  } catch (error) {
    setAuthMessage(error.message);
  }
}

async function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setToken(data.token);
    setAuthMessage('Login successful.', true);
    loadTasks();
  } catch (error) {
    setAuthMessage(error.message);
  }
}

async function loadTasks() {
  const token = getToken();
  if (!token) {
    showAuthView();
    return;
  }

  try {
    const tasks = await apiRequest('/tasks');
    renderTasks(tasks);
    showAppView();
  } catch (error) {
    setToken(null);
    showAuthView();
    setAuthMessage(error.message);
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';

  if (!tasks.length) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'empty-state';
    emptyItem.textContent = 'No tasks yet. Add one above.';
    taskList.appendChild(emptyItem);
    return;
  }

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = 'task-item';

    const left = document.createElement('div');
    left.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = Boolean(task.completed);
    checkbox.addEventListener('change', () => toggleTask(task._id, checkbox.checked));

    const title = document.createElement('span');
    title.className = `task-title ${task.completed ? 'completed' : ''}`;
    title.textContent = task.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.type = 'button';
    deleteBtn.addEventListener('click', () => deleteTask(task._id));

    left.appendChild(checkbox);
    left.appendChild(title);

    item.appendChild(left);
    item.appendChild(deleteBtn);
    taskList.appendChild(item);
  });
}

async function addTask(event) {
  event.preventDefault();

  const title = taskInput.value.trim();
  if (!title) return;

  try {
    await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });

    taskInput.value = '';
    loadTasks();
  } catch (error) {
    alert(error.message);
  }
}

async function toggleTask(id, completed) {
  try {
    await apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ completed }),
    });
    loadTasks();
  } catch (error) {
    alert(error.message);
  }
}

async function deleteTask(id) {
  try {
    await apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    });
    loadTasks();
  } catch (error) {
    alert(error.message);
  }
}

function logout() {
  setToken(null);
  taskList.innerHTML = '';
  showAuthView();
  setAuthMessage('You have been logged out.');
}

tabButtons.forEach((button) => {
  button.addEventListener('click', () => switchTab(button.dataset.tab));
});

loginForm.addEventListener('submit', loginUser);
registerForm.addEventListener('submit', registerUser);
taskForm.addEventListener('submit', addTask);
logoutBtn.addEventListener('click', logout);

if (getToken()) {
  loadTasks();
} else {
  showAuthView();
  setAuthMessage('');
}
