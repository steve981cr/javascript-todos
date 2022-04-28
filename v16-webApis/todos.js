/* Web APIs. */
// To start with an empty list click the clear all button. Refresh the app to seed it.
import seedTodos from './seed-todos.js';
const addBtn = document.getElementById('add-btn');
const form = document.getElementById('form');
const task = document.getElementById('task');
const due = document.getElementById('due');
const details = document.getElementById('details');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const list = document.getElementById('list');
const clearAllBtn = document.getElementById('clearAll-btn');

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

let highestId = 0;
// Get todos from storage and display
const setTodos = () => {
  let todos = { ...localStorage };
  console.log(`1 localStorage stores items as key-value pairs. 
Using the spread operator in an object literal will populate all the items in the object.

let todos = { ...localStorage };`);

  let ids = Object.keys(todos);
  if (ids.length > 0) {
    ids = ids.map((id) => Number(id));
    ids.sort((a, b) => b - a);
    // eslint-disable-next-line prefer-destructuring, no-unused-vars
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
    console.log(`2 Iterate over all the todo items and store each in localStorage.
Use the todo id as the key. 
LocalStorage stores text not JavaScript objects, so convert each todo object to a JSON formatted string.

todos.forEach((todo) => {
  localStorage.setItem(todo.id, JSON.stringify(todo));
});`);
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
    this.id = highestId + (++Todo.count);
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
  localStorage.setItem(todo.id.toString(), JSON.stringify(todo));
  console.log(`3 When a new item is created, store it in localStorage.

localStorage.setItem(todo.id.toString(), JSON.stringify(todo));`);
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

// Handle clicks on todo items.
list.addEventListener('click', (e) => {
  const li = e.target.parentElement;
  const { id } = li;

  // Handle Done
  if (e.target && e.target.hasAttribute('data-done')) {
    const todo = JSON.parse(localStorage.getItem(id));
    console.log(`4 Get items from localStorage using it's key, in this case the todo's id.
Since the todo is stored as a JSON formatted string, it must be parsed back to a JavaScript object. 

const todo = JSON.parse(localStorage.getItem(id));`);

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
    /* todo.done = li.firstElementChild.checked;
    todo.task = li.children[1].textContent;
    todo.due = li.children[5].textContent ? new Date(`${li.children[5].textContent}, ${new Date().getFullYear()}`).toISOString().substr(0, 10) : null;
    todo.details = li.lastElementChild.textContent; */
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
    console.log(`5 Remove individual items from localStorage identified by the key value, in this case by the todo id.

localStorage.removeItem(id);`);
    e.target.parentElement.remove();
  }
});

// Remove all stored Todos
clearAllBtn.addEventListener('click', () => {
  if (confirm('Confirm remove all todos') === true) {
    localStorage.clear();
    list.innerHTML = '';
  }
  console.log(`6 Confirm is also a Web API. It displays a message with OK and Cancel butons.
localStorage.clear() removes all items stored in the domain's localStorage.

if (confirm('Confirm remove all todos') === true) {
  localStorage.clear();
  list.innerHTML = '';
}`);
});
