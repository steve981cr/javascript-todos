/* --- v17-DOM -------------------------------------------------------------- */
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
console.log(`1 Use the getElementById to get the list element from the HTML document.

const list = document.getElementById('list');`);

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
console.log(`2 createLi: Declare a function named createLi that returns a list item element, populated with the data for the todo item we pass in as an argument.

const createLi = (todo, showDetails = false) => {
  const listItem = \`/* build the li element in a template string */\`
  return listItem;
};`);

let highestId = 0;
// Get todos from storage and display
const setTodos = () => {
  let todos = { ...localStorage };
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
  }
  todos.sort((a, b) => b.id - a.id);
  // Alternatively, sort by two properties: done then id.
  // todos.sort((a, b) => Number(a.done) - Number(b.done) || b.id - a.id);
  let listItems = '';
  todos.forEach((todo) => {
    listItems += `<li id="${todo.id}" class="list-group-item">${createLi(todo)}</li>`;
  });
  list.innerHTML = listItems;
  console.log(`3 In the setTodos function, initialize a listItems variable assigned to an empty string.
Iterate over the todos array. For each element create a list item element. Call createLi() to populate the inner HTML elements. 
Use the += compound assignment operator to append each new todo list item to the listItems string.
Populate the list element from the HTML document with the listItems HTML string.

let listItems = '';
todos.forEach((todo) => {
  listItems += \`<li id="\${todo.id}" class="list-group-item">\${createLi(todo)}</li>\`;
});
list.innerHTML = listItems;`);
};
setTodos();


/* --- Add a ToDo Item ------------------------------------------------------ */

// Display add todo form.
addBtn.addEventListener('click', () => {
  console.log(`4 Use the getElementById to get the add form elements from the HTML document.
const addBtn = document.getElementById('add-btn');
const addForm = document.getElementById('add-form');
const task = document.getElementById('task');
const due = document.getElementById('due');
const details = document.getElementById('details');
const saveAddBtn = document.getElementById('save-add-btn');
const cancelAddBtn = document.getElementById('cancel-add-btn');`);
  console.log(`5 Chain the addEventListener method to the addBtn element, listening for the click event.
The second argument to addEventListener is the callback function that executes when the add button is clicked.
In the callback, set the display style property of the addForm element to 'block'. This will make the form visible.

addBtn.addEventListener('click', () => {
  addForm.style.display = 'block';
});`);
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
  console.log(`6a Chain addEventListener to the saveAddButton listening for the click event:
saveAddBtn.addEventListener('click', () => { /* callback function statements */ }

6b In the callback function, get the values from the form elements and create a new todo object:
const todo = new Todo(task.value, due.value, details.value);

6c Create a list item HTML element adding id and class attributes:
const li = document.createElement('li');
li.id = todo.id;
li.classList.add('list-group-item');

6d Call the createLi function defined above, passing in the todo object. This returns the todo list item's HTML elements as a string. Assign this as the list item's innerHTML value:
li.innerHTML = createLi(todo);

6e Add the above list item as the first child element of the list element:
list.prepend(li);

6f Hide the form and clear the form field element values and hide the form:
details.value = '';
task.value = '';
due.value = '';
addForm.style.display = 'none';`);
});

