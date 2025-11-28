import express, { Request, Response } from "express";
import morgan from "morgan";
import path from "path";
import mongoose from "mongoose";
import { User, ITodo, IUser } from "./models/User";
const app = express();
const PORT = 3000;
const MONGO_URI = "mongodb://127.0.0.1:27017/testdb";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "..", "public")));
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err: unknown) => console.error(err));
app.post("/add", async (req: Request, res: Response) => {
  const { name, todo } = req.body;

  if (!name || !todo) {
    return res.status(400).send("Name and todo are required.");
  }
  const user = await User.findOne({
    name: new RegExp(`^${name}$`, "i")
  });

  if (user) {
    user.todos.push({ todo, checked: false });
    await user.save();
  } else {
    await User.create({
      name,
      todos: [{ todo, checked: false }]
    });
  }
  return res.send(`Todo added successfully for user ${name}.`);
});
app.get("/todos/:id", async (req: Request, res: Response) => {
  const name = req.params.id;

  const user = await User.findOne({
    name: new RegExp(`^${name}$`, "i")
  });
  if (!user) {
    return res.status(404).send("User not found");
  }
  return res.json(user);
});
app.put("/update", async (req: Request, res: Response) => {
  const { name, todo } = req.body;

  const user = await User.findOne({
    name: new RegExp(`^${name}$`, "i")
  });

  if (!user) return res.status(404).send("User not found");

  const index = user.todos.findIndex((t: ITodo) => t.todo === todo);

  if (index === -1) return res.status(404).send("Todo not found");

  user.todos.splice(index, 1);
  await user.save();

  return res.send("Todo deleted successfully.");
});
app.put("/updateTodo", async (req: Request, res: Response) => {
  const { name, todo, checked } = req.body;

  const user = await User.findOne({
    name: new RegExp(`^${name}$`, "i")
  });

  if (!user) return res.status(404).send("User not found");

  const item = user.todos.find((t: ITodo) => t.todo === todo);

  if (!item) return res.status(404).send("Todo not found");

  item.checked = Boolean(checked);
  await user.save();

  return res.send("Todo updated successfully.");
});

app.delete("/delete", async (req: Request, res: Response) => {
  const { name } = req.body;

  const deleted = await User.findOneAndDelete({
    name: new RegExp(`^${name}$`, "i")
  });

  if (!deleted) return res.status(404).send("User not found");

  return res.send("User deleted successfully.");
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
