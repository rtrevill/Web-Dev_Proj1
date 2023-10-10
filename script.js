// Get references to various HTML elements
const searchForm = document.getElementById("search-form"); // The search form
const clearButton = document.getElementById("clear-button"); // The clear button
const mealNameInput = document.getElementById("meal-name"); // The input field for meal name
const mealList = document.getElementById("meals"); // The list to display search results
const favbutton = document.getElementById("fav-button"); 
const favlist = document.getElementById("favs-list");
const recipeBox = document.getElementById("recipe-box");

// Add an event listener to the search form to handle form submission
searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the meal name entered in the input field
    const queryMealName = mealNameInput.value;

    // Check if the input is empty
    if (queryMealName.trim() === "") {
        alert("Please enter a meal name."); // Show an alert message if the input is empty
        return; // Exit the function
    }

    mealList.innerHTML = ""; // Clear the previous search results

    // Fetch meal data from an external API (TheMealDB)
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${queryMealName}`)
        .then(response => {
            // Check if the HTTP response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            console.log(data);
            if (data.meals) {
                // If meals are found in the data, iterate through them
                data.meals.forEach(meal => {
                    // const mealName = meal.strMeal;
                    // const li = document.createElement("li");
                    // li.classList.add("meal-item");
                    // // Create a link to meal.html with the meal name as a query parameter
                    // li.innerHTML = `<a href="meal.html?name=${encodeURIComponent(mealName)}">${mealName}</a>`;
                    // mealList.appendChild(li); // Append the link to the list
                    const mealName = meal.strMeal;
                    const recipeImg = meal.strMealThumb;
                    const recipeDiv = document.createElement("div");
                    const foodImg = document.createElement('img');
                    foodImg.src = recipeImg;
                    console.log(foodImg);
                    foodImg.height = 120;
                    foodImg.width = 160;
                    // li.classList.add("meal-item");

                    // Create a link to meal.html with the meal name as a query parameter
                    recipeDiv.innerHTML = `<a href="meal.html?name=${encodeURIComponent(mealName)}">${mealName}</a>`;
                    recipeDiv.appendChild(foodImg);

                    recipeBox.appendChild(recipeDiv); // Append the link to the list



                });
            } else {
                mealList.innerHTML = "<li>No meals found.</li>"; // Display a message if no meals are found
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            mealList.innerHTML = "<li>Error loading meals. Please try again later.</li>"; // Handle errors
        });
});

// Add an event listener to the clear button to reset the input and search results
clearButton.addEventListener("click", () => {
    mealNameInput.value = ""; // Clear the input field
    mealList.innerHTML = ""; // Clear the search results
});

favbutton.addEventListener("click", function(event){
    event.preventDefault();
    if (localStorage.getItem("recipe-favs") === null){
        return
    }
    else {
        var exisRecipe = [];
        exisRecipe = JSON.parse(localStorage.getItem('recipe-favs'));
        for (let favs of exisRecipe){
            const favName = favs;
            const newLi =  document.createElement("li");
            newLi.classList.add("fav-meals");
            newLi.innerHTML = `<a href="meal.html?name=${encodeURIComponent(favs)}">${favs}</a>`;
            favlist.appendChild(newLi);
        }

    }
})