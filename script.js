document.getElementById("submit_btn").addEventListener("click", (e) => {
  //prevent refreshing
  e.preventDefault();

  //extract keywords input from the search bar
  let keywords = document.getElementById("input-city").value;
  console.log(keywords); // check input

  fetch(`http://localhost:3000/location/${keywords}`)
    .then((response) => response.json())
    .then((obj) => {
      for (let i = 0; i < 10; i++) {
        document
          .getElementById("card-container")
          .append(createCards(obj.data[i]));
      }

      //clear the search bar
      document.getElementById("input-city").value = "";

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
  // img.setAttribute("src", input.photo.images.small.url);
  // img.setAttribute("alt");

  let cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");

  let cardTitle = document.createElement("h4");
  cardTitle.setAttribute("class", "card-title");
  cardTitle.innerHTML = input.name;

  let address = document.createElement("h6");
  address.setAttribute("class", "card-title");
  address.innerHTML = input.address;

  let descriptionPara = document.createElement("p");
  descriptionPara.setAttribute("class", "card-text");
  // descriptionPara.innerHTML = input.description;

  let detailsBtn = document.createElement("a");
  detailsBtn.setAttribute("class", "btn btn-primary");
  detailsBtn.innerHTML = "View details";
  detailsBtn.setAttribute("href", input.website);

  cardBody.append(cardTitle, descriptionPara, detailsBtn);
  card.append(img, cardBody);

  return card;
}
