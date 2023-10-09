const searchButton = document.getElementById("search-button");
// const clearButton = document.getElementById("clear-button");
const mealNameInput = document.getElementById("meal-name");
const mealList = document.getElementById("meals");
var food = '';
var data = JSON.stringify({
    'query': food
  });
var fullList;
// var ingredientNutrition = ""

searchButton.addEventListener("click", () => {
    const mealName = mealNameInput.value;
    if (mealName.trim() === "") {
        alert("Please enter a meal name.");
        return;
    }

    // Clear previous search results
    mealList.innerHTML = "";

    // Make a request to the API
    // fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
    fetch('https://api.spoonacular.com/recipes/complexSearch?query='+ mealName +'&maxFat=25&number=2&apiKey=5c5811329c4d411ea84e8cc051755f22')

        .then(response => response.json())
        .then(data => {
            console.log(data);
            fullList = data;
            if (data.results) {
                const mealNames = [];
                data.results.forEach(meal => {
                    const mealName = meal.title;
                    mealNames.push(meal.title);
                    console.log(mealNames);
                    // Extract ingredients and measurements
                    // for (let i = 1; i <= 20; i++) {
                    //     const ingredient = meal[`strIngredient${i}`];
                    //     const measurement = meal[`strMeasure${i}`];

                        // if (ingredient && measurement) {
                        //     ingredients.push(`${measurement} ${ingredient}`);
                    //     }
                    // }

                    // Create a list item for each meal with ingredients
                    const li = document.createElement("li");
                    li.classList.add("meal-title");
                    li.innerHTML = `
                        <strong class="meal-title">${mealName}</strong>
                    `;
                    

                    document.addEventListener('click', function(event){
                        event.preventDefault();
                        var list = event.target;
                        if (list.matches(".meal-title")){
                            console.log(this);
                            console.log(list.innerText);
                            food = list.innerText;
                            // nutrition(food);
                            var mealNumber;
                            var i=0;
                            for (var yum of mealNames){
                                console.log(yum);
                                if (yum == food){
                                    console.log(mealNames[yum]);
                                    mealNumber = i;
                                    localStorage.setItem("selected-meal", JSON.stringify(data.results[i]));
                                };
                                i++;
                            };
                        };
                    });
            
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

// clearButton.addEventListener("click", () => {
//     mealNameInput.value = ""; // Clear the input field
//     mealList.innerHTML = ""; // Clear the search results
// });

// Function to fetch and display meal images
// function displayMealImages() {
//     const mealItems = document.querySelectorAll(".meal-item");

//     mealItems.forEach(mealItem => {
//         const mealName = mealItem.querySelector(".meal-name").textContent;

//         // Use Lorem Picsum for placeholder images
//         const imageUrl = `https://picsum.photos/200?random=${mealName}`;

//         const imageElement = document.createElement("img");
//         imageElement.src = imageUrl;
//         imageElement.alt = mealName;

//         mealItem.appendChild(imageElement);
//     });
// }

searchButton.addEventListener("click", () => {
    // ... (previous code for searching and displaying meals) ...

    // Display meal images after fetching meal data
    // displayMealImages();
});


// document.addEventListener('click', function(event){
//     event.preventDefault();
//     var list = event.target;
//     if (list.matches("li")){
//         console.log(list.innerText);
//         food = list.innerText;
//         // nutrition(food);
//         var mealNumber;
//         for (var yum of mealNames){
//             if (mealNames[yum] === food){
//                 mealNumber = yum;
//                 localStorage.setItem("selected-meal", JSON.stringify(data.meals[yum]));
//             };
//         };
//     };
// });

// function nutrition(foody){
//     var data = JSON.stringify({
//         'query': foody
//       });

//     let xhr = new XMLHttpRequest();
//     // xhr.withCredentials = true;
//     xhr.open('POST', 'https://trackapi.nutritionix.com/v2/natural/nutrients');
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.setRequestHeader('x-app-id', 'ffa96114');
//     xhr.setRequestHeader('x-app-key', 'c77cb8553663ea0e9b3b091d44ce0177');
    
//     xhr.onload = function() {
//       // console.log(xhr.response);
//       var butterNutrients = JSON.parse(xhr.response);
//       ingredientNutrition = butterNutrients.foods[0].nf_calories;
//       alert("Calories: " + ingredientNutrition)

//     };
    
//     xhr.send(data);
    
// }
