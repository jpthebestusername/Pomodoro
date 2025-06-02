let timer;

const STATIC_MIN = 25;
const STATIC_SEC = 0;

let minutes = STATIC_MIN;
let seconds = STATIC_SEC;
let tasks = [];
let selectedTaskIndex = -1;

const taskList =
  document.getElementById("task-list");

document
  .getElementById("add-task-btn")
  .addEventListener("click", addTask);

document
  .getElementById("start-btn")
  .addEventListener("click", startTimer);

document
  .getElementById("stop-btn")
  .addEventListener("click", stopTimer);

function addTask() {
  const taskInput =
    document.getElementById("new-task");

  const taskName = taskInput.value.trim();

  if (!taskName) return;

  tasks.push(taskName);
  taskInput.value = "";
  updateTaskList();
}

function updateTaskList() {
  taskList.innerHTML = "";

  tasks.map((value, index) => {
    createTaskHtml(value, index);
  });
}

function createTaskHtml(task, index) {
  const taskItem = document.createElement("div");
  const p = document.createElement("p");

  p.innerText = task;

  taskItem.appendChild(p);
  taskItem.classList.add("task-item");

  if (selectedTaskIndex === index) {
    taskItem.classList.add("selected-task");
  }

  taskItem.addEventListener("click", () => {
    selectTask(index);
  });

  const button = document.createElement("button");

  button.textContent = "🗑️";

  button.classList.add("delete-btn");

  button.onclick = () => deleteTask(index);

  taskItem.appendChild(button);

  taskList.appendChild(taskItem);
}

function deleteTask(index) {
  tasks.splice(index, 1);
  updateTaskList();

  if (tasks.length == 0) {
    // stop timer!
  }
}

function selectTask(index) {
  if (selectedTaskIndex !== index) {
    selectedTaskIndex = index;
    updateTaskList();
  }
}

// start timer

function updateSelectedTaskName(value) {
  document.getElementById(
    "selected-task-name"
  ).textContent = value;
}

function startTimer() {
  if (selectedTaskIndex < 0) {
    return updateSelectedTaskName(
      "Nehuma Tarefa Selecionada"
    );
  }

  timer = setInterval(() => {
    if (minutes === 0 && seconds === 0) {
      // done
      clearInterval(timer);
      const message =
        "Pomodoro session compleated! take a break.";
      alert(message);

      minutes = STATIC_MIN;
      seconds = STATIC_SEC;
      // update timer
    } else if (seconds === 0) {
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    updateTimer();
  }, 1000);
}
function updateTimer() {
  const timerElement =
    document.getElementById("timer");

  timerElement.textContent = `
    ${minutes
      .toString()
      .padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}
    `;

  const selectedTaskName = tasks[
    selectedTaskIndex
  ]
    ? `Tarefa Selecionada: ${tasks[selectedTaskIndex]}`
    : "Nenhuma Tarefa Selecionada";

  updateSelectedTaskName(selectedTaskName);
}

function stopTimer() {
  clearInterval(timer);
  minutes = STATIC_MIN;
  seconds = STATIC_SEC;
  updateTimer();
}
// 🎵 Música YouTube
document.getElementById("play-music-btn").addEventListener("click", playMusic);

function playMusic() {
  const urlInput = document.getElementById("music-url").value.trim();
  
  if (!urlInput) return;

  const videoId = extractYouTubeVideoId(urlInput);
  
  if (!videoId) {
    alert("URL inválida. Por favor, insira um link válido do YouTube.");
    return;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  const player = document.getElementById("music-player");
  player.innerHTML = `<iframe width="300" height="170" src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}

function extractYouTubeVideoId(url) {
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
document.getElementById("toggle-player-btn").addEventListener("click", togglePlayer);

function togglePlayer() {
  const player = document.getElementById("music-player");
  const toggleBtn = document.getElementById("toggle-player-btn");
  
  if (player.style.display === "none") {
    player.style.display = "block";
    toggleBtn.textContent = "🙈 Ocultar Player";
  } else {
    player.style.display = "none";
    toggleBtn.textContent = "👀 Mostrar Player";
  }
}

// 🎵 Música YouTube
document.getElementById("play-music-btn").addEventListener("click", playMusic);

function playMusic() {
  const urlInput = document.getElementById("music-url").value.trim();
  
  if (!urlInput) return;

  const videoId = extractYouTubeVideoId(urlInput);
  
  if (!videoId) {
    alert("URL inválida. Por favor, insira um link válido do YouTube.");
    return;
  }

  // Usar mute=1 para evitar bloqueio de autoplay
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&mute=1`;

  const player = document.getElementById("music-player");
  player.style.display = "block";
  document.getElementById("toggle-player-btn").textContent = "🙈 Ocultar Player";

  player.innerHTML = `<iframe width="300" height="170" src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}

function extractYouTubeVideoId(url) {
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
let isPaused = false;

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const stopBtn = document.getElementById("stop-btn");

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
stopBtn.addEventListener("click", stopTimer);

function startTimer() {
  if (selectedTaskIndex < 0) {
    return updateSelectedTaskName("Nenhuma tarefa selecionada");
  }

  if (timer && !isPaused) return; // Evita reiniciar se já tá rodando

  isPaused = false;

  timer = setInterval(() => {
    if (minutes === 0 && seconds === 0) {
      clearInterval(timer);
      alert("Pomodoro session completada! Faça uma pausa.");
      minutes = STATIC_MIN;
      seconds = STATIC_SEC;
      updateTimer();
    } else if (seconds === 0) {
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    updateTimer();
  }, 1000);
}

function pauseTimer() {
  if (!timer) return; // Não faz nada se timer não tá ativo

  if (!isPaused) {
    clearInterval(timer);
    isPaused = true;
    updateSelectedTaskName("Timer pausado");
  }
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
  isPaused = false;
  minutes = STATIC_MIN;
  seconds = STATIC_SEC;
  updateTimer();
}

