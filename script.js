const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const searchInput = document.getElementById('search-input');
const filterOptions = document.getElementById('filter-options');
const sortOptions = document.getElementById('sort-options');

// Handle form submission
todoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const newTask = todoInput.value.trim();

    if (newTask === '') {
        alert('Please enter a task!');
        return;
    }
    todoInput.value = '';
    addTask(newTask);
});

// Add a new task
function addTask(task, completed = false) {
    const listItem = document.createElement('li');
    const taskText = document.createElement('span');
    taskText.textContent = task;
    if (completed) {
        taskText.style.textDecoration = 'line-through';
    }
    listItem.appendChild(taskText);

    const checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    checkBox.checked = completed;
    listItem.appendChild(checkBox);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    listItem.appendChild(deleteButton);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    listItem.appendChild(editButton);

    todoList.appendChild(listItem);

    // Toggle completion status
    checkBox.addEventListener('change', function() {
        if (this.checked) {
            taskText.style.textDecoration = 'line-through';
            listItem.classList.add('completed');``
        } else {
            taskText.style.textDecoration = 'none';
            listItem.classList.remove('completed');
        }
        saveTasksToLocalStorage();
        filterTasks();  // Reapply filter and sort after status change
    });

    // Delete task
    deleteButton.addEventListener('click', function() {
        todoList.removeChild(listItem);
        saveTasksToLocalStorage();
    });

    // Edit task
    editButton.addEventListener('click', function() {
        const isEditing = listItem.classList.contains('editing');

        if (isEditing) {
            const input = listItem.querySelector('input[type="text"]');
            taskText.textContent = input.value;
            listItem.classList.remove('editing');
            editButton.textContent = 'Edit';
            listItem.removeChild(input);
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = taskText.textContent;
            listItem.insertBefore(input, taskText);
            listItem.removeChild(taskText);
            listItem.classList.add('editing');
            editButton.textContent = 'Save';
        }
        saveTasksToLocalStorage();
        filterTasks();  // Reapply filter and sort after editing
    });

    saveTasksToLocalStorage();
}

// Save tasks to local storage
function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#todo-list li').forEach(task => {
        const taskText = task.querySelector('span').textContent;
        const isCompleted = task.classList.contains('completed');
        tasks.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));// syntax of set item setItem(key, value);
}// json.stringify is used to make a string from a given object


// Load tasks from local storage
document.addEventListener('DOMContentLoaded', function() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];// use JSON.parse to convert a JSON string back into a JavaScript object. 
    savedTasks.forEach(task => {
        addTask(task.text, task.completed);
    });
    applyFiltersAndSorting(); // Apply filters and sorting on load
});

// Search functionality
searchInput.addEventListener('input', function() {
    filterTasks();
});

// Filter functionality
filterOptions.addEventListener('change', function() {
    filterTasks();
});

// Sort functionality
sortOptions.addEventListener('change', function() {
    applySorting();
});

// Filter and search tasks
function filterTasks() {
    const query = searchInput.value.toLowerCase();
    const filter = filterOptions.value;

    document.querySelectorAll('#todo-list li').forEach(task => {
        const taskText = task.querySelector('span').textContent.toLowerCase();
        const isCompleted = task.classList.contains('completed');

        const matchesSearch = taskText.includes(query);
        const matchesFilter = filter === 'all' || (filter === 'completed' && isCompleted) || (filter === 'pending' && !isCompleted);

        if (matchesSearch && matchesFilter) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });

    applySorting(); // Reapply sorting after filtering
}

// Apply sorting to tasks
function applySorting() {
    const sortOption = sortOptions.value;
    const tasks = Array.from(document.querySelectorAll('#todo-list li'));

    tasks.sort((a, b) => {
        const textA = a.querySelector('span').textContent.toLowerCase();
        const textB = b.querySelector('span').textContent.toLowerCase();
        const isCompletedA = a.classList.contains('completed');
        const isCompletedB = b.classList.contains('completed');

        if (sortOption === 'alphabetical') {
            return textA.localeCompare(textB);
        } else if (sortOption === 'completed') {
            return isCompletedA === isCompletedB ? 0 : isCompletedA ? 1 : -1;
        }
    });

    tasks.forEach(task => todoList.appendChild(task)); // Reorder tasks in the DOM
}

// Apply filters and sorting on load
function applyFiltersAndSorting() {
    filterTasks();
    applySorting();
}
