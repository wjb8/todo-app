const { db } = require("../util/admin");

exports.getAllTodos = (req, res) => {
  db.collection("todos")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let todos = [];
      data.forEach((doc) => {
        todos.push({
          todoId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(todos);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.postOneTodo = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Must not be empty" });
  }

  if (req.body.title.trim() === "") {
    return res.status(400).json({ body: "Must not be empty" });
  }

  const newTodoItem = {
    title: req.body.title,
    body: req.body.body,
    createdAt: new Date().toISOString()
  };
  db.collection("todos")
    .add(newTodoItem)
    .then((doc) => {
      const resTodoItem = newTodoItem;
      resTodoItem.id = doc.id;
      return res.json(resTodoItem);
    });
};

exports.deleteTodo = (req, res) => {
  const document = db.doc(`/todos/${req.params.todoId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Todo not found" });
      }
      return document.delete();
    })
    .then(() => {
      res.json({ message: "Delete successful" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.editTodo = (req, res) => {
  if (req.body.todoId || req.body.createdAt) {
    res.status(403).json({ message: "Not allowed to edit" });
  }
  let document = db.collection("todos").doc(`${req.params.todoId}`);
  document
    .update(req.body)
    .then(() => {
      res.json({ message: "Updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err.code
      });
    });
};
