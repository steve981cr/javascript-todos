/* Loops */
const addBtn = document.getElementById('add-btn');
const form = document.getElementById('form');
const task = document.getElementById('task');
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
      id: 4, task: 'Conditional Statements and Booleans', due: '', done: true, details: 'Conditionals (if statements, ternary statements, and switch statements) and Booleans (true/false).',
    },
    {
      id: 5, task: 'Loops', due: '', done: false, details: 'For...of, for...in, for, while, and do...while loops.',
    },
  ];
  let listItems = '';
  todos.forEach((todo) => {
    listItems += `<li id="${todo.id}" class="list-group-item">${createLi(todo)}</li>`;
  });
  console.log(1, 'todos.forEach((todo) => { listItems += `<li>${todo.task}</li>`});', 'The array forEach iterator behaves similar to a loop, iterating over each array element. In general, use iterators on arrays instead of loops.');
  console.log(2, 'for (const todo of todos) { listItems += `<li>${todo.task}</li>`; }', 'Alternatively use a for...of loop to loop over each todo in the array.');
  console.log(3, 'for (let i=0; i < todos.length; i++) { listItems += `<li>${todos[i].task}</li>`; }', 'Prior to ES6, standard for loops were often used to iterate over arrays, using variable i to represent the array\'s index number.');
  console.log(4, `let i = 0;
while (i < todos.length) {
  listItems += \`<li>\${todos[i].task}</li>\`;
  i++;
}`, '// A while loop can also be used similarly to a for loop.');
  console.log(5, 'A do...while loop would not work in this case because it will execute once before the test condition. If there were no todo items this would append one empty item.');

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
    todo.details = li.lastElementChild.textContent;
    li.classList.add('bg-secondary');
    li.innerHTML = createEdit(todo);
  } else if (e.target && e.target.hasAttribute('data-edit-submit')) {
    // Handle submit edit form
    const editTask = document.getElementById(`task-${id}`);
    const editDetails = document.getElementById(`details-${id}`);
    todo.task = editTask.value;
    todo.details = editDetails.value;
    li.classList.remove('bg-secondary');
    const showDetails = true;
    li.innerHTML = createLi(todo, showDetails);
  } else if (e.target && e.target.hasAttribute('data-edit-cancel')) {
    // Handle cancel edit form
    li.classList.remove('bg-secondary');
    const showDetails = true;
    li.innerHTML = createLi(todo, showDetails);
  } else if (e.target && e.target.hasAttribute('data-remove')) {
    // Handle remove todo
    e.target.parentElement.remove();
  }
});
