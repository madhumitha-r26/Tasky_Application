const state = {
  taskList: [],
};

const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal__body");

// Add task
const htmlTaskContent = ({ id, title, description, type, url }) => `
  <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
    <div class='card shadow-sm task__card'>
      <div class='card-header d-flex justify-content-end task__card__header'>
        <button type='button' class='btn btn-primary mr-1.5' name='${id}' onclick='editTask.apply(this, arguments)'>
          <i class='fa fa-pencil' name='${id}'></i>
        </button>
        <button type='button' class='btn btn-danger mr-1.5' name='${id}' onclick='deleteTask.apply(this, arguments)'>
          <i class='fa fa-trash' name='${id}'></i>
        </button>
      </div>

      <div class='card-body'>
        ${url ? `<img width='100%' src='${url}' alt='Card Image' class='card-img-top md-3'>` : ""}
        <h4 class='card-title task__card__title'>${title}</h4>
        <p class='description trim-3 lines'>${description}</p>
        <div class='tags text-white d-flex flex-wrap'>
          <span class='badge bg-primary m-1'>${type}</span>
        </div>
      </div>

      <div class='card-body'>
        <button type='button' class='btn btn-outline-primary float-right' data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="openTask.apply(this, arguments)" id=${id}>Open Task</button>
      </div>
    </div>
  </div>
`;

const htmlModalContent = ({ id, title, description, url }) => {
  const date = new Date(parseInt(id));
  return `
    <div id=${id}>
      ${url ? `<img width='100%' src='${url}' alt='Card Image' class='img-fluid place__holder__image mb-3'/>` : ""}
      <strong class='text-muted text-sm'>Created on: ${date.toDateString()}</strong>
      <h2 class='my-3'>${title}</h2>
      <p class='text-muted'>${description}</p>
    </div>
  `;
};

const updateLocalStorage = () => {
  localStorage.setItem("tasky", JSON.stringify({ tasks: state.taskList }));
};

const loadInitialData = () => {
  const localStorageCopy = JSON.parse(localStorage.getItem("tasky"));
  if (localStorageCopy) state.taskList = localStorageCopy.tasks;
  state.taskList.forEach((cardData) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
  });
};

// Save task
const handleSubmit = (event) => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("imageUrl").value,
    title: document.getElementById("taskTitle").value,
    type: document.getElementById("taskType").value,
    description: document.getElementById("taskDescription").value,
  };

  if (input.title === "" || input.type === "" || input.description === "") 
  {
    alert("Please fill all fields");
    return;
  }

  taskContents.insertAdjacentHTML("beforeend", htmlTaskContent({ ...input, id }));
  state.taskList.push({ ...input, id });
  updateLocalStorage();
};

loadInitialData();

// Open task
const openTask = (e) => {
  if (!e) e = window.event;

  const getTask = state.taskList.find(({ id }) => id === e.target.id);
  taskModal.innerHTML = htmlModalContent(getTask);
};

// Delete task
const deleteTask = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.getAttribute("name");
  const type = e.target.tagName;

  const removeTask = state.taskList.filter(({ id }) => id !== targetId);
  state.taskList = removeTask;
  updateLocalStorage();

  if (type === 'BUTTON') {
    return e.target.closest(".col-md-6").remove();
  } else if (type === "I") {
    return e.target.closest(".col-md-6").remove();
  }
};

// Edit task
const editTask = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.getAttribute("name");

  const parentNode = e.target.closest(".task__card");

  const taskTitle = parentNode.querySelector(".task__card__title");
  const taskDescription = parentNode.querySelector(".description");
  const taskType = parentNode.querySelector(".badge");
  const submitButton = parentNode.querySelector(".btn-outline-primary");

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");

  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};

// Save edit
const saveEdit = (e) => {
  if (!e) e = window.event;
  const targetId = e.target.id;
  const parentNode = e.target.closest(".task__card");

  const taskTitle = parentNode.querySelector(".task__card__title");
  const taskDescription = parentNode.querySelector(".description");
  const taskType = parentNode.querySelector(".badge");

  const updateData = {
    title: taskTitle.innerHTML,
    description: taskDescription.innerHTML,
    type: taskType.innerHTML,
  };

  const stateCopy = state.taskList.map((task) =>
    task.id === targetId
      ? {
          ...task,
          title: updateData.title,
          description: updateData.description,
          type: updateData.type,
        }
      : task
  );

  state.taskList = stateCopy;
  updateLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");

  const submitButton = e.target;
  submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#exampleModal");
  submitButton.innerHTML = "Open Task";
};

// Search task
const searchTask = (e) => {
  if (!e) e = window.event;

  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }

  const resultData = state.taskList.filter(({ title }) =>
    title.toLowerCase().includes(e.target.value.toLowerCase())
  );

  resultData.forEach((cardData) =>
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData))
  );
};
