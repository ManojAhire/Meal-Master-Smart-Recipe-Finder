const api = "https://www.themealdb.com/api/json/v1/1/";
const el = {
    search: document.getElementById("searchbtn"),
    clear: document.getElementById("clearbtn"),
    random: document.getElementById("randombtn"),
    close: document.getElementById("closePopup"),
    dark: document.getElementById("dark"),
    sortAsc: document.getElementById("sortAscBtn"),
    sortDesc: document.getElementById("sortDescBtn"),
    input: document.getElementById("searchbox"),
    cards: document.getElementById("allcards"),
    popup: document.getElementById("recipePopup"),
    popupContent: document.getElementById("popupContent"),
    wait: document.getElementById("waitMsg"),
    error: document.getElementById("oopsMsg"),
    nothing: document.getElementById("nothingMsg")
};

let meals = [];
let displayed = [];

el.dark.innerText = "🌙 Dark Mode";
el.search.onclick = doSearch;
el.clear.onclick = clearSearch;
el.random.onclick = getRandomMeal;
el.close.onclick = closePopup;
el.dark.onclick = toggleDarkMode;
el.sortAsc.onclick = sortMealsAsc;
el.sortDesc.onclick = sortMealsDesc;
document.querySelectorAll(".f").forEach(btn => btn.onclick = () => filterByCategory(btn.innerText));
fetchInitialMeals();

function toggleDarkMode() {
    const isDark = document.body.classList.contains("dark-mode");
    
    if (isDark) {
        document.body.classList.remove("dark-mode");
        el.dark.innerText = "🌙 Dark Mode";
    } else {
        document.body.classList.add("dark-mode");
        el.dark.innerText = "☀️ Light Mode";
    }
}

function hideMessages(show = null) {
    el.wait.style.display = "none";
    el.error.style.display = "none";
    el.nothing.style.display = "none";
    
    if (show === "wait") el.wait.style.display = "block";
    else if (show === "error") el.error.style.display = "block";
    else if (show === "nothing") el.nothing.style.display = "block";
}

function fetch2(url, onSuccess) {
    hideMessages("wait");
    fetch(api + url)
        .then(r => r.json())
        .then(d => { hideMessages(); onSuccess(d); })
        .catch(() => hideMessages("error"));
}

function doSearch() {
    const input = el.input.value.toLowerCase().trim();
    
    if (input === "") {
        alert("Please enter a meal name!");
        return;
    }
    
    const results = meals.filter(m => {
        const name = m.strMeal.toLowerCase();
        const category = m.strCategory.toLowerCase();
        const area = m.strArea.toLowerCase();
        return name.includes(input) || category.includes(input) || area.includes(input);
    });
    displayed = results;
    
    if (results.length === 0) {
        hideMessages("nothing");
    } else {
        displayResults(results);
    }
}

function clearSearch() {
    el.input.value = "";
    displayed = meals;
    displayResults(meals);
    hideMessages();
}

function fetchInitialMeals() {
    fetch2("search.php?s=", d => {
        if (d.meals && d.meals.length > 0) {
            meals = d.meals;
            displayed = d.meals;
            displayResults(d.meals);
        } else {
            hideMessages("nothing");
        }
    });
}

function getRandomMeal() {
    hideMessages("wait");
    el.cards.innerHTML = "";
    
    fetch2("random.php", d => {
        if (d.meals && d.meals.length > 0) {
            displayed = d.meals;
            displayResults(d.meals);
            showRecipe(d.meals[0].idMeal);
        }
    });
}

function displayResults(arr) {
    if (arr.length === 0) {
        el.cards.innerHTML = "";
        return;
    }
    
    const htmlCards = arr.map(m => createCard(m));
    el.cards.innerHTML = htmlCards.join("");
}

function createCard(meal) {
    return `
        <div class="mealcard">
            <img src="${meal.strMealThumb}" class="mealimg" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <button class="likebtn" onclick="toggleLike(this)">🤍 Like</button>
            <button onclick="showRecipe('${meal.idMeal}')">See Recipe</button>
        </div>
    `;
}

function toggleLike(btn) {
    const isLiked = btn.innerText.includes("❤️");
    
    if (isLiked) {
        btn.innerHTML = "🤍 Like";
        btn.classList.remove("liked");
    } else {
        btn.innerHTML = "❤️ Liked";
        btn.classList.add("liked");
    }
}

function showRecipe(id) {
    const meal = meals.find(x => x.idMeal == id);
    
    if (meal) {
        renderRecipePopup(meal);
    } else {
        fetch(api + "lookup.php?i=" + id)
            .then(r => r.json())
            .then(d => renderRecipePopup(d.meals[0]));
    }
}

function renderRecipePopup(meal) {
    const html = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" width="100%" style="border-radius:10px;" alt="${meal.strMeal}">
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Instructions:</strong><br>${meal.strInstructions}</p>
    `;
    
    el.popupContent.innerHTML = html;
    el.popup.style.display = "block";
}

function closePopup() {
    el.popup.style.display = "none";
}

function sortMealsAsc() {
    if (!displayed.length) return;
    displayed.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    displayResults(displayed);
}

function sortMealsDesc() {
    if (!displayed.length) return;
    displayed.sort((a, b) => b.strMeal.localeCompare(a.strMeal));
    displayResults(displayed);
}

function filterByCategory(cat) {
    hideMessages();
    
    if (cat === "All") {
        displayed = meals;
        displayResults(displayed);
    } else {
        displayed = meals.filter(m => m.strCategory === cat);
        
        if (displayed.length === 0) {
            hideMessages("nothing");
        } else {
            displayResults(displayed);
        }
    }
}
