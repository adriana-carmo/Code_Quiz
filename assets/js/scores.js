var highscoresEL  = document.getElementById("highscores");
var clearEl       = document.getElementById("clear");
var arrayScore    = [];
var optionList    = "";

function printHighscores() {
  // either get scores from localstorage or set to empty array
  var arrayLocalStorage = localStorage.getItem("scoreUser");

  if (arrayLocalStorage) {
    arrayScore = JSON.parse(arrayLocalStorage);
  }
 
  // (optional) sort highscores by score property in descending order
  arrayScore.sort(function (x, y) {
    return  y.scoreUser - x.scoreUser;
  });

  // for each score
    for(var i = 0; i < arrayScore.length; i++)
    {
      // create li tag for each high score
      optionList = document.createElement("li");
    
      optionList.innerHTML = arrayScore[i].nameUser + " - " + arrayScore[i].scoreUser;

      // display on page
      highscoresEL.append(optionList) 
    }
}

function clearHighscores() {
  // (and reload)
  localStorage.clear();
  highscoresEL.innerHTML = "";
  location.reload();

}

// attache clear event to clear score button
clearEl.onclick = clearHighscores;

// run printhighscore when page loads
window.onload = printHighscores;
