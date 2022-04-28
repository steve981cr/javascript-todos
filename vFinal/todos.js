/* --- Final Version -------------------------------------------------------- */
// To start with an empty list click the clear all button. Refresh the app to seed it.
import seedTodos from './seed-todos.js';
const addBtn = document.getElementById('add-btn');
const addForm = document.getElementById('add-form');
const task = document.getElementById('task');
const due = document.getElementById('due');
const details = document.getElementById('details');
const saveAddBtn = document.getElementById('save-add-btn');
const cancelAddBtn = document.getElementById('cancel-add-btn');
const list = document.getElementById('list');
const clearAllBtn = document.getElementById('clearAll-btn');

try {
  if (!navigator.onLine) {
    throw new Error('No Connection. Bootstrap and Bootstrap icon CDNs require an internet connection.');
  }
} catch (err) {
  console.error(`${err.name}: ${err.message}`);

  const errMsgElem = document.createElement('li');
  errMsgElem.classList.add('list-group-item', 'bg-danger'); 
  errMsgElem.textContent = `${err.name}: ${err.message}`;
  list.insertAdjacentElement('beforebegin', errMsgElem);
}


/* --- Seed the ToDo List --------------------------------------------------- */
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

let highestId = 0;
// Get todos from storage and display
const setTodos = () => {
  let todos = { ...localStorage };
  let ids = Object.keys(todos);
  if (ids.length > 0) {
    ids = ids.map((id) => Number(id));
    ids.sort((a, b) => b - a);
    highestId = ids[0];
    todos = Object.values(todos);
    todos = todos.map((todo) => JSON.parse(todo));
  } else {
    // Seed todos and display
    todos = seedTodos;    
    // Sort ToDos by Id number in descending order.
    const jsTodoIds = todos.map((todo) => todo.id);
    jsTodoIds.sort((a, b) => b - a);
    // eslint-disable-next-line prefer-destructuring
    highestId = jsTodoIds[0];
    todos.forEach((todo) => {
      localStorage.setItem(todo.id, JSON.stringify(todo));
    });
  }
  todos.sort((a, b) => b.id - a.id);
  // Alternatively, sort by two properties: done then id.
  // todos.sort((a, b) => Number(a.done) - Number(b.done) || b.id - a.id);
  let listItems = '';
  todos.forEach((todo) => {
    listItems += `<li id="${todo.id}" class="list-group-item">${createLi(todo)}</li>`;
  });
  list.innerHTML = listItems;
};
setTodos();


/* --- Add a ToDo Item ------------------------------------------------------ */
// Display add todo form.
addBtn.addEventListener('click', () => {
  addForm.style.display = 'block';
});

class Todo {
  constructor(task, due, details) {
    this.id = highestId + (++Todo.count);
    this.task = task;
    this.due = due;
    this.details = details;
    this.done = false;
  }

  static count = 0;
}

// Handle Add Todo form submission.
saveAddBtn.addEventListener('click', () => {
  const taskVal = task.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const detailsVal = details.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const todo = new Todo(taskVal, due.value, detailsVal);
  localStorage.setItem(todo.id.toString(), JSON.stringify(todo));
  const li = document.createElement('li');
  li.id = todo.id;
  li.classList.add('list-group-item');
  li.innerHTML = createLi(todo);
  list.prepend(li);
  task.value = '';
  due.value = '';
  details.value = '';
  addForm.style.display = 'none';
});

// Hide add form.
cancelAddBtn.addEventListener('click', () => {
  task.value = '';
  due.value = '';
  details.value = '';
  addForm.style.display = 'none';
});


/* --- Edit a ToDo Item ----------------------------------------------------- */
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

// Handle clicks on todo items.
list.addEventListener('click', (e) => {
  const li = e.target.parentElement;
  const { id } = li;

  // Handle Done
  if (e.target && e.target.hasAttribute('data-done')) {
    const todo = JSON.parse(localStorage.getItem(id));
    const isDone = e.target.checked;
    if (isDone) {
      todo.done = true;
      localStorage.setItem(id, JSON.stringify(todo));
      e.target.nextElementSibling.classList.add('text-decoration-line-through');
    } else {
      todo.done = false;
      localStorage.setItem(id, JSON.stringify(todo));
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
    const todo = JSON.parse(localStorage.getItem(id));
    li.classList.add('bg-secondary');
    li.innerHTML = createEdit(todo);
  } else if (e.target && e.target.hasAttribute('data-edit-submit')) {
    // Handle submit edit form
    const todo = JSON.parse(localStorage.getItem(id));
    const editTask = document.getElementById(`task-${id}`);
    const editDue = document.getElementById(`due-${id}`);
    const editDetails = document.getElementById(`details-${id}`);
    todo.task = editTask.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    todo.due = editDue.value;
    todo.details = editDetails.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    localStorage.setItem(id, JSON.stringify(todo));
    li.classList.remove('bg-secondary');
    const showDetails = true;
    li.innerHTML = createLi(todo, showDetails);
  } else if (e.target && e.target.hasAttribute('data-edit-cancel')) {
    // Handle cancel edit form
    const todo = JSON.parse(localStorage.getItem(id));
    li.classList.remove('bg-secondary');
    const showDetails = true;
    li.innerHTML = createLi(todo, showDetails);
  } else if (e.target && e.target.hasAttribute('data-remove')) {
    // Handle remove todo
    localStorage.removeItem(id);
    e.target.parentElement.remove();
  }
});


/* --- Clear the ToDo List -------------------------------------------------- */
// Remove all stored Todos
clearAllBtn.addEventListener('click', () => {
  if (confirm('Confirm remove all todos') === true) {
    localStorage.clear();
    list.innerHTML = '';
  }
});
