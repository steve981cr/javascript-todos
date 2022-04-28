/*  Conditional Statements (if statements, ternary statements) and Booleans. */
const addBtn = document.getElementById('add-btn');
const form = document.getElementById('form');
const task = document.getElementById('task');
const details = document.getElementById('details');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const list = document.getElementById('list');

console.log(1, '<input type="checkbox"${todo.done ? " checked" : ""}/> // Ternary statements have three operands. If the first operand, todo.done, is true then return the second operand adding the "checked" attribute to the input element, otherwise return the third operand (an empty space).');
console.log(2, '<strong${todo.done ? \' class="text-decoration-line-through"\' : \'\'}>${todo.task}</strong> // This ternary statement adds a class to the element if todo.done is true, or nothing if false.');
const createLi = (todo, showDetails = false) => {
  const listItem = `<input type="checkbox" data-done class="form-check-input"${todo.done ? ' checked' : ''}/>
      <strong${todo.done ? ' class="text-decoration-line-through"' : ''}>${todo.task}</strong>
      <i data-remove class="bi bi-x-circle-fill text-danger float-end" role="button"></i>
      <i data-edit class="bi bi-pencil-square float-end mx-1 text-dark" role="button"></i>
      <i data-details class="bi bi-info-circle-fill text-dark float-end ms-2" role="button"></i>
      <p id="details-${todo.id}" style="display: ${showDetails ? 'block' : 'none'};" class="mb-0">${todo.details}</p>`;
  return listItem;
};
const createEdit = (todo) => {
  const editForm = `<div class="form-floating mb-2">
    <input type="text" id="task-${todo.id}" class="form-control mb-2" value="${todo.task}">
    <label for="task">Task:</label>
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
      id: 4, task: 'Conditional Statements and Booleans', due: '', done: false, details: 'Conditionals (if statements, ternary statements, and switch statements) and Booleans (true/false).',
    },
  ];
  let listItems = '';
  todos.forEach((todo) => {
    listItems += `<li id="${todo.id}" class="list-group-item">${createLi(todo)}</li>`;
  });
  list.innerHTML = listItems;
  id = todos.length;  
};
setTodos();

// Display form.
addBtn.addEventListener('click', () => {
  form.style.display = 'block';
});

// Hide form.
cancelBtn.addEventListener('click', () => {
  task.value = '';
  details.value = '';
  form.style.display = 'none';
});

// Handle Add Todo form submission.
submitBtn.addEventListener('click', () => {
  id = id + 1;
  const todo = { id: id, task: task.value, details: details.value, done: false };
  const li = document.createElement('li');
  li.id = todo.id;
  li.classList.add('list-group-item');
  li.innerHTML = createLi(todo);
  list.prepend(li);
  form.style.display = 'none';
  task.value = '';
  details.value = '';
});

const todo = {};
// Handle clicks on todo items.
list.addEventListener('click', (e) => {
  const li = e.target.parentElement;
  const { id } = li;
  todo.id = id;

  console.log(3, 'If you click on the todo list element, there are a series of if/else if statements to test what todo item and icon is clicked on.');

  // Handle Done
  if (e.target && e.target.hasAttribute('data-done')) {
    console.log(4, `if (e.target && e.target.hasAttribute('data-done')) { /* take some action */ } // On the click event, if there is an event target, and if the target has attribute 'data-done', then take some action.`);
    const isDone = e.target.checked;
    console.log(5, 'if (isDone) {/* cross off the task */} // Nested if statement. If isDone is true, cross off the task. Else remove the cross off');
    if (isDone) {
      e.target.nextElementSibling.classList.add('text-decoration-line-through');
    } else {
      e.target.nextElementSibling.classList.remove('text-decoration-line-through');
    }
  } else if (e.target && e.target.hasAttribute('data-details')) {
    console.log(6, `if (e.target && e.target.hasAttribute('data-details')) { /* show or hide details */ } // On the click event, if there is an event target, and if the target has attribute 'data-done', then cross off the task.`);
    // Handle toggle details
    const todoDetails = document.getElementById(`details-${id}`);
    if (todoDetails.style.display === 'none') {
      todoDetails.style.display = 'block';
    } else {
      todoDetails.style.display = 'none';
    }
  } else if (e.target && e.target.hasAttribute('data-edit')) {
    console.log(7, `if (e.target && e.target.hasAttribute('data-edit')) { /* show edit form */ } // On the click event, if there is an event target, and if the target has attribute 'data-edit', then create and display the edit form.`);
    // Handle Edit
    todo.done = li.firstElementChild.checked;
    todo.task = li.children[1].textContent;
    todo.details = li.lastElementChild.textContent;
    li.classList.add('bg-secondary');
    li.innerHTML = createEdit(todo);
  } else if (e.target && e.target.hasAttribute('data-edit-submit')) {
    console.log(8, `if (e.target && e.target.hasAttribute('data-edit-submit')) { /* update the todo item */ } // On the click event, if there is an event target, and if the target has attribute 'data-edit-submit', then update the todo item with the edit form data.`);
    // Handle submit edit form
    const editTask = document.getElementById(`task-${id}`);
    const editDetails = document.getElementById(`details-${id}`);
    todo.task = editTask.value;
    todo.details = editDetails.value;
    li.classList.remove('bg-secondary');
    const showDetails = true;
    li.innerHTML = createLi(todo, showDetails);
  } else if (e.target && e.target.hasAttribute('data-edit-cancel')) {
    console.log(9, `if (e.target && e.target.hasAttribute('data-edit-cancel')) { /* close the edit form */ } // On the click event, if there is an event target, and if the target has attribute 'data-edit-cancel', then close the edit form and re-display the original the todo item data.`);
    // Handle cancel edit form
    li.classList.remove('bg-secondary');
    const showDetails = true;
    li.innerHTML = createLi(todo, showDetails);
  } else if (e.target && e.target.hasAttribute('data-remove')) {
    console.log(10, `if (e.target && e.target.hasAttribute('data-remove')) { /* remove the todo item */ } // On the click event, if there is an event target, and if the target has attribute 'data-remove', then remove the todo item from the list.`);
    // Handle remove todo
    e.target.parentElement.remove();
  }
});
