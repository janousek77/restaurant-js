document.getElementById("submit_btn").addEventListener("click", (e) => {
  //prevent refreshing
  e.preventDefault();

  //extract keywords input from the search bar
  let keywords = document.getElementById("search-input-restaurants").value;
  console.log(keywords); // check input

  document.getElementById("card-container").append(createCards(keywords));
});

//function to create cards
function createCards(input) {
  let card = document.createElement("div");
  card.setAttribute("class", "card");
  card.setAttribute("style", "width:18rem");

  let img = document.createElement("img");
  img.setAttribute("class", "card-img-top");
  img.setAttribute("style", "height:fit-content");
  img.setAttribute(
    "src",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
  );
  img.setAttribute("alt", "??????");

  let cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");

  let cardTitle = document.createElement("h5");
  cardTitle.setAttribute("class", "card-title");
  cardTitle.innerHTML = "????????The restaurant";

  let descriptionPara = document.createElement("p");
  descriptionPara.setAttribute("class", "card-text");
  descriptionPara.innerHTML = "????????Good!";

  let detailsBtn = document.createElement("a");
  detailsBtn.setAttribute("class", "btn btn-primary");
  detailsBtn.innerHTML = "View details";
  detailsBtn.setAttribute("href", "https://www.applebees.com/en");

  cardBody.append(cardTitle, descriptionPara, detailsBtn);
  card.append(img, cardBody);

  return card;
}

// fetch("http://localhost:3000/location/seattle")
//   .then((response) => response.json())
//   .then((data) => console.log(data));
