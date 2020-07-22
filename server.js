require("dotenv").config();
const express = require("express");
const request = require("request");
const app = express(); // instance of express

var cors = require("cors");

app.use(cors()); // gets us past cors errors

var unirest = require("unirest"); // backend http calls (get, post, put, delete)

// get restaurants based on the city name
app.get("/location/:location", function (req, res) {
  const key = req.params.location;
  getLatLong(key)
    .then((obj) => getRestaurants(obj))
    .then((result) => res.json(result));
});

//get weather info based on city name
app.get("/weather/:location", function (req, res) {
  const key = req.params.location;
  var data;
  request(
    `https://api.openweathermap.org/data/2.5/weather?q=${key}&units=imperial&appid=${process.env.weatherAPIKey}`,
    function (err, response, body) {
      data = JSON.parse(body);
      res.json(data);
    }
  );
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
      "x-rapidapi-key": process.env.tripadvisorKey,
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
      "x-rapidapi-key": process.env.tripadvisorKey,
      useQueryString: true,
    });

    req.end(function (res) {
      if (res.error) throw new Error(res.error);
      resolve(res.body);
    });
  });
}

// app.listen(process.env.PORT || 3000);
app.listen(3000);
