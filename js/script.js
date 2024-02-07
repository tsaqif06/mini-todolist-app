document.addEventListener("DOMContentLoaded", function () {
	const todos = [];
	const RENDER_EVENT = "render-todo";
	const SAVED_EVENT = "saved-todo";
	const STORAGE_KEY = "TODO_APPS";

	const isStorageExist = () => {
		if (typeof Storage === undefined) {
			alert("Browser kamu tidak mendukung local storage");
			return false;
		}
		return true;
	};

	const submitForm = document.getElementById("form");
	submitForm.addEventListener("submit", function (event) {
		event.preventDefault();
		addTodo();
	});

	const generateId = () => {
		return +new Date();
	};

	const generateTodoObject = (id, task, timestamp, isCompleted) => {
		return {
			id,
			task,
			timestamp,
			isCompleted,
		};
	};

	const addTodo = () => {
		const textTodo = document.getElementById("title").value;
		const timestamp = document.getElementById("date").value;

		const generatedID = generateId();
		const todoObject = generateTodoObject(
			generatedID,
			textTodo,
			timestamp,
			false
		);
		todos.push(todoObject);

		document.dispatchEvent(new Event(RENDER_EVENT));
		saveData();
	};

	document.addEventListener(RENDER_EVENT, function () {
		const uncompletedTODOList = document.getElementById("todos");
		const listCompleted = document.getElementById("completed-todos");

		// clearing list item
		uncompletedTODOList.innerHTML = "";
		listCompleted.innerHTML = "";

		for (const todoItem of todos) {
			const todoElement = makeTodo(todoItem);
			if (todoItem.isCompleted) {
				listCompleted.append(todoElement);
			} else {
				uncompletedTODOList.append(todoElement);
			}
		}
	});

	const makeTodo = (todoObject) => {
		const textTitle = document.createElement("h2");
		textTitle.innerText = todoObject.task;

		const textTimestamp = document.createElement("p");
		textTimestamp.innerText = todoObject.timestamp;

		const textContainer = document.createElement("div");
		textContainer.classList.add("inner");
		textContainer.append(textTitle, textTimestamp);

		const container = document.createElement("div");
		container.classList.add("item", "shadow");
		container.append(textContainer);
		container.setAttribute("id", `todo-${todoObject.id}`);

		if (todoObject.isCompleted) {
			const undoButton = document.createElement("button");
			undoButton.classList.add("undo-button");

			undoButton.addEventListener("click", function () {
				addOrUndoTask(todoObject.id, "undo");
			});

			const trashButton = document.createElement("button");
			trashButton.classList.add("trash-button");

			trashButton.addEventListener("click", function () {
				removeTaskFromCompleted(todoObject.id);
			});

			container.append(undoButton, trashButton);
		} else {
			const checkButton = document.createElement("button");
			checkButton.classList.add("check-button");

			checkButton.addEventListener("click", function () {
				addOrUndoTask(todoObject.id, "add");
			});

			container.append(checkButton);
		}

		return container;
	};

	const addOrUndoTask = (todoId, method) => {
		const todoTarget = findTodo(todoId);

		if (todoTarget == null) return;

		method == "add"
			? (todoTarget.isCompleted = true)
			: (todoTarget.isCompleted = false);

		document.dispatchEvent(new Event(RENDER_EVENT));
		saveData();
	};

	const removeTaskFromCompleted = (todoId) => {
		const todoTarget = findTodoIndex(todoId);

		if (todoTarget === -1) return;

		todos.splice(todoTarget, 1);
		document.dispatchEvent(new Event(RENDER_EVENT));
		saveData();
	};

	const findTodo = (todoId) => {
		for (const todoItem of todos) {
			if (todoItem.id === todoId) {
				return todoItem;
			}
		}
		return null;
	};

	const findTodoIndex = (todoId) => {
		for (const index in todos) {
			if (todos[index].id === todoId) {
				return index;
			}
		}
		return -1;
	};

	const saveData = () => {
		if (isStorageExist()) {
			const parsed = JSON.stringify(todos);
			localStorage.setItem(STORAGE_KEY, parsed);
			document.dispatchEvent(new Event(SAVED_EVENT));
		}
	};

	const loadDataFromStorage = () => {
		const serializedData = localStorage.getItem(STORAGE_KEY);
		let data = JSON.parse(serializedData);

		if (data !== null) {
			for (const todo of data) {
				todos.push(todo);
			}
		}

		document.dispatchEvent(new Event(RENDER_EVENT));
	};

	if (isStorageExist()) {
		loadDataFromStorage();
	}

	document.addEventListener(SAVED_EVENT, () => {
		console.log("Data berhasil di simpan.");
	});
});
