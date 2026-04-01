// Meal Master - script.js
// simple beginner javascript

var apiLink = "https://www.themealdb.com/api/json/v1/1/";

// set up buttons
document.getElementById("searchbtn").onclick = doSearch;
document.getElementById("clearbtn").onclick = clearSearch;
document.getElementById("randombtn").onclick = getRandom;
document.getElementById("closePopup").onclick = closePopup;

// get the elements we need
var allcards = document.getElementById("allcards");
var waitMsg = document.getElementById("waitMsg");
var oopsMsg = document.getElementById("oopsMsg");
var nothingMsg = document.getElementById("nothingMsg");
var searchbox = document.getElementById("searchbox");

// hide messages at start
waitMsg.style.display = "none";
oopsMsg.style.display = "none";
nothingMsg.style.display = "none";

// make filter buttons work
var fbtns = document.getElementsByClassName("fbtn");
for (var i = 0; i < fbtns.length; i++) {
    fbtns[i].onclick = function() {
        var text = this.innerText;
        // remove emojis for search
        var category = text.replace("🍗 ", "").replace("🥩 ", "").replace("🐟 ", "").replace("🥦 ", "").replace("🍰 ", "").replace("🍝 ", "");
        
        if (category === "All") {
            searchMeals("");
        } else {
            filterByCategory(category);
        }
    };
}

function showWait() {
    waitMsg.style.display = "block";
    oopsMsg.style.display = "none";
    nothingMsg.style.display = "none";
    allcards.innerHTML = "";
}

function showOops() {
    waitMsg.style.display = "none";
    oopsMsg.style.display = "block";
    nothingMsg.style.display = "none";
}

function showNothing() {
    waitMsg.style.display = "none";
    oopsMsg.style.display = "none";
    nothingMsg.style.display = "block";
}

function hideMsgs() {
    waitMsg.style.display = "none";
    oopsMsg.style.display = "none";
    nothingMsg.style.display = "none";
}

function doSearch() {
    var query = searchbox.value;
    if (query == "") {
        alert("Please type something to search!");
    } else {
        searchMeals(query);
    }
}

function clearSearch() {
    searchbox.value = "";
    searchMeals("");
}

function searchMeals(query) {
    showWait();
    // fetch the api
    fetch(apiLink + "search.php?s=" + query)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            displayMeals(data.meals);
        })
        .catch(function(err) {
            showOops();
        });
}

function filterByCategory(cat) {
    showWait();
    fetch(apiLink + "filter.php?c=" + cat)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            displayMeals(data.meals);
        })
        .catch(function(err) {
            showOops();
        });
}

function getRandom() {
    showWait();
    fetch(apiLink + "random.php")
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            displayMeals(data.meals);
            openPopup(data.meals[0].idMeal);
        })
        .catch(function(err) {
            showOops();
        });
}

function displayMeals(mealsArray) {
    if (mealsArray == null) {
        showNothing();
        return;
    }
    
    hideMsgs();
    var html = "";
    
    for (var i = 0; i < mealsArray.length; i++) {
        var meal = mealsArray[i];
        
        html += "<div class='mealcard'>";
        html += "<img class='mealimg' src='" + meal.strMealThumb + "'>";
        html += "<h3>" + meal.strMeal + "</h3>";
        
        // inline event handler for simple beginner look
        html += "<button onclick='openPopup(\"" + meal.idMeal + "\")'>Read Recipe</button>";
        html += "</div>";
    }
    
    allcards.innerHTML = html;
}

function openPopup(mealId) {
    fetch(apiLink + "lookup.php?i=" + mealId)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            var meal = data.meals[0];
            
            var content = document.getElementById("popupContent");
            content.innerHTML = "<h2>" + meal.strMeal + "</h2>";
            content.innerHTML += "<img src='" + meal.strMealThumb + "' width='200'>";
            content.innerHTML += "<p><b>Category:</b> " + meal.strCategory + "</p>";
            content.innerHTML += "<p><b>How to make:</b><br>" + meal.strInstructions + "</p>";
            
            document.getElementById("recipePopup").style.display = "block";
        })
        .catch(function(err) {
            alert("Error loading recipe!");
        });
}

function closePopup() {
    document.getElementById("recipePopup").style.display = "none";
}

// start by loading some meals
searchMeals("");
