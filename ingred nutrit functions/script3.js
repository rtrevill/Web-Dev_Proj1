var mealNameInput = document.getElementById('meal-name');
var ingredCalories = [
    {
    'namey': '600g Haddock',
    'calories': '200'
},
{
    'namey': '300g Potatoes',
    'calories': '250'
},
{
    'namey': '1 chopped Green Chilli',
    'calories': '300'
},
{
    'namey': '3 tbs Coriander',
    'calories': '350'
},
{
    'namey': '1 tsp Cumin Seeds',
    'calories': '400'
},
{
    'namey': '1/2 tsp Pepper',
    'calories': '450'
},
{
    'namey': '3 cloves Garlic',
    'calories': '500'
},
{
    'namey': '2 pieces Ginger',
    'calories': '550'
},
{
    'namey': '2 tbs Flour',
    'calories': '600'
},
{
    'namey': '3 Eggs',
    'calories': '650'
},
{
    'namey': '75g Breadcrumbs',
    'calories': '700'
},
{
    'namey': 'For frying Vegetable Oil',
    'calories': '750'
}
];




$('#search-button').on("click", () => {
    console.log("Hello");
    const mealName = mealNameInput.value;
    search(mealName);
    if (mealName.trim() === "") {
        alert("Please enter a meal name.");
        return ;
    }
});



function search(mealName){
$('#meals').empty();
fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + mealName)
.then(response => response.json())
.then(data => {
    console.log(data.meals);
    ingredCalories = [];
    var mealObject = data.meals[1];

    var title = mealObject.strMeal;
    console.log(mealObject);
    // var i=0;
    var header = $('<ul>')
    $(header).attr('class', 'menuTitle');
    $(header).text(title);


    $('#meals').append(header);

    for (var i=1; i < 20; i++){
        // console.log(this);
        var ingred = ("strIngredient" + [i]);
        var ingredReal = (mealObject[ingred]);
        var measure = ("strMeasure" + [i]);
        var measureReal = (mealObject[measure]);
        console.log(ingredReal, measureReal);
        var newLi = $('<li>');
        $(newLi).attr('id', ingredReal);
        $(newLi).text(measureReal + " " + ingredReal);
        $('.menuTitle').append(newLi);
        var ingredMeasure = (measureReal + " " + ingredReal);
        nutrition(ingredMeasure);


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
      );

    $("li").hover(function() {
        console.log(this.innerText);
        console.log(ingredCalories[0].namey);
        for (let names in ingredCalories){
            // console.log(this);
            if ((ingredCalories[names].namey)===(this.innerText)){
            console.log(ingredCalories[names].namey, ingredCalories[names].calories);
            $('textarea').text(ingredCalories[names].namey + " "+ ingredCalories[names].calories + " calories");

            };

        };
        
        

    })

   
        
    
})};

// $("li").on("click", function() {
//     console.log(this.innerText);
//       createPic(this.innerText);
//   }
// );

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
  

function nutrition(foody){
    var data = JSON.stringify({
        'query': foody
      });

    let xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    xhr.open('POST', 'https://trackapi.nutritionix.com/v2/natural/nutrients');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-app-id', '85bf26cc');
    xhr.setRequestHeader('x-app-key', '870ce77a00d37c45bcebfbc8725e4f11');
    
    xhr.onload = function() {
      // console.log(xhr.response);
      var butterNutrients = JSON.parse(xhr.response);
      ingredientNutrition = butterNutrients.foods[0].nf_calories;
    //   alert("Calories: " + ingredientNutrition);
      console.log(ingredientNutrition);

      var ingredNut = {
          "namey": foody,
          "calories" : ingredientNutrition,
      };
      ingredCalories.push(ingredNut);
      console.log(ingredCalories);

    };
    
    xhr.send(data);
    
}

$('#ingred-btn').on('click', function(event){
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