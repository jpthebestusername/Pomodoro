let timer;
let isPaused = false;
let isBreakTime = false;

const STATIC_MIN = 25;
const STATIC_SEC = 0;
const BREAK_MIN = 5;

const pomodoroSound = new Audio("ringbell.mp3");

let minutes = STATIC_MIN;
let seconds = STATIC_SEC;
let tasks = [];
let selectedTaskIndex = -1;

const taskList = document.getElementById("task-list");
const timerElement = document.getElementById("timer");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const stopBtn = document.getElementById("stop-btn");
const continueBtn = document.getElementById("continue-btn");

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
stopBtn.addEventListener("click", stopTimer);
continueBtn.addEventListener("click", continueTimer);

// Adicionar tarefa
document.getElementById("add-task-btn").addEventListener("click", addTask);

// Música YouTube
document.getElementById("play-music-btn").addEventListener("click", playMusic);
document.getElementById("toggle-player-btn").addEventListener("click", togglePlayer);

// FUNÇÕES PRINCIPAIS
function startTimer() {
  if (selectedTaskIndex < 0) {
    return updateSelectedTaskName("Nenhuma tarefa selecionada");
  }

  if (timer || isPaused) return; // Já rodando ou pausado, não faz nada

  isBreakTime = false;
  isPaused = false;
  runTimer();
}

function continueTimer() {
  if (!isPaused) return;
  isPaused = false;
  runTimer();
}

function pauseTimer() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
  isPaused = true;
  updateSelectedTaskName("Timer pausado");
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
  isPaused = false;
  isBreakTime = false;
  minutes = STATIC_MIN;
  seconds = STATIC_SEC;
  updateTimer();
}

// INICIAR INTERVALO
function runTimer() {
  timer = setInterval(() => {
    if (minutes === 0 && seconds === 0) {
      clearInterval(timer);
      timer = null;
      pomodoroSound.play();

      if (!isBreakTime) {
        alert("Pomodoro completo! Hora da pausa 😌");
        isBreakTime = true;
        minutes = BREAK_MIN;
        seconds = 0;
        updateSelectedTaskName("⏸️ Pausa de 5 minutos");
        runTimer();
      } else {
        alert("Pausa finalizada! Volte ao trabalho 💪");
        isBreakTime = false;
        minutes = STATIC_MIN;
        seconds = STATIC_SEC;
        updateSelectedTaskName("Tarefa: " + tasks[selectedTaskIndex]);
        updateTimer();
      }
    } else {
      if (seconds === 0) {
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
      updateTimer();
    }
  }, 1000);
}

// ATUALIZAR TIMER NA TELA
function updateTimer() {
  timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const selectedTaskName = tasks[selectedTaskIndex]
    ? `Tarefa: ${tasks[selectedTaskIndex]}`
    : "Nenhuma tarefa selecionada";

  updateSelectedTaskName(selectedTaskName);
}

// ATUALIZAR NOME
function updateSelectedTaskName(value) {
  document.getElementById("selected-task-name").textContent = value;
}

// TAREFAS
function addTask() {
  const taskInput = document.getElementById("new-task");
  const taskName = taskInput.value.trim();
  if (!taskName) return;
  tasks.push(taskName);
  taskInput.value = "";
  updateTaskList();
}

function updateTaskList() {
  taskList.innerHTML = "";
  tasks.map((value, index) => createTaskHtml(value, index));
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

  taskItem.addEventListener("click", () => selectTask(index));

  const button = document.createElement("button");
  button.textContent = "🗑️";
  button.classList.add("delete-btn");
  button.onclick = () => deleteTask(index);

  taskItem.appendChild(button);
  taskList.appendChild(taskItem);
}

function deleteTask(index) {
  tasks.splice(index, 1);
  if (index === selectedTaskIndex) selectedTaskIndex = -1;
  updateTaskList();
}

function selectTask(index) {
  if (selectedTaskIndex !== index) {
    selectedTaskIndex = index;
    updateTaskList();
  }
}

// 🎵 PLAYER YOUTUBE
function playMusic() {
  const urlInput = document.getElementById("music-url").value.trim();
  if (!urlInput) return;

  const videoId = extractYouTubeVideoId(urlInput);
  if (!videoId) {
    alert("URL inválida. Tente de novo 🧠");
    return;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  const player = document.getElementById("music-player");
  player.innerHTML = `<iframe width="300" height="170" src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
}

function extractYouTubeVideoId(url) {
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

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
