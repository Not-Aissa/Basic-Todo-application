const todoOptionsForm = document.querySelector("#todo_options_form");
const taskInput = document.querySelector("#task_input");
const taskCreateBtn = document.querySelector("#task_create_btn");
const todoTasksHeader = document.querySelector(".todo-tasks-header");
const todoTasksFilterHeader = document.querySelector(".todo-tasks-filter-header");
const tasksFilterBtns = document.querySelectorAll(".tasks-filter-btn");
const todoSearchFilterForm = document.querySelector(".todo-search-filter-form");
const searchFilterInput = document.querySelector("#search_filter_input");
const searchFilterBtn = document.querySelector("#search_filter_btn");

const todos = JSON.parse(localStorage.getItem("todos")) || [];
let todosFilterType = "all";
let searchFilterContent = "";

window.addEventListener("load", () => {
  updateTodoTasksHeader();
  checkTodoTasksHeaderHide();
  checkTodoTasksFilterHeaderHide();
});

todoOptionsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  createTask(taskInput.value);
});

todoSearchFilterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  filterTodosByCharacters(searchFilterInput.value);
});

tasksFilterBtns.forEach((tasksFilterBtn) => {
  tasksFilterBtn.addEventListener("click", (e) => {
    todosFilterType = e.target.dataset.filter;

    updateTodoTasksHeader();

    tasksFilterBtns.forEach((tasksFilterBtn) => tasksFilterBtn.classList.remove("active"));

    tasksFilterBtn.classList.add("active");
    
    searchFilterTypeIndicator();
    
    resetSearchFilter();
  });
});

function createTask(content) {
  const newTask = {
    id: Date.now(),
    content,
    completed: false,
  };

  if (!content) {
    alert("Please provide a task content!");

    return;
  }

  if (content.length === 1) {
    alert("A task must include 2 or more characters!");

    return;
  }

  if (todos.length > 0) {
    for (const todo of todos) {
      if (todo.content === content) {
        alert("This task already exists!");

        return;
      }
    }
  }

  todos.push(newTask);

  localStorage.setItem("todos", JSON.stringify(todos));

  taskInput.value = "";
  
  todosFilterType = "all";
  
  tasksFilterBtns.forEach((tasksFilterBtn) => {
    tasksFilterBtn.classList.remove("active");
    
    if (tasksFilterBtn.dataset.filter === "all") {
      tasksFilterBtn.classList.add("active");
    };
  });

  updateTodoTasksHeader();

  checkTodoTasksHeaderHide();

  checkTodoTasksFilterHeaderHide();
  
  searchFilterTypeIndicator();
}

function completeTask(todo) {
  todo.completed = true;

  localStorage.setItem("todos", JSON.stringify(todos));

  updateTodoTasksHeader();
}

function reloadTask(todo) {
  todo.completed = false;

  localStorage.setItem("todos", JSON.stringify(todos));

  updateTodoTasksHeader();
}

function deleteTask(todo) {
  todos.splice(todos.indexOf(todo), 1);

  localStorage.setItem("todos", JSON.stringify(todos));

  updateTodoTasksHeader();

  checkTodoTasksHeaderHide();

  checkTodoTasksFilterHeaderHide();
}

function updateTodoTasksHeader() {
  todoTasksHeader.textContent = "";
  
  switch (todosFilterType) {
    case "all":
    todos.forEach((todo) => renderTodoTasksHeaderContent(todo));
    break;
    
    case "completed":
    todos.filter((todo) => todo.completed).forEach((todo) => renderTodoTasksHeaderContent(todo));
    break;
    
    case "not-completed":
    todos.filter((todo) => !todo.completed).forEach((todo) => renderTodoTasksHeaderContent(todo));
    break;
    
    case "search":
    todos.forEach((todo) => renderTodoTasksHeaderContent(todo));
    break;
    
    default:
    todos.forEach((todo) => renderTodoTasksHeaderContent(todo));
  }
}

function filterTodosByCharacters(content) {
  searchFilterContent = content;
  
  todoTasksHeader.textContent = "";
  
  if (searchFilterContent.length > 0) {
    todos.filter((todo) => todo.content.toLowerCase().startsWith(searchFilterContent.toLowerCase())).forEach((todo) => {
      renderTodoTasksHeaderContent(todo);
    });
    
    return;
  }
  
  todos.forEach((todo) => renderTodoTasksHeaderContent(todo));
}

function renderTodoTasksHeaderContent(todo) {
  const taskSection = document.createElement("section");
  const taskContent = document.createElement("p");
  const taskActions = document.createElement("div");
  const taskCompleteBtn = document.createElement("button");
  const taskReloadBtn = document.createElement("button");
  const taskDeleteBtn = document.createElement("button");

  taskContent.appendChild(document.createTextNode(todo.content));
  taskCompleteBtn.appendChild(document.createTextNode("Complete"));
  taskReloadBtn.appendChild(document.createTextNode("Reload"));
  taskDeleteBtn.appendChild(document.createTextNode("Delete"));

  taskSection.classList.add("task-section");
  taskContent.classList.add("task-content", todo.completed ? "completed" : "not-completed");
  taskActions.classList.add("task-actions");
  taskCompleteBtn.classList.add("task-complete-btn", todo.completed ? "hide" : "active");
  taskReloadBtn.classList.add("task-reload-btn", todo.completed ? "active" : "hide");
  taskDeleteBtn.classList.add("task-delete-btn");

  taskCompleteBtn.addEventListener("click", () => {
    completeTask(todo);
  });

  taskReloadBtn.addEventListener("click", () => {
    reloadTask(todo);
  });

  taskDeleteBtn.addEventListener("click", () => {
    deleteTask(todo);
  });

  taskActions.append(taskCompleteBtn, taskReloadBtn, taskDeleteBtn);
  taskSection.append(taskContent, taskActions);
  todoTasksHeader.appendChild(taskSection);
}

function checkTodoTasksHeaderHide() {
  if (todos.length > 0) todoTasksHeader.classList.remove("hide");
  else todoTasksHeader.classList.add("hide");
}

function checkTodoTasksFilterHeaderHide() {
  if (todos.length > 0) todoTasksFilterHeader.classList.remove("hide");
  else todoTasksFilterHeader.classList.add("hide");
}

function searchFilterTypeIndicator() {
  if (todosFilterType === "search") todoSearchFilterForm.classList.remove("hide");
  else todoSearchFilterForm.classList.add("hide");
}

function resetSearchFilter() {
  searchFilterInput.value = "";
  
  searchFilterContent = "";
}
