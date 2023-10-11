// Check if the page is meal.html
if (window.location.pathname.includes("meal.html")) {
    // Define variables
    var nameOfMeal;
    var mealCal=0;
    var ingredCalories = [];
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
                nameOfMeal = meal.strMeal;
            // Create structure and content for displaying meal on page.
                let detailsHTML = `
                    <h1>${meal.strMeal}</h1>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200">
                    <h3>Category: ${meal.strCategory}</h3>
                    <h3>Cuisine: ${meal.strArea}</h3>
                    <p>${meal.strInstructions}</p>
                    <h3>Ingredients:</h3>
                    <ul id="ingredient-list">
                `;
            
                // Calls function to list ingredients, and attach them to ingredient list
                search(nameOfMeal);

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

};


// Function to retrieve and list ingredients
function search(mealName){
    $('#ingredient-list').empty();
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
    .then(response => response.json())
    .then(data => {
        var mealObject = data.meals[0];
    
        // Loops through 20 tmes to find maximum of 20 ingredients and measurements.
        for (var i = 1; i <= 20; i++){
            var ingred = ("strIngredient" + [i]);
            var ingredReal = (mealObject[ingred]);
            var measure = ("strMeasure" + [i]);
            var measureReal = (mealObject[measure]);
                measureReal = (measureReal.trim());
                // Create a list item for the ingredient (if present) and related measurement
                // Also run function for nutrition API for that ingredient
                if (ingredReal !== ""){
                    var newLi = $('<li>');
                    $(newLi).attr('id', ingredReal);
                    $(newLi).addClass("ingredient");
                    $(newLi).text(measureReal + " " + ingredReal);
                    $('#ingredient-list').append(newLi);
                    var ingredMeasure = (measureReal + " " + ingredReal);
                    nutrition(ingredMeasure);
                    }
        };

        // Event handler for newly created ingredient list elements.
        // Passes a href value to the anchor attached to the ingredient info button, then runs function to display picture
        $("li").on("click", function() {
            var food = this.id;
            var infolink = food.replace(/\ /g,'+');;
            $('#moreInfo').attr("href", 'https://en.wikipedia.org/w/index.php?fulltext=1&search=' + infolink +'&title=Special%3ASearch&ns0=1');    
            createPic(food);
          }
        );   
        
        // Event handler for hovering over ingredients. 
        // Will display ingredient's calorie amount (pulled from array) in paragraph
        $("li").hover(function() {
            for (let names in ingredCalories){
                if ((ingredCalories[names].namey)===(this.innerText)){
                $('#ingredient-nutrition').text(ingredCalories[names].namey + " "+ ingredCalories[names].calories + " calories");
    
                };
    
            };
    
        })

        })
    .catch(error => {
        // Handle errors related to fetching ingredient details
        console.error("Error fetching ingredient details:", error);
        document.getElementById("ingredient-list").textContent = "Error loading ingredients details. Please try again later.";
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
    xhr.setRequestHeader('x-app-id', '0ef1d3e0');
    xhr.setRequestHeader('x-app-key', '1a95c14c3ebb75f91422fcfe967b6621');

    xhr.onload = function () {
        // Parse the nutrition data received from the API
        var butterNutrients = JSON.parse(xhr.response);
        ingredientNutrition = butterNutrients.foods[0].nf_calories;

        //Adds calories of current ingredient to total recipe calories
        mealCal += ingredientNutrition;

        // Assigns the ingredient (and measurement) name and calories to an object 
        var ingredNut = {
            "namey": foody,
            "calories" : ingredientNutrition,
        };

        //Ingredient object is added to array containing all the ingredients with their calories
        ingredCalories.push(ingredNut);

        //Removes decimal points from total meal calories, and displays total on page.
        mealCal = Math.trunc(mealCal);
        document.getElementById("meal-nutrition").textContent = "Calories: " + mealCal;
    };

    // Send the nutrition API request
    xhr.send(data);
    
};

//Function to display related picture of ingredient
function createPic(text){

    //Displays 'loading' picture while function is being run
    $('#wikipic').attr('src', 'https://as1.ftcdn.net/v2/jpg/04/25/61/02/1000_F_425610274_iTsjecWWkw4C37CDp5EBclLZg7x4fsKE.jpg');
    var firstSearchReturn;

    // Performs 1st wiki search to return related pages for the ingredient
    var URL1 = 'http://en.wikipedia.org/w/api.php?action=query&list=search&srsearch='+ text+'&format=json&callback=?';
    $.getJSON(URL1, function (data) {
              firstSearchReturn = data.query.search[0].pageid;
  
              
              var URL2 = 'http://en.wikipedia.org/w/api.php?action=query&pageids='+ firstSearchReturn +'&prop=pageimages&format=json&callback=?';
            //Performs 2nd wiki search to retrieve the first image from the first page returned in the previous query
              $.getJSON(URL2, function (data) {
              let searchString = firstSearchReturn.toString();
              var pic1 = (data.query.pages[searchString].pageimage).toString();
             
              // Generates an MD5 hash of the returned pic name
              // Then creates 2 sections of the returned hash which relate to the final URL of the pic to be displayed
              var hash = MD5.generate(pic1);
              var hash1 = hash.substr(0,1);
              var hash2 = hash.substr(0,2);
              $('#wikipic').attr('src', 'https://upload.wikimedia.org/wikipedia/commons/' + hash1 + '/' + hash2 + '/' + pic1);

          });


          });
  
  };

  //Event handler to prevent page reload if any button is pressed
  $('button').on('click', function(event){
    event.preventDefault();
  });

  //Event handler to open new window with a wiki search for the current ingredient if the 'more info' button is pressed 
  $('#moreInfo').on('click', function(){
    window.open(this.href,
    'targetWindow',
    'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=600'); 
return false;
});

//Event handler that, when 'add to favourites' button is pressed, checks local storage and adds the current meal to list of favourites
$('#fav-btn').on('click', function(){
    var fav = nameOfMeal;
    if (localStorage.getItem("recipe-favs") === null){
        var exisRecipe = []
        exisRecipe.push(fav);
        
    }
    else {
        exisRecipe = JSON.parse(localStorage.getItem('recipe-favs'));
            if (exisRecipe.indexOf(fav) === -1){
            exisRecipe.push(fav);
            
            }
            else return;
        
    }
    localStorage.setItem('recipe-favs', JSON.stringify(exisRecipe));

});

