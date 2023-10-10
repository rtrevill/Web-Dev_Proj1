// Check if the page is meal.html
if (window.location.pathname.includes("meal.html")) {
    // Get the meal name from the URL query parameter
    var nameOfMeal;
    var mealCal=0;
    var ingredCalories = [];
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
            console.log(data);
            if (data.meals && data.meals.length > 0) {
                const meal = data.meals[0];
                nameOfMeal = meal.strMeal;
                let detailsHTML = `
                    <h1>${meal.strMeal}</h1>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200">
                    <h3>Category: ${meal.strCategory}</h3>
                    <h3>Cuisine: ${meal.strArea}</h3>
                    <p>${meal.strInstructions}</p>
                    <h3>Ingredients:</h3>
                    <ul id="ingredient-list">
                `;

                search(nameOfMeal);
           
                    
                    
                //Khoi's original code
                // Loop through ingredients and measures
                // for (let i = 1; i <= 20; i++) {
                //     const ingredient = meal[`strIngredient${i}`];
                //     const measure = meal[`strMeasure${i}`];
                //     if (ingredient && measure) {
                //         detailsHTML += `<li>${ingredient} - ${measure}</li>`;
                //     }
                // }

                // detailsHTML += "</ul>";
                // detailsHTML += "<h3>Nutrition Values:</h3>";


        




                // Call the nutrition function to calculate and display nutrition data
                //nutrition(meal.strMeal);

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
    document.getElementById("meal-nutrition").textContent = "Calories: " + mealCal;

}


function search(mealName){
    console.log(mealName);
    $('#ingredient-list').empty();
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        var mealObject = data.meals[0];
    
        // var title = mealObject.strMeal;
        // console.log(mealObject);
        // // var i=0;
        // var header = $('<ul>')
        // $(header).attr('class', 'menuTitle');
        // $(header).text(title);
    
        // $('#ingredient-list').append(header);
        for (var i=1; i < 20; i++){
            // console.log(this);
            var ingred = ("strIngredient" + [i]);
            var ingredReal = (mealObject[ingred]);
            var measure = ("strMeasure" + [i]);
            var measureReal = (mealObject[measure]);
            if (ingredReal !== ""){
            console.log(ingredReal, measureReal);
            var newLi = $('<li>');
            $(newLi).attr('id', ingredReal);
            $(newLi).addClass("ingredient");
            $(newLi).text(measureReal + " " + ingredReal);
            $('#ingredient-list').append(newLi);
            var ingredMeasure = (measureReal + " " + ingredReal);
            nutrition(ingredMeasure);
            // document.getElementById("meal-nutrition").textContent = "Calories: " + mealCal;

            };
            
        }

        $("li").on("click", function() {
            console.log(this.id)
            var food = this.id;
            var infolink = food.replace(/\ /g,'+');;
            console.log(infolink);
            $('#moreInfo').attr("href", 'https://en.wikipedia.org/w/index.php?fulltext=1&search=' + infolink +'&title=Special%3ASearch&ns0=1');    
            console.log(food);
            createPic(food);
          }
        );   // $(ingredient).attr('id', this.strIngredient[i]);
        

        $("li").hover(function() {
            console.log(this.innerText);
            // console.log(ingredCalories[0].namey);
            for (let names in ingredCalories){
                // console.log(this);
                if ((ingredCalories[names].namey)===(this.innerText)){
                console.log(ingredCalories[names].namey, ingredCalories[names].calories);
                $('#ingredient-nutrition').text(ingredCalories[names].namey + " "+ ingredCalories[names].calories + " calories");
    
                };
    
            };
            
            
    
        })
            // $('.menutitle').append(ingredient);
        // document.getElementById("meal-nutrition").textContent = "Calories: " + mealCal;

        })
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
    xhr.setRequestHeader('x-app-id', '85bf26cc');
    xhr.setRequestHeader('x-app-key', '870ce77a00d37c45bcebfbc8725e4f11');

    var tempo2 = xhr.onload = function () {
        // Parse the nutrition data received from the API
        var butterNutrients = JSON.parse(xhr.response);
        ingredientNutrition = butterNutrients.foods[0].nf_calories;

        console.log(ingredientNutrition);
        mealCal += ingredientNutrition;
        // Display the calculated calories (nutrition) in the HTML
        // document.getElementById("meal-nutrition").textContent = "Calories: " + ingredientNutrition;
        var ingredNut = {
            "namey": foody,
            "calories" : ingredientNutrition,
        };
        ingredCalories.push(ingredNut);
        console.log(ingredCalories);
 

    };

    // Send the nutrition API request
    xhr.send(data);
    
}

function createPic(text){
    $('#wikipic').attr('src', 'https://as1.ftcdn.net/v2/jpg/04/25/61/02/1000_F_425610274_iTsjecWWkw4C37CDp5EBclLZg7x4fsKE.jpg');
    var firstSearchReturn;
    var URL1 = 'http://en.wikipedia.org/w/api.php?action=query&list=search&srsearch='+ text+'&format=json&callback=?';
    // URL1 += "&callback=?";
    $.getJSON(URL1, function (data) {
              console.log(data);
              firstSearchReturn = data.query.search[0].pageid;
  
              var URL2 = 'http://en.wikipedia.org/w/api.php?action=query&pageids='+ firstSearchReturn +'&prop=pageimages&format=json&callback=?';
                // URL2 += "&callback=?";
  
              $.getJSON(URL2, function (data) {
              let searchString = firstSearchReturn.toString();
             
              console.log(data);
              var pic1 = (data.query.pages[searchString].pageimage).toString();
             
              var hash = MD5.generate(pic1);
              console.log(hash);
              var hash1 = hash.substr(0,1);
              var hash2 = hash.substr(0,2);
              $('#wikipic').attr('src', 'https://upload.wikimedia.org/wikipedia/commons/' + hash1 + '/' + hash2 + '/' + pic1);
  
              
              
          });
              
          });
  

  
  };

  $('#infobtn').on('click', function(event){
    event.preventDefault();
  })

  $('#moreInfo').on('click', function(){
    // $('#moreInfo').attr("href", newLink);
    console.log(this);
    window.open(this.href,
    'targetWindow',
    'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=600'); 
return false;
})

