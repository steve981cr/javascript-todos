/* --- v18-JSON -------------------------------------------------------------- */
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
    console.log(`2 The setTodos function seeds the todo list with existing todo items from local storage.
Place the todos in an object literal using the spread operator assigning it to a variable called todos.
The localStorage keys are the todo id numbers. Object.keys(todos) converts them to an array which is assigned to variable name ids.
If there are any ids (i.e., if the ids array length is greater than 0): 
• Change the id values from strings to numbers.
• Sort them in descending order.
• Set the highestId variable to the first id element (i.e., the highest value). This variable will be used when creating new todo items.
• Get the values from the todos object and assign them to the todos variable. Object.values(todos) will return an array of todo string values.
• LocalStorage stores items as strings. The todos are JavaScript objects so they were converted to JSON strings before being stored. The JSON.parse() method converts them back to JS objects.

let todos = { ...localStorage };
let ids = Object.keys(todos);
if (ids.length > 0) {
  ids = ids.map((id) => Number(id));
  ids.sort((a, b) => b - a);
  highestId = ids[0];
  todos = Object.values(todos);
  todos = todos.map((todo) => JSON.parse(todo));
}`)

  } else {
    // Seed todos and display
    todos = JSON.parse(seedTodos);    
    // Sort ToDos by Id number in descending order.
    const jsTodoIds = todos.map((todo) => todo.id);
    jsTodoIds.sort((a, b) => b - a);
    // eslint-disable-next-line prefer-destructuring
    highestId = jsTodoIds[0];
    todos.forEach((todo) => {
      localStorage.setItem(todo.id, JSON.stringify(todo));
    });

    console.log(`3 The setTodos function seeds the todo list. If there are no todo items in local storage, the list will be seeded with todos from the seed-todos module.
seedTodos is a string in JSON format, so the JSON.parse() method is used to convert them to an array of todo objects. This array is assigned to the todos variable.
We need to find the highest id value and assign it to the highestId variable. This value is needed for assigning ids to new todos when they are created. An array of the todo ids is created, then sorted in descending order, then the first (i.e., highest) value is assigned to the highestId variable.
Each todos is stored in localStorage by iterating over the todos, converting them to JSON format with JSON.stringify() and storing it.

if (ids.length = 0) {
  todos = JSON.parse(seedTodos);    
  // Sort ToDos by Id number in descending order.
  const jsTodoIds = todos.map((todo) => todo.id);
  jsTodoIds.sort((a, b) => b - a);
  highestId = jsTodoIds[0];
  todos.forEach((todo) => {
    localStorage.setItem(todo.id, JSON.stringify(todo));
  });
}`);

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
  console.log(`4 When new todo objects are created, they are stored in localStorage by converting them to a JSON string:
  
localStorage.setItem(todo.id.toString(), JSON.stringify(todo));`);
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
    console.log(`5 When a list item data-done checkbox is clicked, the item is retrieved from localStorage and converted from a JSON string to a JS todo object:
  
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
    console.log(`6 The todo.done value is changed from false to true, or from true to false.
Then the todo is saved back to localStorage by converting it back to a JSON string:
  
todo.done = true;
localStorage.setItem(id, JSON.stringify(todo));`);
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
    console.log(`7 When the edit icon is clicked, an edit todo form is created. The todo data is retrieved from localStorage and converted from a JSON string to a JS object:

const todo = JSON.parse(localStorage.getItem(id));`);
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
    console.log(`8 When a todo edit form is submitted, a todo object is populated with the updated values, converted to a JSON string, then saved to localStorage by its id key:
  
localStorage.setItem(id, JSON.stringify(todo));`);
    li.classList.remove('bg-secondary');
    const showDetails = true;
    li.innerHTML = createLi(todo, showDetails);
  } else if (e.target && e.target.hasAttribute('data-edit-cancel')) {
    // Handle cancel edit form
    const todo = JSON.parse(localStorage.getItem(id));
    console.log(`9 If the todo edit form is cancelled, the original todo data is retrieved from local storage and converted from a JSON string to a JS object:
  
const todo = JSON.parse(localStorage.getItem(id));`);
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
