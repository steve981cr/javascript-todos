/* Modules. */
console.log(`1 The todos.html file accesses todos.js as a JavaScript module.
<script type="module" src="todos.js"></script>`);
import todos from './seed-todos.js';
console.log(`3 Import the todos array from the seed-todos.js file using the import statement.
import todos from './seed-todos.js';`);

const addBtn = document.getElementById('add-btn');
const form = document.getElementById('form');
const task = document.getElementById('task');
const due = document.getElementById('due');
const details = document.getElementById('details');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const list = document.getElementById('list');

const createLi = (todo, showDetails = false) => {
  const listItem = `<input type="checkbox" data-done class="form-check-input"${todo.done ? ' checked' : ''}/>
      <strong${todo.done ? ' class="text-decoration-line-through"' : ''}>${todo.task}</strong>
      <i data-remove class="bi bi-x-circle-fill text-danger float-end" role="button"></i>
      <i data-edit class="bi bi-pencil-square float-end mx-1 text-dark" role="button"></i>
      <i data-details class="bi bi-info-circle-fill text-dark float-end ms-2" role="button"></i>
      <span class="float-end align-bottom">${todo.due ? `Due: ${new Date(todo.due).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })}` : ''}</span>
      <p id="details-${todo.id}" style="display: ${showDetails ? 'block' : 'none'};" class="mb-0">${todo.details}</p>`;
  return listItem;
};

const createEdit = (todo) => {
  const editForm = `<div class="form-floating mb-2">
    <input type="text" id="task-${todo.id}" class="form-control mb-2" value="${todo.task}">
    <label for="task">Task:</label>
  </div>
  <div class="form-floating mb-2">
    <input type="date" id="due-${todo.id}" class="form-control mb-2" value="${todo.due}">
    <label for="Due">Due:</label>
  </div>
  <div class="form-floating mb-2">
    <textarea id="details-${todo.id}" class="form-control" style="height: 80px">${todo.details}</textarea>
    <label for="details">Details:</label>
  </div>
  <button data-edit-submit class="btn btn-sm btn-outline-light col-md-2">Save Edit</button>
  <button data-edit-cancel class="btn btn-sm btn-outline-light col-md-2 float-end">Cancel</button>`;
  return editForm;
};

let id = 0;
// Seed todos and display
const setTodos = () => {
  // Sort ToDos by Id number in descending order.
  todos.sort((a, b) => b.id - a.id);
  // Alternatively, sort by two properties: done then id.
  // todos.sort((a, b) => Number(a.done) - Number(b.done) || b.id - a.id);
  let listItems = '';
  todos.forEach((todo) => {
    listItems += `<li id="${todo.id}" class="list-group-item">${createLi(todo)}</li>`;
  });
  list.innerHTML = listItems;
  id = todos.length;
}
setTodos();

// Display form.
addBtn.addEventListener('click', () => {
  form.style.display = 'block';
});

// Hide form.
cancelBtn.addEventListener('click', () => {
  task.value = '';
  due.value = '';
  details.value = '';
  form.style.display = 'none';
});

class Todo {
  constructor(task, due, details) {
    this.id = id + (++Todo.count);
    this.task = task;
    this.due = due;
    this.details = details;
    this.done = false;
  }

  static count = 0;
}

// Handle Add Todo form submission.
submitBtn.addEventListener('click', () => {
  const taskVal = task.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const detailsVal = details.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const todo = new Todo(taskVal, due.value, detailsVal);
  const li = document.createElement('li');
  li.id = todo.id;
  li.classList.add('list-group-item');
  li.innerHTML = createLi(todo);
  list.prepend(li);
  form.style.display = 'none';
  task.value = '';
  due.value = '';
  details.value = '';
});

let todo = {};
// Handle clicks on todo items.
list.addEventListener('click', (e) => {
  const li = e.target.parentElement;
  const { id } = li;
  todo.id = id;

  // Handle Done
  if (e.target && e.target.hasAttribute('data-done')) {
    const isDone = e.target.checked;
    if (isDone) {
      e.target.nextElementSibling.classList.add('text-decoration-line-through');
    } else {
      e.target.nextElementSibling.classList.remove('text-decoration-line-through');
    }
  } else if (e.target && e.target.hasAttribute('data-details')) {
    // Handle toggle details
    const todoDetails = document.getElementById(`details-${id}`);
    if (todoDetails.style.display === 'none') {
      todoDetails.style.display = 'block';
    } else {
      todoDetails.style.display = 'none';
    }
  } else if (e.target && e.target.hasAttribute('data-edit')) {
    // Handle Edit    
    todo.done = li.firstElementChild.checked;
    todo.task = li.children[1].textContent;
    todo.due = li.children[5].textContent ? new Date(`${li.children[5].textContent}, ${new Date().getFullYear()}`).toISOString().substr(0, 10) : null;
    todo.details = li.lastElementChild.textContent;
    li.classList.add('bg-secondary');
    li.innerHTML = createEdit(todo);
  } else if (e.target && e.target.hasAttribute('data-edit-submit')) {
    // Handle submit edit form
    const editTask = document.getElementById(`task-${id}`);
    const editDue = document.getElementById(`due-${id}`);
    const editDetails = document.getElementById(`details-${id}`);
    todo.task = editTask.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    todo.due = editDue.value;
    todo.details = editDetails.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    li.classList.remove('bg-secondary');
    const showDetails = true;
    li.innerHTML = createLi(todo, showDetails);
    todo = {};
  } else if (e.target && e.target.hasAttribute('data-edit-cancel')) {
    // Handle cancel edit form
    li.classList.remove('bg-secondary');
    const showDetails = true;
    li.innerHTML = createLi(todo, showDetails);
    todo = {};
  } else if (e.target && e.target.hasAttribute('data-remove')) {
    // Handle remove todo
    e.target.parentElement.remove();
    todo = {};
  }
});
