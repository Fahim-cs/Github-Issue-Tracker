const container = document.getElementById("issuesContainer");
let allIssues = [];

async function loadIssues() {
  const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
  const data = await res.json();

  allIssues = data.data;
  updateCounts(allIssues);
  displayIssues(allIssues);
}

loadIssues();
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = allIssues.filter(issue =>
    issue.title.toLowerCase().includes(value) ||
    issue.description.toLowerCase().includes(value) ||
    issue.author.toLowerCase().includes(value)
  );

  updateCounts(filtered);
  displayIssues(filtered);
});

function displayIssues(issues) {
  container.innerHTML = "";

  issues.forEach(issue => {
    const div = document.createElement("div");

    const isOpen = issue.status.toLowerCase().trim() === "open";
    const borderColor = isOpen ? "border-green-500" : "border-purple-500";

    let priorityColor = "bg-gray-100 text-gray-500";
    if (issue.priority === "high") priorityColor = "bg-red-100 text-red-500";
    if (issue.priority === "medium") priorityColor = "bg-yellow-100 text-yellow-600";

    const statusIcon = isOpen
      ? "assets/Open-Status.png"
      : "assets/Closed- Status .png";

    div.className = `bg-white p-4 rounded-xl shadow-sm border-t-4 ${borderColor}`;

    div.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <img src="${statusIcon}" class="w-4 h-4" />

        <span class="text-xs px-2 py-1 rounded-full ${priorityColor}">
          ${issue.priority ? issue.priority.toUpperCase() : "N/A"}
        </span>
      </div>

      <h2 class="font-semibold text-sm mb-1">${issue.title}</h2>
      <p class="text-xs text-gray-500 mb-3">${issue.description}</p>

      <div class="text-xs text-gray-400">
        <p>#${issue.id} by ${issue.author}</p>
        <p>${issue.createdAt}</p>
      </div>
    `;

    div.onclick = () => openModal(issue);

    container.appendChild(div);
  });
}

function updateCounts(issues) {
  const total = issues.length;
  const open = issues.filter(i => i.status === "open").length;
  const closed = issues.filter(i => i.status === "closed").length;

  document.getElementById("issueCount").innerText = `${total} Issues`;
  document.getElementById("openCount").innerText = `Open (${open})`;
  document.getElementById("closedCount").innerText = `Closed (${closed})`;
}

const allTab = document.getElementById("allTab");
const openTab = document.getElementById("openTab");
const closedTab = document.getElementById("closedTab");

function setActive(btn) {
  [allTab, openTab, closedTab].forEach(b => {
    b.classList.remove("btn-primary");
    b.classList.add("btn-ghost");
  });
  btn.classList.add("btn-primary");
}

allTab.onclick = () => {
  setActive(allTab);
  updateCounts(allIssues);
  displayIssues(allIssues);
};

openTab.onclick = () => {
  const open = allIssues.filter(i => i.status === "open");
  setActive(openTab);
  updateCounts(open);
  displayIssues(open);
};

closedTab.onclick = () => {
  const closed = allIssues.filter(i => i.status === "closed");
  setActive(closedTab);
  updateCounts(closed);
  displayIssues(closed);
};

function createIssue() {

  const title = document.getElementById("newTitle").value;
  const description = document.getElementById("newDesc").value;
  const status = document.getElementById("newStatus").value;
  const priority = document.getElementById("newPriority").value;
  const label = document.getElementById("newLabel").value;

  if (!title || !description) {
    alert("Please fill all required fields");
    return;
  }

  const newIssue = {
    id: allIssues.length + 1,
    title,
    description,
    status,
    priority,
    label,
    author: "You",
    createdAt: new Date().toLocaleDateString()
  };

  // Add to array
  allIssues.unshift(newIssue);

  // Update UI
  updateCounts(allIssues);
  displayIssues(allIssues);

  // Close modal
  document.getElementById("newIssueModal").close();

  // Reset form
  document.getElementById("newTitle").value = "";
  document.getElementById("newDesc").value = "";
  document.getElementById("newLabel").value = "";
}

function openModal(issue) {
  const isOpen = issue.status === "open";

  document.getElementById("modalTitle").innerText = issue.title;

  const statusEl = document.getElementById("modalStatus");
  statusEl.innerText = isOpen ? "Opened" : "Closed";
  statusEl.className = `px-2 py-1 rounded text-xs ${isOpen ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"}`;

  document.getElementById("modalMeta").innerText = `Opened by ${issue.author} • ${issue.createdAt}`;

  const labelsContainer = document.getElementById("modalLabels");
  labelsContainer.innerHTML = "";

  if (issue.label) {
    let labelClass = "bg-gray-100 text-gray-600";

    if (issue.label === "bug") labelClass = "bg-red-100 text-red-500";
    if (issue.label === "help wanted") labelClass = "bg-yellow-100 text-yellow-600";
    if (issue.label === "enhancement") labelClass = "bg-green-100 text-green-600";

    labelsContainer.innerHTML = `<span class="text-xs px-2 py-1 rounded-full ${labelClass}">${issue.label.toUpperCase()}</span>`;
  }

  document.getElementById("modalDesc").innerText = issue.description;
  document.getElementById("modalAuthor").innerText = issue.author;

  const priorityEl = document.getElementById("modalPriority");

  let priorityClass = "bg-gray-100 text-gray-500";
  if (issue.priority === "high") priorityClass = "bg-red-100 text-red-500";
  if (issue.priority === "medium") priorityClass = "bg-yellow-100 text-yellow-600";

  priorityEl.className = `text-xs px-2 py-1 rounded-full ${priorityClass}`;
  priorityEl.innerText = issue.priority ? issue.priority.toUpperCase() : "N/A";

  document.getElementById("issueModal").showModal();
}