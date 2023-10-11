// Get references to various HTML elements
const searchForm = document.getElementById("search-form");
const clearButton = document.getElementById("clear-button");
const mealNameInput = document.getElementById("meal-name");
const mealList = document.getElementById("meals");
const favbutton = document.getElementById("fav-button");
const favlist = document.getElementById("favs-list");
const recipeBox = document.getElementById("recipe-box");

// Add an event listener for the search form submission
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const queryMealName = mealNameInput.value;

    if (queryMealName.trim() === "") {
        alert("Please enter a meal name.");
        return;
    }

    mealList.innerHTML = "";

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${queryMealName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.meals) {
                data.meals.forEach(meal => {
                    const mealName = meal.strMeal;
                    const recipeImg = meal.strMealThumb;
                    const recipeDiv = document.createElement("div");
                    const foodImg = document.createElement('img');
                    foodImg.src = recipeImg;
                    foodImg.height = 120;
                    foodImg.width = 160;

                    recipeDiv.innerHTML = `<a href="meal.html?name=${encodeURIComponent(mealName)}">${mealName}</a>`;
                    recipeDiv.appendChild(foodImg);

                    recipeBox.appendChild(recipeDiv);
                });

                // Show the modal after successful search
                showModal();
            } else {
                recipeBox.innerHTML = "<li>No meals found.</li>";
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            recipeBox.innerHTML = "<li>Error loading meals. Please try again later.</li>";
        });
});

clearButton.addEventListener("click", () => {
    mealNameInput.value = "";
    recipeBox.innerHTML = "";
});

favbutton.addEventListener("click", function(event) {
    event.preventDefault();
    if (localStorage.getItem("recipe-favs") === null) {
        return;
    } else {
        var exisRecipe = [];
        exisRecipe = JSON.parse(localStorage.getItem('recipe-favs'));
        for (let favs of exisRecipe) {
            const newLi = document.createElement("li");
            newLi.classList.add("fav-meals");
            newLi.innerHTML = `<a href="meal.html?name=${encodeURIComponent(favs)}">${favs}</a>`;
            favlist.appendChild(newLi);
        }
    }
});

// Modal Functions
function showModal() {
    const modal = document.getElementById("myModal");
    modal.classList.remove("hidden");
    
    const closeModalBtn = document.getElementById("closeModal");
    closeModalBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
}
