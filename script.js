const searchButton = document.getElementById("search-button");
const clearButton = document.getElementById("clear-button");
const mealNameInput = document.getElementById("meal-name");
const mealList = document.getElementById("meals");

searchButton.addEventListener("click", () => {
    const mealName = mealNameInput.value;
    if (mealName.trim() === "") {
        alert("Please enter a meal name.");
        return;
    }

    // Clear previous search results
    mealList.innerHTML = "";

    // Make a request to the API
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                data.meals.forEach(meal => {
                    const mealName = meal.strMeal;
                    const ingredients = [];

                    // Extract ingredients and measurements
                    for (let i = 1; i <= 20; i++) {
                        const ingredient = meal[`strIngredient${i}`];
                        const measurement = meal[`strMeasure${i}`];

                        if (ingredient && measurement) {
                            ingredients.push(`${measurement} ${ingredient}`);
                        }
                    }

                    // Create a list item for each meal with ingredients
                    const li = document.createElement("li");
                    li.classList.add("meal-item");
                    li.innerHTML = `
                        <strong class="meal-name">${mealName}</strong>
                        <ul>
                            ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join("")}
                        </ul>
                    `;

                    mealList.appendChild(li);
                });
            } else {
                mealList.innerHTML = "No meals found.";
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});

clearButton.addEventListener("click", () => {
    mealNameInput.value = ""; // Clear the input field
    mealList.innerHTML = ""; // Clear the search results
});

// Function to fetch and display meal images
function displayMealImages() {
    const mealItems = document.querySelectorAll(".meal-item");

    mealItems.forEach(mealItem => {
        const mealName = mealItem.querySelector(".meal-name").textContent;

        // Use Lorem Picsum for placeholder images
        const imageUrl = `https://picsum.photos/200?random=${mealName}`;

        const imageElement = document.createElement("img");
        imageElement.src = imageUrl;
        imageElement.alt = mealName;

        mealItem.appendChild(imageElement);
    });
}

searchButton.addEventListener("click", () => {
    // ... (previous code for searching and displaying meals) ...

    // Display meal images after fetching meal data
    displayMealImages();
});
