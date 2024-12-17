
function addImage(root, path) {
  let svg = document.createElement("div");
  svg.classList.add("card");
  fetch(path)
    .then((response) => response.text())
    .then((svgContent) => {
      svg.innerHTML = svgContent;
    })
    .then((_) => root.appendChild(svg));
}

addEventListener("load", 
    () => {
        let ele = document.getElementById("cg");
        console.log("hello")
        addImage(ele, "cards/test.svg")
        addImage(ele, "cards/mys.svg")
    }
)