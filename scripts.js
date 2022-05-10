/**
 *  Author: Deivid Francis <deividfrancisdeoliveira@gmail.com>
 *  Source: https://github.com/DeividFrancis/pos-pomodoro
 */

var MS_INTERVAL = 10;

var POMODORO_MINUTES = 25 * 60;
var SHORT_BREAK_MINUTES = 5 * 60;
var LONG_BREAK_MINUES = 15 * 60;
var POMODORO_QTD = 5;
var POMODORO_COUNT = 0;

var MINUTES_SELECTED;
var currentTimer;

var COLOR_POMODORO = "#D95550";
var COLOR_SHORT = "#4C9195";
var COLOR_LONG = "#457CA3";

var root = document.documentElement;

const timerTxt = document.querySelector(".timer-text");
const pomodoroCounter = document.querySelector(".pomodoro-counter")
const progress = document.getElementById("progress");

const btnPomodoro = document.getElementById("btn-pomodoro");
const btnShortBreak = document.getElementById("btn-short-break");
const btnLongBreak = document.getElementById("btn-long-break");

const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");

const audioTimerEnd = document.getElementById("timer-end");

var idCounter;

btnPomodoro.onclick = initPomodoroTimer;
btnShortBreak.onclick = initShortBreakTimer;
btnLongBreak.onclick = initLongBreakTimer;

// calc circle progress
const radius = progress.r.baseVal.value;
const circumference = radius * 2 * Math.PI;
progress.style.strokeDasharray = circumference;

window.onload = function () {
	btnPomodoro.click();
};

btnStart.onclick = function () {
	this.style.display = "none";
	btnStop.style.display = "block";
	pomodoroCounter.innerHTML = "#" + ++POMODORO_COUNT;
  startTimer(MINUTES_SELECTED, timerTxt);
};

btnStop.onclick = function() {
	clearIntervalCustom();
	btnStop.style.display = "none";
	btnStart.style.display = "block";
	MINUTES_SELECTED = currentTimer;
};

function initPomodoroTimer(element) {
	styledBtnOnClick(element);
	changeColorTo(COLOR_POMODORO);
  resetTimeByDuration(POMODORO_MINUTES);
}

function initShortBreakTimer(element) {
	styledBtnOnClick(element);
	changeColorTo(COLOR_SHORT);
  resetTimeByDuration(SHORT_BREAK_MINUTES);
}

function initLongBreakTimer(element) {
	styledBtnOnClick(element);
	changeColorTo(COLOR_LONG);
  resetTimeByDuration(LONG_BREAK_MINUES);
}

function styledBtnOnClick(element){
	const btns = document.querySelectorAll(".btn.selected");
	for(let btn of btns) {
		btn.classList.remove("selected");
	}
	element.currentTarget.classList.add("selected");
}

function changeColorTo(color) {
	document.documentElement.style.setProperty("--color-primary", color);
}

function resetTimeByDuration(duration) {
  if (!!idCounter) {
    const res = confirm("Contador já em andamento deseja realmente parar?");
    if (res) {
      clearIntervalCustom();
    } else {
      console.log("Usuario dicidiu em não troca de contador");
      return;
    }
  }
  MINUTES_SELECTED = duration;
  updateDisplay(timerTxt, duration);
}

function updateDisplay(timerElement, duration) {
  let timer = duration,
    minutes,
    seconds;

  minutes = parseInt(timer / 60, 10);
  seconds = parseInt(timer % 60, 10);

  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");

  timerElement.innerHTML = minutes + ":" + seconds;
	document.title = minutes + ":" + seconds;

  let percent = (timer * 100) / MINUTES_SELECTED;
  percent = 100 - percent;
  console.log("percent", percent);
  setPorcentage(percent);
}

function startTimer(duration, display) {
  console.log("startTimer");
  if (!!idCounter) return;
  currentTimer = duration;

  // updateDisplay(display, currentTimer - 1);
  idCounter = setInterval(function () {
    if (--currentTimer < 0) {
      currentTimer = duration;
    }
    updateDisplay(display, currentTimer);
		handleTimerEnd();
  }, MS_INTERVAL);
}

function handleTimerEnd(){
	if(currentTimer == 0) {
		clearIntervalCustom()
		console.log("TIMER END");
		if(!audioTimerEnd) return;
		audioTimerEnd.currentTime = 0;
    audioTimerEnd.play();
		btnPomodoro.click();
		btnStart.style.display = "block";
		btnStop.style.display = "none";
	}
}

function clearIntervalCustom(){
	clearInterval(idCounter);
	idCounter = null;
}

function setPorcentage(percent) {
  progress.style.strokeDashoffset =
    circumference - (percent / 100) * circumference;
}
