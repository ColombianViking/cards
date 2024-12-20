
function addImage(root, path) {
  let svg = document.createElement("div");
  let glow = document.createElement("div");
  glow.classList.add("glow");
  svg.classList.add("card");

  fetch(path)
    .then((response) => response.text())
    .then((svgContent) => {
      svg.innerHTML = svgContent;
    })
    .then((_) => svg.appendChild(glow))
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

addEventListener("load", 
    () => {
        let ele = document.getElementById("cg");
        // addImage(ele, "cards/common.svg")
        // addImage(ele, "cards/rare.svg")
        // addImage(ele, "cards/legend.svg")
        addImage(ele, "modified/Beevee.svg")
        addImage(ele, "modified/Lincoln_ora.svg")
        addImage(ele, "modified/Bibblets_serien.svg")
        addImage(ele, "modified/Mellobetyg.svg")
        addImage(ele, "modified/Kebab_picen.svg")
    }
)