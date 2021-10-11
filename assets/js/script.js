//Define DOM elements
var timerEl = document.querySelector("#time");
var startBtn = document.querySelector("#start");
var questionsEl = document.querySelector("#questions");
var choicesEl = document.querySelector("#choices");
var resultEl = document.querySelector("#result");
var initialsEl = document.querySelector("#initials");
var submitBtn = document.querySelector("#submit");

// Define varaibles 
var currentQuestionIndex = 0;
var time = questions.length * 20;
var timerId;

// start and question UI
function startQuiz() {
  var startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");
  questionsEl.removeAttribute("class");

  // Timer
  timerId = setInterval(clockTick, 500);
  timerEl.textContent = time;

  getQuestion();
}

// get questions from question.js defined variables
function getQuestion() {
  var currentQuestion = questions[currentQuestionIndex];
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;
  choicesEl.innerHTML = "";
  currentQuestion.choices.forEach(function (choice, i) {
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);
    choiceNode.textContent = i + 1 + ". " + choice;
    choiceNode.onclick = questionClick;
    choicesEl.appendChild(choiceNode);
  });
}

//Check the answer of the question and adjust timer
function questionClick() {
  if (this.value !== questions[currentQuestionIndex].answer) {
    time -= 15
    if (time < 0) {
      time = 0;
    }
    timerEl.textContent = time;
    resultEl.textContent = "Wrong!";
    resultEl.style.color = "red";
    resultEl.style.fontSize = "300%";
  } else {
    resultEl.textContent = "Correct!";
    resultEl.style.color = "green";
    resultEl.style.fontSize = "300%";
  }

  // show right/wrong result, next question, time checker
  resultEl.setAttribute("class", "result");
  setTimeout(function () {
    resultEl.setAttribute("class", "result hide");
  }, 1000);

  currentQuestionIndex++;

  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  clearInterval(timerId);

  var endScreenEl = document.getElementById("finalScreen");
  endScreenEl.removeAttribute("class");

  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;

  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  time--;
  timerEl.textContent = time;

  if (time <= 0) {
    quizEnd();
  }
}

// Save score to local storage for leaderboard display
function saveHighscore() {
  var initials = initialsEl.value.trim();

  if (initials !== "") {
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    var newScore = {
      score: time,
      initials: initials
    };

    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    window.location.href = "finalscore.html";
  }
}

function checkForEnter(event) {
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// start quiz
startBtn.onclick = startQuiz;
initialsEl.onkeyup = checkForEnter;

// Submit initials to leaderboard
submitBtn.onclick = saveHighscore;
