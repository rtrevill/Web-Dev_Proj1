var mealNameInput = document.getElementById('meal-name');

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

    }
    $("li").on("click", function() {
        console.log(this.id)
        var food = this.id;
        console.log(food);
          createPic(food);
      }
    );   // $(ingredient).attr('id', this.strIngredient[i]);
        // $('.menutitle').append(ingredient);
    })
}

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
  
