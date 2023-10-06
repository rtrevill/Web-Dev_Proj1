// Check if the page is meal.html
if (window.location.pathname.includes("meal.html")) {
    // Get the meal name from the URL query parameter
    const mealNameQuery = new URLSearchParams(window.location.search).get("name");

    // Fetch meal details from an external API (TheMealDB)
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealNameQuery}`)
        .then(response => {
            // Check if the HTTP response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Check if meal data is available and if there's at least one meal
            if (data.meals && data.meals.length > 0) {
                const meal = data.meals[0];
                let detailsHTML = `
                    <h1>${meal.strMeal}</h1>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200">
                    <h3>Category: ${meal.strCategory}</h3>
                    <h3>Cuisine: ${meal.strArea}</h3>
                    <p>${meal.strInstructions}</p>
                    <h3>Ingredients:</h3>
                    <ul>
                `;

                // Loop through ingredients and measures
                for (let i = 1; i <= 20; i++) {
                    const ingredient = meal[`strIngredient${i}`];
                    const measure = meal[`strMeasure${i}`];
                    if (ingredient && measure) {
                        detailsHTML += `<li>${ingredient} - ${measure}</li>`;
                    }
                }

                detailsHTML += "</ul>";
                detailsHTML += "<h3>Nutrition Values:</h3>";

                // Call the nutrition function to calculate and display nutrition data
                nutrition(meal.strMeal);

                // Display meal details in the HTML
                document.getElementById("meal-full-details").innerHTML = detailsHTML;
            } else {
                // Display a message if no meal details are found
                document.getElementById("meal-title").textContent = "No meal details found.";
            }
        })
        .catch(error => {
            // Handle errors related to fetching meal details
            console.error("Error fetching meal details:", error);
            document.getElementById("meal-title").textContent = "Error loading meal details. Please try again later.";
        });
}
// ***** THIS FUNCTION BELOW IS INTERGRATED FROM RICHARD WORKS *****
// Function to calculate nutrition data for the meal
function nutrition(foody) {
    // Prepare data for the nutrition API request
    var data = JSON.stringify({
        'query': foody
    });

    // Create an XMLHttpRequest to send a POST request to the nutrition API (Nutritionix)
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://trackapi.nutritionix.com/v2/natural/nutrients');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-app-id', 'ffa96114');
    xhr.setRequestHeader('x-app-key', 'c77cb8553663ea0e9b3b091d44ce0177');

    xhr.onload = function () {
        // Parse the nutrition data received from the API
        var butterNutrients = JSON.parse(xhr.response);
        ingredientNutrition = butterNutrients.foods[0].nf_calories;
        
        // Display the calculated calories (nutrition) in the HTML
        document.getElementById("meal-nutrition").textContent = "Calories: " + ingredientNutrition;
    };

    // Send the nutrition API request
    xhr.send(data);
}
