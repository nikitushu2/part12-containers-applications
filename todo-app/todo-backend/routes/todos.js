const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('redis');
const { getAsync, setAsync } = require('../redis');


/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

router.get('/statistics', async (_, res) => {
  const count = await getAsync('todo_counter') || 0;
  res.json({ added_todos: Number(count) });
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  await setAsync('todo_counter', await getAsync('todo_counter') + 1);

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.json(req.todo); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body;

  req.todo.text = text;
  req.todo.done = done;

  await req.todo.save();
  res.json(req.todo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
