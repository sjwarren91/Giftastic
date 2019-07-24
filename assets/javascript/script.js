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
            console.log(rate)
            var image = $("<img class='gif' src='" + value.images.fixed_height_still.url + "'>");
            image.attr("data-still", value.images.fixed_height_still.url);
            image.attr("data-animate", value.images.fixed_height.url);
            image.attr("data-state", "still");
            div.prepend(rate, image);
            $(".gifs").prepend(div);
            
        })
        $("img").on("click", animateGif);
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
    button.text(newButton);
    button.on("click", getGifs);
    $(".button-container").append(button);
}

$(document).ready(function() {
    $("#newGif").on("click", function(event){
        event.preventDefault();
        newGifButton();
        
    });
    $(".btn-primary").on("click", getGifs);
});
