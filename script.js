document.getElementById("submit_btn").addEventListener("click", (e) => {
  //prevent refreshing
  e.preventDefault();

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
          console.log("we got here");
          count++;
          continue;
        }
        document
          .getElementById("card-container")
          .append(createCards(obj.data[i]));
      }

      //clear the search bar
      document.getElementById("input-city").value = "";
      //check response.json in console
      console.log(obj);
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
  cardBody.append(cardTitle, address, descriptionContainer, detailsBtn);
  card.append(img, cardBody);

  return card;
}
