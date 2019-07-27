//Set up initial gifs button topics
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

//Initial API query to return 10 values
var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=cowOAeiGWvGdEO89h5WnD0cWel5LBdO2&limit=10";

//array for keeping track of localStorage information
var favArray = [];

//adding buttons to the DOM for each of the initial topics
topics.forEach(function(value) {
    var button = $("<button>");
    button.attr("type", "button");
    button.addClass("btn btn-primary m-1");
    button.attr("data-offset", 0);
    button.text(value);
    $(".button-container").append(button);
});

//function for printing gifs to the gifs section
function getGifs() {
    $("img").off("click", animateGif);
    // define our API query term based on the topic in the button thats clicked
    var search = $(this).text();
    // define offset for adding 10 new gifs to the page instead of the same 10
    var offset = $(this).attr("data-offset");
    //add these query terms to our API URL
    var URL = queryURL + "&q=" + search + "&offset=" + offset;
    $(this).attr("data-offset", parseInt(offset) + 10);
    //our ajax query along with our function to print the gifs to the DOM
    $.ajax({
        url: URL,
        method: "GET"
    })
        .then(function(response) {
            var items = response.data;
            items.forEach(function(value) {
                //create new elements for the gifs
                var div = $("<div class='card'>");
                var rate = $("<p id='rating'>Rating: " + value.rating.toUpperCase() + "</p>");
                var favButton = $("<button class='fav-button'>Favourite</button>");
                var image = $("<img class='gif' src='" + value.images.fixed_height_still.url + "'>");
                //add still/animated gif URLs as data to the img
                image.attr("data-still", value.images.fixed_height_still.url);
                image.attr("data-animate", value.images.fixed_height.url);
                image.attr("data-state", "still");
                //add them to the gif area
                div.prepend(rate, favButton, image);
                $(".gifs").prepend(div);
            });
        })
        //once the ajax query is done add click events to the image and to the favourite button
        .done(function() {
            $("img").on("click", animateGif);
            $(".fav-button").off("click", favourite);
            $(".fav-button").on("click", favourite);
        });
}

//function for animating the gifs by switching the url src
function animateGif() {
    var state = $(this).attr("data-state");
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
}

//function for adding new topics as buttons
function newGifButton() {
    var newButton = $("#gifText").val();
    $("#gifText").val("");
    var button = $("<button>");
    button.attr("type", "button");
    button.addClass("btn btn-primary m-1");
    button.attr("data-offset", 0);
    button.text(newButton);
    button.on("click", getGifs);
    $(".button-container").append(button);
}

//function for adding favourite gif to localStorage 
function favourite() {
    //take all the attributes of the selected gif
    var rating = $(this)
        .siblings("p")
        .text();
    var still = $(this)
        .siblings("img")
        .attr("data-still");
    var animate = $(this)
        .siblings("img")
        .attr("data-animate");
    //create an object of them
    var imgObj = {
        still: still,
        animate: animate,
        rating: rating
    };

    //add them to the global favourite gifs array
    favArray.push(imgObj);
    //set this array as data in local storage
    localStorage.setItem("favs", JSON.stringify(favArray));
    //call function to print fav gifs to sidebar
    favGifs();
    
}

//similar function to printing the gifs from the API to the screen
//could probably make it one function and call it in each of the sections required
//but with different inputs, cbf =)
function favGifs() {
    $(".favs").empty();
    $("img").off("click", animateGif);
    favArray.forEach(function(value) {
        var div = $("<div class='card'>");
        var rate = $("<p id='rating' style='color: black;'>" + value.rating + "</p>");
        var removeButton = $("<button class='remove-button'>Remove</button>");
        var image = $("<img class='gif' src='" + value.still + "'>");
        image.attr("data-still", value.still);
        image.attr("data-animate", value.animate);
        image.attr("data-state", "still");

        div.prepend(rate, removeButton, image);
        $(".favs").append(div);
    });

    //add animation clicks and click event to remove from favourites
    $("img").on("click", animateGif);
    $(".remove-button").off("click", remove);
    $(".remove-button").on("click", remove);
}

//function to remove favourites from sidebar
function remove() {
    //get the url of the gif
    var id = $(this)
        .siblings("img")
        .attr("data-still");
    //compare it with the gif urls in the fav gif array
    for(let i = 0; i < favArray.length; i++){
        //remove it
        if(favArray[i].still === id){
            favArray.splice(i,1)
        }   
    };
    
    //remove from the DOM
    $(this)
        .parent()
        .remove();
    localStorage.setItem("favs", JSON.stringify(favArray));
}

//initialize stuff
$(document).ready(function() {
    $("#newGif").on("click", function(event) {
        event.preventDefault();
        newGifButton();
    });

    $(".btn-primary").on("click", getGifs);

    $("#sidebarCollapse").on("click", function() {
        $(".sidebar").toggleClass("active");
        $(".main").toggleClass("active");
    });

    favArray = JSON.parse(localStorage.getItem("favs"));
    
    if(favArray){
       favGifs(); 
    }
    
});
