var latitude = "";
var longitude = "";
var altitude = "";
var velocity = "";
var solar_lat = "";
var solar_lon = "";
var mymap = null;


function moveIss() {
    if (mymap !== null) mymap.remove();

    var queryURL = "https://api.wheretheiss.at/v1/satellites/25544";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);

            console.log(response.latitude);
            console.log(response.longitude);

            var altitude = response.altitude;
            var velocity = response.velocity;
            var visibility = response.visibility;
            var latitude = response.latitude;
            var longitude = response.longitude;
            var solar_lat = response.solar_lat;
            var solar_lon = response.solar_lon;

            var altitudeN = altitude.toFixed(2);
            var velocityN = velocity.toFixed(2);
            var latitudeN = latitude.toFixed(4);
            var longitudeN = longitude.toFixed(4);
            var solar_latN = solar_lat.toFixed(4);
            var solar_lonN = solar_lon.toFixed(4);

            $("#rowOne").text("Latitude:     " + latitudeN + "  |  " + "   Altitude:  " + altitudeN + " KM"),
            $("#rowTwo").text("Longitude:     " + longitudeN + "  | " + "   Velocity: " + velocityN + " KPH"),

            mymap = L.map("mapId").setView([latitudeN, longitudeN], 4 );
          

            var issIcon = L.icon({
                iconUrl: "img/iss2.png",

                iconSize: [45, 54], // size of the icon

            });

            L.tileLayer(
                "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
                {
                    attribution:
                        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 14,
                    id: "mapbox.streets",
                    accessToken:
                        "pk.eyJ1IjoicG1hY2s5OSIsImEiOiJjam1zNXh4c2owMGc5M3dwN2ZjeWloc2t5In0.OJ_GGAfAJgMK0OCnN2NbhA"
                }
            ).addTo(mymap);

            L.marker([latitudeN, longitudeN], { icon: issIcon }).addTo(mymap);

        });
    setTimeout(moveIss, 12000);

    

}

moveIss();


var time = 0;
var duration = 0;
var whereStart = [];
var whereEnd = [];
var howHigh = 0;
var maxHigh = 0;
var startEl = 0;
var maxEl = 0;
var passcount = 0;
var userInput = 0;
var cityState = 0;
var apiKeyMapquest = 0;
var caption = [];

$(".button").on("click", function (event) {

    event.preventDefault();
    //$("tbody").empty(" ");

    // var apiKeyMapquest = "VhIG9vrD4t2JMvh5f9k61v8rcGERpvxV";
    var apiKeyMapquest = "ua7RUmNymQq5oRMabONKpUlrpGpV3M6s";
    var userInput = $("input").val();
    var cityState = userInput.trim();
    console.log(cityState);

    var queryUrl =
        "https://www.mapquestapi.com/geocoding/v1/address?key=" +
        apiKeyMapquest +
        "&location=" +
        cityState;
    console.log(queryUrl);

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        var results = response.results;
        console.log(results);

        var lat = results[0].locations[0].displayLatLng.lat;
        var lon = results[0].locations[0].displayLatLng.lng;

        var queryURL = "https://www.n2yo.com/rest/v1/satellite/visualpasses/25544/" + lat + "/" + lon + "/0/2/300/&apiKey=LDUFJ6-J5J7F4-DCMYRA-3WB7"

        console.log(queryURL);


        // Performing our AJAX GET request
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            // After the data comes back from the API
            .then(function (response) {
                console.log(response);

                var passesCount = response.info.passescount;
                if (passesCount == 0) {
                    var newRow = $("<tr>").append(
                        $("<td>").text("There are no visible passes in the next 10 days"),

                    );

                    $("tbody").append(newRow);

                } else {
                    // Storing an array of results in the results variable
                    for (var i = 0; i < response.passes.length; i++) {
                        var time = response.passes[i].startUTC;


                        var dateString = moment.unix(time).format('LLLL');
                        console.log(dateString);

                        var duration = response.passes[i].duration;
                        console.log("Duration= " + duration + " seconds");

                        var whereStart = response.passes[i].startAzCompass
                        console.log("ISS appears from the " + whereStart);

                        var howHigh = response.passes[i].startEl
                        console.log("Starting Elevation = " + howHigh);

                        var maxHigh = response.passes[i].maxEl
                        console.log("Maximum Elevation = " + maxHigh);

                        var whereEnd = response.passes[i].endAzCompass
                        console.log("ISS disappears to the " + whereEnd);


                        var newRow = $("<tr>").append(

                            $("<td>").text(cityState),
                            $("<td>").text(dateString),
                            $("<td>").text(duration),
                            $("<td>").text(whereStart),
                            $("<td>").text(howHigh),
                            $("<td>").text(maxHigh),
                            $("<td>").text(whereEnd)
                        );

                        $("tbody").prepend(newRow);





                    }
                }

            })

    });
});

var i = 0;
var queryURL = "https://images-api.nasa.gov/search?q=iss&media_type=image"

$.ajax({
    url: queryURL,
    method: "GET"
})

    .then(function (response) {
        console.log(response);

        function issImages() {

            $("#apod1 img").remove();
            $(".caption").html(" ");

            i = Math.floor(Math.random() * 99 + 1);
            console.log(i);

            var apod = response.collection.items[i].links[0].href;
            var image = $("<img>").attr("src", apod).attr("class", "img").attr("class", "img-fluid").attr("alt", "Responsive image").attr("class", "float-right").attr("class", "rounded");
            var caption = response.collection.items[i].data[0].description;


            $("#apod1").append(image);
            $(".caption").append(caption);

            setTimeout(issImages, 30000);

        }

        issImages();


    });


