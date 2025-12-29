import {
  auth,
  db,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  getDoc,
  signOut,
} from "../firebase.config.js";

const taskList = document.getElementById("taskList");
const taskTitle = document.getElementById("taskTitle");
const taskDesc = document.getElementById("taskDesc");
const addTaskBtn = document.getElementById("addTaskBtn");
const updateTaskBtn = document.getElementById("updateTaskBtn");

const myTasksBtn = document.getElementById("myTasksBtn");
const allTasksBtn = document.getElementById("allTasksBtn");
const logoutBtn = document.getElementById("logout-btn");

let editingTaskId = null;

// Logout
logoutBtn.onclick = () => signOut(auth);

// Load tasks function
const loadTasks = async (showAll = false) => {
  taskList.innerHTML = "";

  let q;
  if (showAll) {
    q = collection(db, "tasks");
  } else {
    q = query(collection(db, "tasks"), where("uid", "==", auth.currentUser.uid));
  }

  const snap = await getDocs(q);

  snap.forEach(async (d) => {
    const t = d.data();
    let userName = "Unknown";

    try {
      const userSnap = await getDoc(doc(db, "users", t.uid));
      if (userSnap.exists()) userName = userSnap.data().name;
    } catch (e) {
      console.log(e);
    }

    taskList.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-start bg-dark text-white mb-4">
        <div>
          <strong>${t.title}</strong>
          <p class="mb-1 mt-1 text-white">${t.description}</p>
          <small>User: ${userName}</small>
        </div>
        ${
          t.uid === auth.currentUser.uid
            ? `
              <div>
                <button class="btn btn-outline-primary fw-bold me-1" onclick="editTask('${d.id}', '${t.title}', '${t.description}')">Edit</button>
                <button class="btn btn-sm btn-outline-danger fw-bold" onclick="deleteTask('${d.id}')">X</button>
              </div>
            `
            : ""
        }
      </li>
    `;
  });
};

// Add task
addTaskBtn.onclick = async () => {
  if (!taskTitle.value || !taskDesc.value) {
    alert("Please enter title & description");
    return;
  }

  await addDoc(collection(db, "tasks"), {
    uid: auth.currentUser.uid,
    title: taskTitle.value,
    description: taskDesc.value,
    createdAt: serverTimestamp(),
  });

  taskTitle.value = "";
  taskDesc.value = "";
  loadTasks(false);
};

// Delete task
window.deleteTask = async (id) => {
  await deleteDoc(doc(db, "tasks", id));
  loadTasks(false);
};

// Edit task
window.editTask = (id, title, description) => {
  editingTaskId = id;
  taskTitle.value = title;
  taskDesc.value = description;
  addTaskBtn.classList.add("d-none");
  updateTaskBtn.classList.remove("d-none");
};

// Update task
updateTaskBtn.onclick = async () => {
  if (!editingTaskId) return;

  const taskRef = doc(db, "tasks", editingTaskId);
  await updateDoc(taskRef, {
    title: taskTitle.value,
    description: taskDesc.value,
  });

  taskTitle.value = "";
  taskDesc.value = "";
  editingTaskId = null;
  addTaskBtn.classList.remove("d-none");
  updateTaskBtn.classList.add("d-none");

  loadTasks(false);
};

// Toggle buttons
myTasksBtn.onclick = () => loadTasks(false);
allTasksBtn.onclick = () => loadTasks(true);

// Load tasks after auth ready
setTimeout(() => loadTasks(false), 500);
