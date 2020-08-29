// variables to keep track of quiz state
var currentQuestionIndex = 0;
var totalQuestion = questions.length;
var time          = totalQuestion * 15;
var timerId;
var returnFeedback = "";
var dataUser      = [];


// variables to reference DOM elements
var questionsEl = document.getElementById("questions");
var timerEl     = document.getElementById("time");
var choicesEl   = document.getElementById("choices");
var submitBtn   = document.getElementById("submit");
var startBtn    = document.getElementById("start");
var initialsEl  = document.getElementById("initials");
var feedbackEl  = document.getElementById("feedback");
var endScreenEl = document.getElementById("end-screen");
var hideStartScreen = document.getElementById("start-screen");
var finalScoreEl    = document.getElementById("final-score");
var questionTitleEL = document.getElementById("question-title");


// sound effects
var sfxRight = new Audio("assets/sfx/correct.wav");
var sfxWrong = new Audio("assets/sfx/incorrect.wav");

//Start the QUIZ
function startQuiz() {
  // hide start screen
  hideStartScreen.style.visibility = "hidden";

  // un-hide questions section
  questionsEl.style.display = "block";

  // start timer
   timerId = setInterval(function() {
    time--;

    // show starting time
    timerEl.textContent = time;

    if(time === 0) {
      clearInterval(timerId);
      quizEnd();
    }
  }, 1000);

  getQuestion();
}

//Get Question and Option answer
function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex].title;

  // update title with current question 
  questionTitleEL.textContent = currentQuestion;

  // clear out any old question choices
  choicesEl.innerHTML = "";
  
  // clear out any old feedback
  feedbackEl.textContent = "";
  feedbackEl.style.display = "none";

  // create choice list
  var listEl = document.createElement("ol");
  choicesEl.appendChild(listEl); 

  // loop over choices
  for(var i = 0; i < questions[currentQuestionIndex]["choices"].length; i++)
  {
    // create new button for each choice
    var optionList = document.createElement("button");
    
    optionList.id =  questions[currentQuestionIndex]["choices"][i];
    optionList.innerHTML = "<li>" + questions[currentQuestionIndex]["choices"][i] + "</li>";

    // attach click event listener to each choice
    optionList.addEventListener("click", questionClick)

    // display on the page
    listEl.appendChild(optionList); 
    
  }

}

// Check answer question
function questionClick() {

    //event.preventDefault();
    var currentId = event.target.parentElement.id;

    //check if user guessed wrong
    if(currentId != questions[currentQuestionIndex].answer){
      // penalize time
      clockTick()
      
      // play "wrong" sound effect
      sfxWrong.play();
      returnFeedback = "Wrong!"
    }
    else{
      // play "right" sound effect
      sfxRight.play();
      returnFeedback = "Correct!"
  }

  // show right/wrong feedback 
  feedbackEl.textContent = returnFeedback;
  feedbackEl.style.display = "block";

   // flash right/wrong feedback on page for half a second
  setTimeout(function(){ 
    // move to next question
    currentQuestionIndex++

    // check if we've run out of questions
    (currentQuestionIndex >= totalQuestion)? quizEnd() : getQuestion();

    }, 500);
   
}

// Quiz end
function quizEnd() {
  // stop timer
  clearInterval(timerId);

  // show end screen
  endScreenEl.style.display = "block";

  // show final score
  finalScoreEl.textContent = time;;

  // hide questions section
  questionsEl.style.display = "none";
  feedbackEl.style.display  = "none";
}


function clockTick() {

  // check if user ran out of time
  if(time <= 0) {
    clearInterval(timerId);
    quizEnd();
  }

  // update time
  time = time - 10;
}

function saveHighscore() {
  // get value of input box
  var initials = document.getElementById("initials").value.trim();

  //Check if data is persisted in localStorge then load in the array
  var str = localStorage.getItem('scoreUser')
  if (str) {
    dataUser = JSON.parse(str);
  }

  // make sure value wasn't empty
  if(initials.length >= 2)
  {
    
    // format new score object for current user
    var scoreUser = {
      'nameUser': initials,
      'scoreUser': time
      }

    // get saved scores from localstorage, or if not any, set to empty array
    dataUser.push(scoreUser);
  
    // save to localstorage
    localStorage.setItem("scoreUser", JSON.stringify(dataUser))
    
    // redirect to next page
    window.location.href = "highscores.html";
  }
  else
  {
    alert("Please enter your initials with minimum 2 character");
  }
}

function checkForEnter(event) {

  // check if event key is enter
  if (event.keyCode == 13)
     saveHighscore();
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;