// Hide add form.
cancelAddBtn.addEventListener('click', () => {
  task.value = '';
  due.value = '';
  details.value = '';
  addForm.style.display = 'none';
  console.log(`7 listen for the click event on the cancelAddBtn element.
In the callback function, clear the form field values and hide the form:

cancelAddBtn.addEventListener('click', () => {
  task.value = '';
  due.value = '';
  details.value = '';
  addForm.style.display = 'none';
});`);
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
  
  console.log(`8 createEdit: We declared a function named createEdit that returns edit form elements, populated with the data for the todo item we pass in as an argument.

const createEdit = (todo) => {
  const editForm = \`/* build the edit form elements in a template string */\`
  return editForm;
};`);

  return editForm;
};

// Handle clicks on todo items.
let todo = {};
list.addEventListener('click', (e) => {
  console.log(`9 Chain addEventListener to the list element listening for the click event. The second parameter is the callback function. The callback's first parameter is automatically set to the event object. The parameter is commonly named "event", "evt", or "e":

list.addEventListener('click', (e) => { /* callback function statements */ }`);

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
    console.log(`10 The event target is the element that was clicked on.
Check if the target element has attribute "data-done". This is the check box.
If so, check if the element has the "checked" attribute.
If checked, traverse the DOM to the next sibling element and add the "text-decoration-line-through" class.
If it is not checked then remove the class.

if (e.target && e.target.hasAttribute('data-done')) {
  const isDone = e.target.checked;
  if (isDone) {
    e.target.nextElementSibling.classList.add('text-decoration-line-through');
  } else {
    e.target.nextElementSibling.classList.remove('text-decoration-line-through');
  }
}`);
  } else if (e.target && e.target.hasAttribute('data-details')) {
    // Handle toggle details
    const todoDetails = document.getElementById(`details-${id}`);
    if (todoDetails.style.display === 'none') {
      todoDetails.style.display = 'block';
    } else {
      todoDetails.style.display = 'none';
    }
    console.log(`11 The event target is the element that was clicked on.
Check if the target element has attribute "data-details". This is the "i" icon.
If so, get the element with id "details-id".
Check if that element has the display style attibute value "none".
If so, set the display style attribute to "block". 
If not, set it to "none".

else if (e.target && e.target.hasAttribute('data-details')) {
  const todoDetails = document.getElementById(\`details-\${id}\`);
  if (todoDetails.style.display === 'none') {
    todoDetails.style.display = 'block';
  } else {
    todoDetails.style.display = 'none';
  }
}`);
  } else if (e.target && e.target.hasAttribute('data-edit')) {
    // Handle Edit
    todo.id = id;
    todo.done = li.firstElementChild.checked;
    todo.task = li.children[1].textContent;
    todo.due = li.children[5].textContent ? new Date(`${li.children[5].textContent}, ${new Date().getFullYear()}`).toISOString().substr(0, 10) : null;
    todo.details = li.lastElementChild.textContent;
    // const todo = JSON.parse(localStorage.getItem(id));
    li.classList.add('bg-secondary');
    li.innerHTML = createEdit(todo);
    console.log(`12a The event target is the element that was clicked on.
Check if the target element has attribute "data-edit". This is the pencil icon.
A todo variable was declared and set to an empty object literal outside this block scope so it can be accessed from other blocks.
Traverse the children of the li element and get the todo field values. Assign the values to the todo object properties.
Change the background color of the element by adding a class to li.
Call the createEdit function passing the todo object. This will return the Edit Form HTML string populated with the todo object values.
Replace the li element innerHTML with the edit form.

let todo = {};
else if (e.target && e.target.hasAttribute('data-edit')) {
  todo.id = id;
  todo.done = li.firstElementChild.checked;
  todo.task = li.children[1].textContent;
  todo.due = li.children[5].textContent ? new Date(\`\${li.children[5].textContent}, \${new Date().getFullYear()}\`).toISOString().substr(0, 10) : null;
  todo.details = li.lastElementChild.textContent;
  li.classList.add('bg-secondary');
  li.innerHTML = createEdit(todo);
}`);
    console.log('12b Todo value:', todo);
  } else if (e.target && e.target.hasAttribute('data-edit-submit')) {
    // Handle submit edit form
    // const todo = JSON.parse(localStorage.getItem(id));
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

    console.log(`13a The event target is the element that was clicked on.
Check if the target element has attribute "data-edit-submit". This is the edit form's submit button.
The todo variable was declared outside this block scope and assigned properties in the block where the edit form was created.
Get the edit form field values and assign them to the todo object properties.
Remove the 'bg-secondary' class from the li element. This removes the grey background color.
Declare variable showDetails set to true. This will be passed as an argument to the createLi function.
Call the createLi function passing in the todo object and showDetails as arguments. The return value is the updated li element. The li element is currently the todo edit form. Replace the innerHTML with the new li.
Reset the todo variable to an empty object literal.

let todo = {}; // populated when the edit form was created.
else if (e.target && e.target.hasAttribute('data-edit-submit')) {
  const editTask = document.getElementById(\`task-\${id}\`);
  const editDue = document.getElementById(\`due-\${id}\`);
  const editDetails = document.getElementById(\`details-\${id}\`);
  todo.task = editTask.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  todo.due = editDue.value;
  todo.details = editDetails.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  li.classList.remove('bg-secondary');
  const showDetails = true;
  li.innerHTML = createLi(todo, showDetails);
  todo = {};
}`);
    console.log('13b Todo value:', todo);

    todo = {};
  } else if (e.target && e.target.hasAttribute('data-edit-cancel')) {
    // Handle cancel edit form
    // const todo = JSON.parse(localStorage.getItem(id));
    li.classList.remove('bg-secondary');
    const showDetails = true;
    li.innerHTML = createLi(todo, showDetails);

    console.log(`14a The event target is the element that was clicked on.
Check if the target element has attribute "data-edit-cancel". This is the edit form's cancel button.
Remove the 'bg-secondary' class from the li element. This removes the grey background color.
Declare variable showDetails set to true. This will be passed as an argument to the createLi function.
The todo variable was declared outside this block scope and assigned properties in the block where the edit form was created.
Call the createLi function passing in the todo object and showDetails as arguments. The return value is the updated li element. The li element is currently the todo edit form. Replace the innerHTML with the previous li values.
Reset the todo variable to an empty object literal.

let todo = {}; // populated when the edit form was created.
else if (e.target && e.target.hasAttribute('data-edit-cancel')) {
  li.classList.remove('bg-secondary');
  const showDetails = true;
  li.innerHTML = createLi(todo, showDetails);
  todo = {};
}`);
    console.log('14b Todo value:', todo);

    todo = {};
  } else if (e.target && e.target.hasAttribute('data-remove')) {
    // Handle remove todo
    localStorage.removeItem(id);
    e.target.parentElement.remove();

    console.log(`15 The event target is the element that was clicked on.
Check if the target element has attribute "data-remove". This is the red X icon.
The parent element is the todo's li element. 
Remove the parent element.

else if (e.target && e.target.hasAttribute('data-remove')) {
  e.target.parentElement.remove();
}`);

  }
});

/* --- Clear the ToDo List -------------------------------------------------- */
// Remove all stored Todos
clearAllBtn.addEventListener('click', () => {
  if (confirm('Confirm remove all todos') === true) {
    localStorage.clear();
    list.innerHTML = '';
  }
  console.log(`16 Use the getElementById to get the clear all button element from the HTML document.
const clearAllBtn = document.getElementById('clear-all-btn');`);
  console.log(`17 Chain the addEventListener method to the clearAllBtn element, listening for the click event.
The second argument to addEventListener is the callback function that executes when the button is clicked.
In the callback, set the list element's innerHTML to an empty string.

clearAllBtn.addEventListener('click', () => {
  list.innerHTML = '';
}`);
});
