// MEAL MASTER - SCRIPT.JS
// I used very simple code so it's easy to understand!

// --- 1. SET UP THE API LINK ---
var apiLink = "https://www.themealdb.com/api/json/v1/1/";

// --- 2. GET ALL THE ELEMENTS FROM HTML ---
// We use document.getElementById to find things in our HTML file
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

// --- 3. MAKE BUTTONS DO SOMETHING ---
// When someone clicks the search button, run the "doSearch" function
searchBtn.onclick = doSearch;

// When someone clicks the clear button, run the "clearSearch" function
clearBtn.onclick = clearSearch;

// When someone clicks the random button, run the "getRandomMeal" function
randomBtn.onclick = getRandomMeal;

// When someone clicks the close button in the popup, run "closePopup"
closeBtn.onclick = closePopup;

// When someone clicks the Dark Mode button
darkBtn.onclick = toggleDarkMode;

// --- 4. THE FUNCTIONS (The brains of the app) ---

// This function toggles (switches) the background color
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

// This function gets what you typed in the box and starts the search
function doSearch() {
    var whatTheUserTyped = searchBox.value;
    
    if (whatTheUserTyped == "") {
        alert("Please type a meal name first!");
    } else {
        searchForMeals(whatTheUserTyped);
    }
}

// This function clears the search box and shows all meals again
function clearSearch() {
    searchBox.value = "";
    searchForMeals(""); // search for empty string shows some default meals
}

// This function talks to the API to find meals
function searchForMeals(query) {
    // 1. Show the "Loading" message and hide the others
    waitMsg.style.display = "block";
    oopsMsg.style.display = "none";
    nothingMsg.style.display = "none";
    allCardsDiv.innerHTML = ""; // Clear the screen

    // 2. Fetch data from the internet
    // We use the apiLink + search.php?s= + our query
    fetch(apiLink + "search.php?s=" + query)
        .then(function(response) {
            return response.json(); // turn the response into a JSON object
        })
        .then(function(data) {
            // 3. Check if we found any meals
            if (data.meals == null) {
                waitMsg.style.display = "none";
                nothingMsg.style.display = "block";
            } else {
                // 4. If we found meals, show them!
                waitMsg.style.display = "none";
                displayResults(data.meals);
            }
        })
        .catch(function(error) {
            // If something goes wrong (no internet, etc)
            waitMsg.style.display = "none";
            oopsMsg.style.display = "block";
        });
}

// This function gets a random meal
function getRandomMeal() {
    waitMsg.style.display = "block";
    allCardsDiv.innerHTML = "";

    fetch(apiLink + "random.php")
        .then(function(response) { return response.json(); })
        .then(function(data) {
            waitMsg.style.display = "none";
            displayResults(data.meals);
            // Automatically open the popup for the random meal
            showRecipe(data.meals[0].idMeal);
        });
}

// This function draws the meal cards on the screen
function displayResults(mealsArray) {
    var bigListOfHTML = "";

    // We loop through every meal in the list
    for (var i = 0; i < mealsArray.length; i++) {
        var currentMeal = mealsArray[i];

        // We build a string of HTML for each meal
        bigListOfHTML = bigListOfHTML + "<div class='mealcard'>";
        bigListOfHTML = bigListOfHTML + "<img src='" + currentMeal.strMealThumb + "' class='mealimg'>";
        bigListOfHTML = bigListOfHTML + "<h3>" + currentMeal.strMeal + "</h3>";
        // This button calls the showRecipe function with the meal's ID
        bigListOfHTML = bigListOfHTML + "<button onclick='showRecipe(\"" + currentMeal.idMeal + "\")'>See Recipe</button>";
        bigListOfHTML = bigListOfHTML + "</div>";
    }

    // Finally, we put all that HTML inside our "allcards" div
    allCardsDiv.innerHTML = bigListOfHTML;
}

// This function gets the full recipe details using an ID
function showRecipe(mealId) {
    fetch(apiLink + "lookup.php?i=" + mealId)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            var m = data.meals[0]; // the meal object

            // Fill the popup with information
            var details = "<h2>" + m.strMeal + "</h2>";
            details = details + "<img src='" + m.strMealThumb + "' width='100%'>";
            details = details + "<p><strong>Category:</strong> " + m.strCategory + "</p>";
            details = details + "<p><strong>Instructions:</strong><br>" + m.strInstructions + "</p>";

            popupContentDiv.innerHTML = details;
            
            // Show the popup
            popupDiv.style.display = "block";
        });
}

// This function hides the popup
function closePopup() {
    popupDiv.style.display = "none";
}

// --- 5. CATEGORY FILTER BUTTONS ---
// We find all buttons with the class "f"
var categoryButtons = document.getElementsByClassName("f");

// We loop through all the buttons we found
for (var i = 0; i < categoryButtons.length; i++) {
    categoryButtons[i].onclick = function() {
        var buttonText = this.innerText;
        
        // If it's the "All" button
        if (buttonText == "All") {
            searchForMeals("");
        } else {
            // We need to clean the text (remove the emojis)
            // This is a bit advanced, but basically it removes the icons
            var categoryName = buttonText.split(" ")[1]; 
            
            // If it's a category button, we use the filter API
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

// --- START THE APP ---
// Load some default meals when the page first opens
searchForMeals("");
