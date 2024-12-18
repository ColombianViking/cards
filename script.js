
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
        addImage(ele, "cards/common.svg")
        addImage(ele, "cards/rare.svg")
        addImage(ele, "cards/legend.svg")
    }
)