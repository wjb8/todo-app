exports.getAllTodos = (req, res) => {
  todos = [
    {
      id: "1",
      title: "greeting",
      body: "Hello world from sharvin shah"
    },
    {
      id: "2",
      title: "greeting2",
      body: "Hello2 world2 from sharvin shah"
    }
  ];
  return res.json(todos);
};
