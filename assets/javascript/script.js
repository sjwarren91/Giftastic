var topics = [
    "Naruto",
    "Monkey D. Luffy",
    "Full Metal Alchemist",
    "Code Geass",
    "Dragon Ball Z",
    "Attack On Titan",
    "Tokyo Ghoul",
    "Ghost in the Shell",
    "Cowboy Bebop",
    "Psycho Pass"
];

var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=cowOAeiGWvGdEO89h5WnD0cWel5LBdO2&limit=10"
var favArray = [];

topics.forEach(function(value) {
    var button = $("<button>");
    button.attr("type", "button");
    button.addClass("btn btn-primary m-1");
    button.attr("data-offset", 0)
    button.text(value);
    $(".button-container").append(button);
});

function getGifs(){
    $("img").off("click", animateGif);
    var search = $(this).text();
    var offset = $(this).attr("data-offset");
    var URL = queryURL + "&q=" + search + "&offset=" + offset;
    $(this).attr("data-offset", parseInt(offset) + 10);
    console.log(URL);
    $.ajax({
        url: URL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        var items = response.data;
        console.log(items);
        items.forEach(function(value){
            var div = $("<div class='card'>");
            var rate = $("<p id='rating'>Rating: " + value.rating.toUpperCase() + "</p>");
            var favButton = $("<button class='fav-button'>Favourite</button>");
            console.log(rate)
            var image = $("<img class='gif' src='" + value.images.fixed_height_still.url + "'>");
            image.attr("data-still", value.images.fixed_height_still.url);
            image.attr("data-animate", value.images.fixed_height.url);
            image.attr("data-state", "still");
            
            div.prepend(rate, favButton, image);
            $(".gifs").append(div);
        });

        $("img").on("click", animateGif);
        $(".fav-button").off("click", favourite);
        $(".fav-button").on("click", favourite);
    });

    
}

function animateGif(){
    console.log("click")
    var state = $(this).attr("data-state");
    if(state === "still"){
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }

}

function newGifButton(){
    var newButton = $("#gifText").val();
    $("#gifText").val("");
    var button = $("<button>");
    button.attr("type", "button");
    button.addClass("btn btn-primary m-1");
    button.attr("data-offset", 0)
    button.text(newButton);
    button.on("click", getGifs);
    $(".button-container").append(button);
}

function favourite(){
    var rating = $(this).siblings("p").text();
    var still = $(this).siblings("img").attr("data-still");
    var animate= $(this).siblings("img").attr("data-animate");
    
    var imgObj = {
        still: still,
        animate: animate,
        rating: rating
    }

    favArray.push(imgObj);
    localStorage.setItem("favs", JSON.stringify(favArray));
    favGifs();
    console.log(favArray);
}

function favGifs(){
    $(".favs").empty()
    $("img").off("click", animateGif);
    favArray.forEach(function(value, index){
        var div = $("<div class='card'>");
        var rate = $("<p id='rating' style='color: black;'>" + value.rating + "</p>");
        var removeButton = $("<button class='remove-button'>Remove</button>");
        var image = $("<img class='gif' src='" + value.still + "'>");
        image.attr("data-still", value.still);
        image.attr("data-animate", value.animate);
        image.attr("data-state", "still");
        image.attr('data-index', index);
        
        div.prepend(rate, removeButton, image);
        $(".favs").append(div);
    });

    $("img").on("click", animateGif);
    $(".remove-button").off("click", remove);
    $(".remove-button").on("click", remove);
}

function remove(){
    var num = $(this).siblings("img").attr("data-index");
    favArray.splice(num, 1);
    console.log(num);
    $(this).parent().remove();
    localStorage.setItem("favs", JSON.stringify(favArray));
}

$(document).ready(function() {

    $("#newGif").on("click", function(event){
        event.preventDefault();
        newGifButton();
    });

    $(".btn-primary").on("click", getGifs);

    $('#sidebarCollapse').on('click', function () {
        $('.sidebar').toggleClass('active');
        $('.main').toggleClass('active');
    });

    favArray = JSON.parse(localStorage.getItem("favs"));
    favGifs();

});
