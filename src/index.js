const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// Concluido
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const userFinded = users.find((user) => user.username === username);

  if (!userFinded) return response.status(400).jso({ error: "User dosent exists" })

  request.user = userFinded;
  next()
}

// Concluido
app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userExist = users.find((user) => user.name === name && user.username === username);

  if (userExist) return response.status(400).json({ error: "User already exists" });

  const user = { id: uuidv4(), name, username, todos: [] };

  users.push(user);
  return response.status(201).json(user);
});

// Concluido
app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos)
});

// Concluido
app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    deadline,
    done: false,
    created_at: new Date()
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

// Concluido
app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params
  const { title, deadline } = request.body;

  const todoFinded = user.todos.find((todo) => todo.id === id);

  if (!todoFinded) return response.status(400).json({ error: 'Todo not found' });

  todoFinded.title = title;
  todoFinded.deadline = new Date(deadline);

  return response.json(todoFinded);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
