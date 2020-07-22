mapboxgl.accessToken =
  "pk.eyJ1IjoiamFub3VzZWs3IiwiYSI6ImNrY3FyMmVpazBvbmMycm9jbm4zOHBwYnUifQ.IZ67E_Bijdd5cX686y2KJg";

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

let newCity = false;
document.getElementById("submit_btn").addEventListener("click", (e) => {
  //prevent refreshing
  e.preventDefault();
  newCity = true;

  //clear display section from last search
  document.getElementById("card-container").innerHTML = "";

  //extract keywords input from the search bar
  let keywords = document.getElementById("input-city").value;
  console.log(keywords); // check input

  fetch(`http://localhost:3000/location/${keywords}`)
    .then((response) => response.json())
    .then((obj) => {
      let count = 10;
      for (let i = 0; i < count; i++) {
        if (Object.keys(obj.data[i]).includes("ad_position")) {
          count++;
          continue;
        }
        if (i == 0) {
          map.flyTo({
            center: [obj.data[i].longitude, obj.data[i].latitude],
          });
        }
        if (i == 1) newCity = false;
        document
          .getElementById("card-container")
          .append(createCards(obj.data[i]));

        addMarker(obj.data[i]);
      }

      //clear the search bar
      document.getElementById("input-city").value = "";
      //check response.json in console
      console.log(obj);
    });

  fetch(`http://localhost:3000/weather/${keywords}`)
    .then((response) => response.json())
    .then((obj) => {
      console.log(obj);
      document.getElementById("card-container").append(createWeatherInfo(obj));
    });
});

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

//function to create weather info
function createWeatherInfo(weatherObj) {
  let weatherCard = document.createElement("p");
  weatherCard.setAttribute("class", "info-container");

  let weatherIcon = document.createElement("img");
  weatherIcon.setAttribute("src", weatherObj.weather.icon);

  let cityName = document.createElement("span");
  cityName.innerHTML = weatherObj.name;

  let temp = document.createElement("span");
  temp.innerHTML = weatherObj.main.temp;

  let description = document.createElement("span");
  description.innerHTML = weatherObj.weather.main;

  weatherCard.append(weatherIcon, cityName, temp, description);

  return weatherCard;
}

let markerArr = [];
function addMarker(obj) {
  if (newCity) {
    markerArr.forEach((x) => x.remove());
    markerArr = [];
  }
  let marker = new mapboxgl.Marker()
    .setLngLat([obj.longitude, obj.latitude])
    .addTo(map);
  markerArr.push(marker);
}
