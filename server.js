const express = require("express");
const app = express(); // instance of express
var cors = require("cors");

app.use(cors()); // gets us past cors errors

var unirest = require("unirest"); // backend http calls (get, post, put, delete)

var place; // variable returned object from first api call that has city info
var list;

app.get("/location/:location", function (req, res) {
  place = undefined;
  list = undefined;
  const key = req.params.location;

  getLatLong(key); //calls api and gets a citys info

  if (place === undefined)
    //sometimes response from api is slow. Waits 2 seconds to make sure if it is slow
    setTimeout(function () {
      getRestaurants(); //getRestaurants() gets a list of restaurants from the city
    }, 2000);
  else getRestaurants();

  if (list === undefined)
    setTimeout(function () {
      res.json(list); //sends back list of restaurants from the city
    }, 5000);
  else res.json(list);
});

function getLatLong(location) {
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
    place = res.body.data[0].result_object;
    // console.log(place);
  });
}

function getRestaurants() {
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
    list = res.body;
  });
}

app.listen(3000);
