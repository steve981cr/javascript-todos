import dbData from './seed-todos.js';

const queryTodos = async () => {

  console.log(`3 The queryTodos function is defined in the todos-simulatedDb.js file.
  When called it returns an array of todos objects, simulating a database query. Database queries are done asynchronously. We will simulate a half second time delay by using the setTimeout Web API function.
  To wait for the result we will make it an async function and await the Promise result.
  To create a promise we need to call the Promise constructor function passing a callback function as the first property. It has two arguments, one to return the resolved data, and one to return a rejection.`);

  const todos = await new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.round(Math.random()) === 1) {
        resolve(dbData);
      } else {
        reject('There was a problem');
      }
    }, 500);
  });
  return todos;
}

export default queryTodos;

