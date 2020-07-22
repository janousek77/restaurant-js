mapboxgl.accessToken =
  "pk.eyJ1IjoiamFub3VzZWs3IiwiYSI6ImNrY3FyMmVpazBvbmMycm9jbm4zOHBwYnUifQ.IZ67E_Bijdd5cX686y2KJg";

// const url = "https://super-eater.herokuapp.com";
const url = "http://localhost:3000";

var map = new mapboxgl.Map({
  container: "map_container",
  style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
  center: [-122.3321, 47.6062], // starting position [lng, lat]
  zoom: 9, // starting zoom
});

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  })
);

let start = 0;
let count = 10;
let newCity = false;
let restObj;
document.getElementById("submit_btn").addEventListener("click", (e) => {
  //prevent refreshing
  e.preventDefault();
  newCity = true;

  //clear display section from last search
  document.getElementById("card-container").innerHTML = "";

  //extract keywords input from the search bar
  let keywords = document.getElementById("input-city").value;

  fetch(`${url}/location/${keywords}`)
    .then((response) => response.json())
    .then((obj) => {
      restObj = obj;
      cardLoop(obj);
      //clear the search bar
      document.getElementById("input-city").value = "";
    });

  fetch(`${url}/weather/${keywords}`)
    .then((response) => response.json())
    .then((obj) => {
      addWeather(obj);
    });
});

// loops through city restaurant object and sends each restaurant to the createCards()
function cardLoop(obj) {
  if (newCity) {
    start = 0;
    count = 10;
  }
  for (let i = start; i < count; i++) {
    if (Object.keys(obj.data[i]).includes("ad_position")) {
      count++;
      continue;
    }
    // moves map center to the first restuarants lat/long
    if (i == 0) {
      map.flyTo({
        center: [obj.data[i].longitude, obj.data[i].latitude],
      });
    }
    if (i == 1) newCity = false;
    document.getElementById("card-container").append(createCards(obj.data[i]));

    addMarker(obj.data[i]);
  }
  let more = document.createElement("button");
  more.innerHTML = "Show more restuarants";
  more.setAttribute("id", "more-btn");
  document.getElementById("card-container").append(more);

  more.onclick = function () {
    cardLoop(restObj);
    more.parentNode.removeChild(more);
  };
  start = count;
  count += 10;
}

// adds weather section to page
function addWeather(obj) {
  document.getElementById("cityName").innerHTML =
    obj.name + " current weather: " + "</t>";
  document.getElementById("temp").innerHTML =
    Math.round(obj.main.temp) + "&deg" + "</t>";
  document.getElementById("description").innerHTML = obj.weather[0].description;
  document
    .getElementById("weatherIcon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png`
    ) + "</t>";
  document.getElementById("max-min-temp").innerHTML =
    Math.round(obj.main.temp_max) +
    "&deg" +
    "/" +
    Math.round(obj.main.temp_min) +
    "&deg" +
    "</t>";
}

//function to create cards
function createCards(input) {
  let card = document.createElement("div");
  card.setAttribute("class", "card");
  card.setAttribute("style", "width:18rem");

  let img = document.createElement("img");
  img.setAttribute("class", "card-img-top");
  img.setAttribute("style", "height:fit-content");
  if (input.photo !== undefined) {
    img.setAttribute("src", input.photo.images.small.url);
  } else {
    img.setAttribute(
      "src",
      "https://www.questrmg.com/wp-content/uploads/2019/03/web-banner-Top-Three-Restaurant-Trends.jpg"
    );
  }
  img.setAttribute("alt", input.name);

  let cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");

  let cardTitle = document.createElement("h4");
  cardTitle.setAttribute("class", "card-title");
  cardTitle.innerHTML = input.name;

  let address = document.createElement("h6");
  address.setAttribute("class", "card-subtitle");
  address.innerHTML = input.address;

  let descriptionContainer = document.createElement("div");
  descriptionContainer.setAttribute("class", "card-text-container");

  let descriptionPara = document.createElement("p");
  descriptionPara.setAttribute("class", "card-text");
  descriptionPara.innerHTML = input.description;

  let priceLevel = document.createElement("p");
  priceLevel.setAttribute("class", "price-level");
  if (input.price_level !== undefined && input.price_level !== "") {
    priceLevel.innerHTML = "Price: " + input.price_level;
  } else if (input.price !== undefined && input.price !== "") {
    priceLevel.innerHTML = "Price: " + input.price;
  } else {
    priceLevel.innerHTML = "Price: N/A";
  }

  let detailsBtn = document.createElement("a");
  detailsBtn.setAttribute("class", "btn btn-primary");
  detailsBtn.innerHTML = "View details";
  //if restaurant website exists, link to restaurant website; otherwise, link to trip advisor website
  if (input.website !== undefined) {
    detailsBtn.setAttribute("href", input.website);
  } else {
    detailsBtn.setAttribute("href", input.web_url);
  }

  descriptionContainer.append(descriptionPara);
  cardBody.append(
    cardTitle,
    address,
    descriptionContainer,
    priceLevel,
    detailsBtn
  );
  card.append(img, cardBody);

  return card;
}

let markerArr = []; // holds all the markers in a city
// Adds a marker for each restuaraunt to the map
function addMarker(obj) {
  if (newCity) {
    // if a new city is chosen removes all the markers on the map
    markerArr.forEach((x) => x.remove());
    markerArr = [];
  }
  let photo =
    obj.photo === undefined
      ? "https://www.questrmg.com/wp-content/uploads/2019/03/web-banner-Top-Three-Restaurant-Trends.jpg"
      : obj.photo.images.small.url;
  let marker = new mapboxgl.Marker() // creates markers of city
    .setLngLat([obj.longitude, obj.latitude])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        "<img class=mapIcon src=" +
          photo +
          "> <h6>" +
          obj.name +
          "</h6>" +
          obj.address
      )
    )
    .addTo(map);

  markerArr.push(marker);
}

// document.getElementById("more-btn").onclick = function morePush(restObj) {
//   console.log("more push");
//   console.log(restObj);
//   // cardLoop(restObj);
//   // more.parentNode.removeChild(more);
// };
