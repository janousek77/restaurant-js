const express = require("express");
const app = express(); // instance of express
var cors = require("cors");

app.use(cors()); // gets us past cors errors

var unirest = require("unirest"); // backend http calls (get, post, put, delete)

app.get("/location/:location", function (req, res) {
  // a simple change
  //   second change
  const key = req.params.location;
  getLatLong(key)
    .then((obj) => getRestaurants(obj))
    .then((result) => res.json(result));
});

// Gets a cities info from api and sets a global variable to the result
function getLatLong(location) {
  return new Promise(function (resolve, reject) {
    var req = unirest(
      "GET",
      "https://tripadvisor1.p.rapidapi.com/locations/auto-complete"
    );
    req.query({
      lang: "en_US",
      units: "km",
      query: location,
    });

    req.headers({
      "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
      "x-rapidapi-key": "e4559a27f7msh2a8058a2bc9dac0p1bba75jsne0adc7f85b00",
      useQueryString: true,
    });

    req.end(function (res) {
      if (res.error) throw new Error(res.error);
      resolve(res.body.data[0].result_object);
    });
  });
}

// Api call function that gets a list of restaurants from a city by latitude and longitude
function getRestaurants(place) {
  return new Promise(function (resolve, reject) {
    var req = unirest(
      "GET",
      "https://tripadvisor1.p.rapidapi.com/restaurants/list-by-latlng"
    );

    req.query({
      limit: "30",
      currency: "USD",
      distance: "5",
      lunit: "km",
      lang: "en_US",
      latitude: place.latitude,
      longitude: place.longitude,
    });

    req.headers({
      "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
      "x-rapidapi-key": "e4559a27f7msh2a8058a2bc9dac0p1bba75jsne0adc7f85b00",
      useQueryString: true,
    });

    req.end(function (res) {
      if (res.error) throw new Error(res.error);
      resolve(res.body);
    });
  });
}

app.listen(3000);
