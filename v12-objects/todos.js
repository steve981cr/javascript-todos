/* Objects. */
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
  const todos = [
    {
      id: 1, task: 'JavaScript General', due: '', done: true, details: 'Data types, global object, built-in global objects',
    },
    {
      id: 2, task: 'Literals and Variables', due: '', done: true, details: 'Literals, primitive vs object variables, const and let vs var, scope, destructuring assignment',
    },
    {
      id: 3, task: 'Expressions and Operators', due: '', done: true, details: 'Expressions, assignment operators, arithmetic operators, comparison operators, logical operators, string operators',
    },
    {
      id: 4, task: 'Conditional Statements and Booleans', due: '', done: true, details: 'Conditionals (if statements, ternary statements, and switch statements) and Booleans (true/false).',
    },
    {
      id: 5, task: 'Loops', due: '', done: true, details: 'For...of, for...in, for, while, and do...while loops.',
    },
    {
      id: 6, task: 'Functions', due: '', done: true, details: 'Function declarations, arrow functions, methods, parameters, rest parameters, an return statements',
    },
    {
      id: 7, task: 'Strings', due: '', done: true, details: 'String literals, template strings, string methods.',
    },
    {
      id: 8, task: 'Regular Expressions', due: '', done: true, details: 'Regular Expression literals and objects, syntax, methods, string regexp methods.',
    },
    {
      id: 9, task: 'Numbers and Math', due: '', done: true, details: 'Number literals, Math Global Object.',
    },
    {
      id: 10, task: 'Dates', due: '', done: true, details: 'Number literals, Math Global Object.',
    },
    {
      id: 11, task: 'Arrays', due: '', done: true, details: 'Creating arrays, static and instance properties and methods, shallow copies, sets.',
    },
    {
      id: 12, task: 'Objects', due: '', done: false, details: 'Object literals, properties, methods, this, spread operator, static and instance properties and methods.',
    },
  ];
  console.log(`1 Each todo item is an object literal with five properties.
{ id: 12, task: 'Objects', due: '', done: false, details: 'Lorem ipsum.' }`);

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

// Handle Add Todo form submission.
submitBtn.addEventListener('click', () => {
  id += 1;
  const taskVal = task.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const detailsVal = details.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const todo = { id: id, task: taskVal, due: due.value, details: detailsVal, done: false };
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
console.log(`2 There is event listener when users click on a ToDo task from the list. A todo variable is declared in the global scope just above the listener.
It is assigned to an empty object literal. Todo property values will be assigned inside the listener callback function depending on what the user clicks.
let todo = {};`);
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
    console.log(`3 When the user clicks on a todo\'s edit icon, the todo object is assigned property values taken from the todo list item.
todo.done = li.firstElementChild.checked;
todo.task = li.children[1].textContent;
todo.due = li.children[5].textContent ? new Date(\`\${li.children[5].textContent}, \${new Date().getFullYear()}\`).toISOString().substr(0, 10) : null;
todo.details = li.lastElementChild.textContent;    
`);
    todo.done = li.firstElementChild.checked;
    todo.task = li.children[1].textContent;
    todo.due = li.children[5].textContent ? new Date(`${li.children[5].textContent}, ${new Date().getFullYear()}`).toISOString().substr(0, 10) : null;
    todo.details = li.lastElementChild.textContent;
    li.classList.add('bg-secondary');
    li.innerHTML = createEdit(todo);
  } else if (e.target && e.target.hasAttribute('data-edit-submit')) {
    // Handle submit edit form
    console.log(`4 When the user submits the todo item edit form, the todo object is assigned property values taken from the form field values.
todo.task = editTask.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
todo.due = editDue.value;
todo.details = editDetails.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');`);
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
    console.log(`5 Reset the todo variable to an empty object after the object is updated.
todo = {};`);
  } else if (e.target && e.target.hasAttribute('data-edit-cancel')) {
    // Handle cancel edit form
    console.log(`6 If the user has the ToDo item edit form open, but clicks the cancel button, then the original todo object is passed to the createLi function.
li.innerHTML = createLi(todo, showDetails);`);
    li.classList.remove('bg-secondary');
    const showDetails = true;
    li.innerHTML = createLi(todo, showDetails);
    todo = {};
    console.log(`7 Reset the todo variable to an empty object after the object edit form is cancelled.
todo = {};`);
  } else if (e.target && e.target.hasAttribute('data-remove')) {
    // Handle remove todo
    e.target.parentElement.remove();
    todo = {};
    console.log(`8 Reset the todo variable to an empty object after the object is deleted.
todo = {};`);
  }
});
