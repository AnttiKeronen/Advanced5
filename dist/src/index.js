"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./models/user");
const app = (0, express_1.default)();
const PORT = 3000;
const MONGO_URI = "mongodb://127.0.0.1:27017/poemdb";
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));
app.post("/add", async (req, res) => {
    const { name, todo } = req.body;
    if (!name || !todo) {
        return res.status(400).send("Pakotan antaa molemmat");
    }
    const user = await user_1.User.findOne({
        name: new RegExp(`^${name}$`, "i")
    });
    if (user) {
        user.todos.push({ todo, checked: false });
        await user.save();
    }
    else {
        await user_1.User.create({
            name,
            todos: [{ todo, checked: false }]
        });
    }
    return res.send("Onnistuit!");
});
app.get("/todos/:id", async (req, res) => {
    const name = req.params.id;
    const user = await user_1.User.findOne({
        name: new RegExp(`^${name}$`, "i")
    });
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.json(user);
});
app.put("/update", async (req, res) => {
    const { name, todo } = req.body;
    const user = await user_1.User.findOne({
        name: new RegExp(`^${name}$`, "i")
    });
    if (!user)
        return res.status(404).send("Ei löy y");
    const index = user.todos.findIndex((t) => t.todo === todo);
    if (index === -1)
        return res.status(404).send("Ei löy y");
    user.todos.splice(index, 1);
    await user.save();
    res.send("Poistettu");
});
app.put("/updateTodo", async (req, res) => {
    const { name, todo, checked } = req.body;
    const user = await user_1.User.findOne({
        name: new RegExp(`^${name}$`, "i")
    });
    if (!user)
        return res.status(404).send("Ei löy y");
    const item = user.todos.find((t) => t.todo === todo);
    if (!item)
        return res.status(404).send("Ei löy y");
    item.checked = checked;
    await user.save();
    res.send("Onnistuit");
});
app.delete("/delete", async (req, res) => {
    const { name } = req.body;
    const deleted = await user_1.User.findOneAndDelete({
        name: new RegExp(`^${name}$`, "i")
    });
    if (!deleted)
        return res.status(404).send("Ei löy y");
    res.send("Onnistuit");
});
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
//# sourceMappingURL=index.js.map