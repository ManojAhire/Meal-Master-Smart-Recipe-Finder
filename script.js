var apiLink = "https://www.themealdb.com/api/json/v1/1/";

var searchBtn = document.getElementById("searchbtn");
var clearBtn = document.getElementById("clearbtn");
var randomBtn = document.getElementById("randombtn");
var closeBtn = document.getElementById("closePopup");
var darkBtn = document.getElementById("dark");

var searchBox = document.getElementById("searchbox");
var allCardsDiv = document.getElementById("allcards");
var popupDiv = document.getElementById("recipePopup");
var popupContentDiv = document.getElementById("popupContent");

var waitMsg = document.getElementById("waitMsg");
var oopsMsg = document.getElementById("oopsMsg");
var nothingMsg = document.getElementById("nothingMsg");

searchBtn.onclick = doSearch;
clearBtn.onclick = clearSearch;
randomBtn.onclick = getRandomMeal;
closeBtn.onclick = closePopup;
darkBtn.onclick = toggleDarkMode;

function toggleDarkMode() {
    if (document.body.style.backgroundColor == "black") {
        document.body.style.backgroundColor = "lightyellow";
        document.body.style.color = "black";
        darkBtn.innerText = "🌙 Dark Mode";
    } else {
        document.body.style.backgroundColor = "black";
        document.body.style.color = "white";
        darkBtn.innerText = "☀️ Light Mode";
    }
}

function doSearch() {
    var whatTheUserTyped = searchBox.value;
    
    if (whatTheUserTyped == "") {
        alert("Please type a meal name first!");
    } else {
        searchForMeals(whatTheUserTyped);
    }
}

function clearSearch() {
    searchBox.value = "";
    searchForMeals("");
}

function searchForMeals(query) {
    waitMsg.style.display = "block";
    oopsMsg.style.display = "none";
    nothingMsg.style.display = "none";
    allCardsDiv.innerHTML = "";

    fetch(apiLink + "search.php?s=" + query)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.meals == null) {
                waitMsg.style.display = "none";
                nothingMsg.style.display = "block";
            } else {
                waitMsg.style.display = "none";
                displayResults(data.meals);
            }
        })
        .catch(function(error) {
            waitMsg.style.display = "none";
            oopsMsg.style.display = "block";
        });
}

function getRandomMeal() {
    waitMsg.style.display = "block";
    allCardsDiv.innerHTML = "";

    fetch(apiLink + "random.php")
        .then(function(response) { return response.json(); })
        .then(function(data) {
            waitMsg.style.display = "none";
            displayResults(data.meals);
            showRecipe(data.meals[0].idMeal);
        });
}

function displayResults(mealsArray) {
    var bigListOfHTML = "";

    for (var i = 0; i < mealsArray.length; i++) {
        var currentMeal = mealsArray[i];

        bigListOfHTML = bigListOfHTML + "<div class='mealcard'>";
        bigListOfHTML = bigListOfHTML + "<img src='" + currentMeal.strMealThumb + "' class='mealimg'>";
        bigListOfHTML = bigListOfHTML + "<h3>" + currentMeal.strMeal + "</h3>";
        bigListOfHTML = bigListOfHTML + "<button onclick='showRecipe(\"" + currentMeal.idMeal + "\")'>See Recipe</button>";
        bigListOfHTML = bigListOfHTML + "</div>";
    }

    allCardsDiv.innerHTML = bigListOfHTML;
}

function showRecipe(mealId) {
    fetch(apiLink + "lookup.php?i=" + mealId)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            var m = data.meals[0];

            var details = "<h2>" + m.strMeal + "</h2>";
            details = details + "<img src='" + m.strMealThumb + "' width='100%'>";
            details = details + "<p><strong>Category:</strong> " + m.strCategory + "</p>";
            details = details + "<p><strong>Instructions:</strong><br>" + m.strInstructions + "</p>";

            popupContentDiv.innerHTML = details;
            popupDiv.style.display = "block";
        });
}

function closePopup() {
    popupDiv.style.display = "none";
}

var categoryButtons = document.getElementsByClassName("f");

for (var i = 0; i < categoryButtons.length; i++) {
    categoryButtons[i].onclick = function() {
        var buttonText = this.innerText;
        
        if (buttonText == "All") {
            searchForMeals("");
        } else {
            var categoryName = buttonText.split(" ")[1]; 
            filterByCategory(categoryName);
        }
    };
}

function filterByCategory(cat) {
    waitMsg.style.display = "block";
    allCardsDiv.innerHTML = "";

    fetch(apiLink + "filter.php?c=" + cat)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            waitMsg.style.display = "none";
            displayResults(data.meals);
        });
}

searchForMeals("");
