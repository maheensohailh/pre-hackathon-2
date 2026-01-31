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

// Simple Task Inputs
const taskTitle = document.getElementById("taskTitle");
const taskDesc = document.getElementById("taskDesc");

// Resume Inputs
const fullName = document.getElementById("fullName");
const taskEmail = document.getElementById("taskemail");
const taskPhone = document.getElementById("taskphone");
const taskAddress = document.getElementById("taskaddress");
const taskSummary = document.getElementById("tasksummary");
const taskSkills = document.getElementById("taskskills");
const taskProjects = document.getElementById("taskprojects");

const addTaskBtn = document.getElementById("addTaskBtn");
const updateTaskBtn = document.getElementById("updateTaskBtn");

const myTasksBtn = document.getElementById("myTasksBtn");
const allTasksBtn = document.getElementById("allTasksBtn");
const logoutBtn = document.getElementById("logout-btn");

let editingTaskId = null;

// Logout
logoutBtn.onclick = () => signOut(auth);

// Load tasks/resumes
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

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-start bg-dark text-white mb-4";

    li.innerHTML = `
      <div>
        <strong>${t.title || t.name}</strong><br>
        ${t.description ? `<p>${t.description}</p>` : ""}
        ${t.email ? `Email: ${t.email}<br>` : ""}
        ${t.phone ? `Phone: ${t.phone}<br>` : ""}
        ${t.address ? `Address: ${t.address}<br>` : ""}
        ${t.summary ? `Summary: ${t.summary}<br>` : ""}
        ${t.skills ? `Skills: ${t.skills.join(", ")}<br>` : ""}
        ${t.projects ? `Projects: ${t.projects.join(", ")}` : ""}
        <small>User: ${userName}</small>
      </div>
      ${
        t.uid === auth.currentUser.uid
          ? `<div>
               <button class="btn btn-outline-primary fw-bold me-1 edit-btn">Edit</button>
               <button class="btn btn-sm btn-outline-danger fw-bold delete-btn">X</button>
               <button class="btn btn-sm btn-outline-success fw-bold download-btn">Download</button>
             </div>`
          : ""
      }
    `;

    taskList.appendChild(li);

    if (t.uid === auth.currentUser.uid) {
      const editBtn = li.querySelector(".edit-btn");
      editBtn.onclick = () => {
        editingTaskId = d.id;

        // Fill Simple Task Inputs
        taskTitle.value = t.title || "";
        taskDesc.value = t.description || "";

        // Fill Resume Inputs
        fullName.value = t.name || "";
        taskEmail.value = t.email || "";
        taskPhone.value = t.phone || "";
        taskAddress.value = t.address || "";
        taskSummary.value = t.summary || "";
        taskSkills.value = t.skills ? t.skills.join(", ") : "";
        taskProjects.value = t.projects ? t.projects.join(", ") : "";

        addTaskBtn.classList.add("d-none");
        updateTaskBtn.classList.remove("d-none");
      };

      const deleteBtn = li.querySelector(".delete-btn");
      deleteBtn.onclick = async () => {
        await deleteDoc(doc(db, "tasks", d.id));
        loadTasks(false);
      };

      const downloadBtn = li.querySelector(".download-btn");
      downloadBtn.onclick = () => {
        let content = "";
        if (t.title) content += `Title: ${t.title}\nDescription: ${t.description || ""}\n`;
        if (t.name) {
          content += `Name: ${t.name}\nEmail: ${t.email || ""}\nPhone: ${t.phone || ""}\nAddress: ${t.address || ""}\nSummary: ${t.summary || ""}\nSkills: ${t.skills ? t.skills.join(", ") : ""}\nProjects: ${t.projects ? t.projects.join(", ") : ""}`;
        }

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${t.title || t.name}.txt`;
        a.click();

        URL.revokeObjectURL(url);
      };
    }
  });
};

// Add / Save
addTaskBtn.onclick = async () => {
  // Prefer resume inputs if filled
  let data;
  if (fullName.value || taskEmail.value) {
    data = {
      uid: auth.currentUser.uid,
      name: fullName.value,
      email: taskEmail.value,
      phone: taskPhone.value,
      address: taskAddress.value,
      summary: taskSummary.value,
      skills: taskSkills.value.split(",").map(s => s.trim()),
      projects: taskProjects.value.split(",").map(s => s.trim()),
      createdAt: serverTimestamp(),
    };
  } else {
    data = {
      uid: auth.currentUser.uid,
      title: taskTitle.value,
      description: taskDesc.value,
      createdAt: serverTimestamp(),
    };
  }

  if (!data.title && !data.name) {
    alert("Please enter a task or resume name");
    return;
  }

  await addDoc(collection(db, "tasks"), data);

  // Clear inputs
  taskTitle.value = "";
  taskDesc.value = "";
  fullName.value = "";
  taskEmail.value = "";
  taskPhone.value = "";
  taskAddress.value = "";
  taskSummary.value = "";
  taskSkills.value = "";
  taskProjects.value = "";

  loadTasks(false);
};

// Update
updateTaskBtn.onclick = async () => {
  if (!editingTaskId) return;

  let data;
  if (fullName.value || taskEmail.value) {
    data = {
      name: fullName.value,
      email: taskEmail.value,
      phone: taskPhone.value,
      address: taskAddress.value,
      summary: taskSummary.value,
      skills: taskSkills.value.split(",").map(s => s.trim()),
      projects: taskProjects.value.split(",").map(s => s.trim()),
    };
  } else {
    data = {
      title: taskTitle.value,
      description: taskDesc.value,
    };
  }

  await updateDoc(doc(db, "tasks", editingTaskId), data);

  // Clear inputs
  taskTitle.value = "";
  taskDesc.value = "";
  fullName.value = "";
  taskEmail.value = "";
  taskPhone.value = "";
  taskAddress.value = "";
  taskSummary.value = "";
  taskSkills.value = "";
  taskProjects.value = "";

  editingTaskId = null;
  addTaskBtn.classList.remove("d-none");
  updateTaskBtn.classList.add("d-none");

  loadTasks(false);
};

// Toggle buttons
myTasksBtn.onclick = () => loadTasks(false);
allTasksBtn.onclick = () => loadTasks(true);

// Initial load
setTimeout(() => loadTasks(false), 500);
