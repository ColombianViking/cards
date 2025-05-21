function addImage(root, path, clickToDismiss = false, coverCard = false, removeDuplicates = false) {


  let svg = document.createElement("div");
  if (removeDuplicates) {
    //create id for each card by cleaning the path
  let id = path.replace(/[^a-zA-Z0-9]/g, "");
  // check if card is already under this root
  if (root.querySelector(`#${id}`)) {
    return;
  }
  svg.id = id;
  }
  
  let glow = document.createElement("div");
  glow.classList.add("glow");
  svg.classList.add("card");


  fetch(path)
    .then((response) => response.text())
    .then((svgContent) => {
      svg.innerHTML = svgContent;
    })
    .then((_) => {svg.appendChild(glow)})
    .then((_) => root.appendChild(svg));

  function rotateToMouse(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;
    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2,
    };
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

    svg.style.transform = `
    scale3d(1.07, 1.07, 1.07)
    rotate3d(
      ${center.y / 100},
      ${-center.x / 100},
      0,
      ${Math.log(distance) * 3}deg
    )
  `;
    svg.querySelector('.glow').style.backgroundImage = `
    radial-gradient(
      circle at
      ${center.x * 2 + bounds.width/2}px
      ${center.y * 2 + bounds.height/2}px,
      #ffffff55,
      #0000000f
    )
  `;
  }


  if (coverCard) {
    svg.style.position = "relative";
    svg.style.zIndex = 100;
    svg.classList.add("cover");
  } else {
    svg.addEventListener("mouseenter", () => {
      bounds = svg.getBoundingClientRect();
      document.addEventListener("mousemove", rotateToMouse);
    });
  
    svg.addEventListener("mouseleave", () => {
      document.removeEventListener("mousemove", rotateToMouse);
      svg.style.transform = "";
      svg.style.background = "";
    });
  
  }
  

  if (clickToDismiss) {
    svg.addEventListener("click", () => {
      if (coverCard) {
        svg.style.animation = "packopen 1s";
      } else if (svg.style.animation) {
        return;
      } 
      else if (isCardInCollection(path)) {
        svg.style.animation = "cardaway 1s";
      } else {
        svg.style.animation = "collect 1s";
      }
      
      svg.addEventListener("animationend", () => {
        svg.remove();
      })
      if (!coverCard) {
        addImageToCollection(path);
      }
    });
  } else {
    // click on image to display a larger version of the image
    // click on the larger version to dismiss it
    svg.addEventListener("click", () => {
      let largeImage = document.createElement("div");
      largeImage.classList.add("largeImage");
      fetch(path)
        .then((response) => response.text())
        .then((svgContent) => {
          largeImage.innerHTML = svgContent;
        })
        .then((_) => {
          largeImage.addEventListener("click", () => {
            largeImage.remove();
          });
          document.body.appendChild(largeImage);
        });
    });
  }
}

function getCards() {
  let ele = document.getElementById("cg");
  fetch("firstcards.json").then((response) => response.json())
  .then((data) => {
    for (let card of data) {
      console.log(card);
      const title = card.title || "No Title";
      const outputFileName = `${title.replace(/ /g, "_")}.svg`;
      addImage(ele, "output/" + outputFileName);
    }
  })
  
}

//collection
// when an image is dismissed from a booster pack, it should be added to the collection
// the collection should be saved to local storage
// the collection should be loaded from local storage
// the collection should be displayed on the page

function addImageToCollection(path) {
  //check if path is already in collection
  if (isCardInCollection(path)) {
    return;
  }
  localStorage.setItem("collection", JSON.stringify([...getCollection(), path]));
  displayCollection();
}

function isCardInCollection(path) {
  return getCollection().includes(path);
}

function getCollection() {
  return JSON.parse(localStorage.getItem("collection")) || [];
}

function displayCollection() {
  let ele = document.getElementById("cg");
  for (let path of getCollection()) {
    addImage(ele, path, false, false, true);
  }
  updateCollectionCounter();
}

function clearCollection() {
  localStorage.removeItem("collection");
  displayCollection();
}

function addImagesToBooster() {
  let ele = document.getElementById("booster");

  // fetch all cards and add 4 commons and 1 rare
  // 1/8 change of getting a legendary

  fetch("firstcards.json").then((response) => response.json())
  .then((data) => {
    let commons = data.filter(card => card.rarity === "common");
    let rare = data.filter(card => card.rarity === "rare");
    let legendary = data.filter(card => card.rarity === "legend");
    let cards = [];
    for (let i = 0; i < 4; i++) {
      cards.push(commons[Math.floor(Math.random() * commons.length)]);
    }
    cards.push(rare[Math.floor(Math.random() * rare.length)]);
    let random = Math.random();
    if (random < 0.125) {
      cards.push(legendary[Math.floor(Math.random() * legendary.length)]);
      console.log("Legendary!");
    }
    for (let card of cards) {
      const title = card.title || "No Title";
      const outputFileName = `${title.replace(/ /g, "_")}.svg`;
      addImage(ele, "output/" + outputFileName, true);
    }
  }).then(() => {
      addImage(ele, "cards/cover.svg", true, true);
    }
  )
}

function updateCollectionCounter() {
  let counter = document.getElementById("counter");
  let finished = document.getElementById("finished"); // Get 'finished' element as well

  // get number of total cards and number in collection
  let total = 0;
  let collection = getCollection();
  fetch("firstcards.json").then((response) => response.json())
  .then((data) => {
    total = data.length;
    if (counter) { // Check if counter element exists
      counter.innerText = `${collection.length}/${total}`;
    }
    if (collection.length >= total) {
      if (finished) { // Check if finished element exists
        finished.style.display = "block";
        finished.innerHTML = "Grattis bibbi! Hoppas detta var kul och jag ser framemot att skapa fler minnen tillsammans!";
      }
    }
  })
}

addEventListener("load", 
    () => {
        displayCollection();
    }
)