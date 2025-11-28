const todoForm = document.getElementById("todoForm");
const userInput = document.getElementById("userInput");
const todoInput = document.getElementById("todoInput");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const deleteUserButton = document.getElementById("deleteUser");
const todoList = document.getElementById("todoList");
const messageElement = document.getElementById("message");
let currentUserName = null;
function showMessage(text) {
  messageElement.textContent = text;
}
function renderTodos(user) {
  todoList.innerHTML = "";
  if (!user || !user.todos || user.todos.length === 0) {
    todoList.innerHTML = "<li class='collection-item'>No todos.</li>";
    return;
  }
  user.todos.forEach((todoObj) => {
    const li = document.createElement("li");
    li.classList.add("collection-item");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "myCheckbox"; 
    checkbox.classList.add("checkBoxes");
    checkbox.checked = todoObj.checked;
    checkbox.addEventListener("change", async () => {
      try {
        const res = await fetch("/updateTodo", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: currentUserName,
            todo: todoObj.todo,
            checked: checkbox.checked
          })
        });
        const text = await res.text();
        showMessage(text);
      } catch (err) {
        console.error(err);
        showMessage("Errori");
      }
    });
    const span = document.createElement("span");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = todoObj.todo;
    a.classList.add("delete-task");
    a.dataset.todo = todoObj.todo;
    a.addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        const res = await fetch("/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: currentUserName,
            todo: todoObj.todo
          })
        });
        const text = await res.text();
        showMessage(text);
        if (res.ok) fetchUserTodos(currentUserName);
      } catch (err) {
        console.error(err);
        showMessage("Errori");
      }
    });
    span.appendChild(a);
    label.appendChild(checkbox);
    label.appendChild(span);
    li.appendChild(label);
    todoList.appendChild(li);
  });
}
todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = userInput.value.trim();
  const todo = todoInput.value.trim();
  if (!name || !todo) {
    showMessage("Anna molemmat");
    return;
  }
  try {
    const res = await fetch("/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, todo })
    });
    const text = await res.text();
    showMessage(text);
    if (
      res.ok &&
      currentUserName &&
      currentUserName.toLowerCase() === name.toLowerCase()
    ) {
      fetchUserTodos(currentUserName);
    }
    todoInput.value = "";
  } catch (err) {
    console.error(err);
    showMessage("Errori");
  }
});
async function fetchUserTodos(name) {
  try {
    const res = await fetch(`/todos/${encodeURIComponent(name)}`);
    if (!res.ok) {
      showMessage(await res.text());
      todoList.innerHTML = "";
      deleteUserButton.style.display = "none";
      currentUserName = null;
      return;
    }
    const user = await res.json();
    currentUserName = user.name;

    showMessage("Todos for " + user.name + ":");
    renderTodos(user);
    deleteUserButton.style.display = "inline-block";
  } catch (err) {
    console.error(err);
    showMessage("Errori");
  }
}
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = searchInput.value.trim();
  if (!name) return showMessage("Enter a user name");
  fetchUserTodos(name);
});
deleteUserButton.addEventListener("click", async () => {
  if (!currentUserName) return;
  try {
    const res = await fetch("/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: currentUserName })
    });
    const text = await res.text();
    showMessage(text);
    if (res.ok) {
      todoList.innerHTML = "";
      deleteUserButton.style.display = "none";
      currentUserName = null;
    }
  } catch (err) {
    console.error(err);
    showMessage("Errori");
  }
});
