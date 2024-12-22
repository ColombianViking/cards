const fs = require("fs");
const path = require("path");

// Paths
const CARDS_DIR = "cards";
const IMAGES_DIR = "images";
const OUTPUT_DIR = "output";

// Placeholder keys in SVG templates
const PLACEHOLDERS = {
  title: "{{TITLE}}",
  description_1: "{{DESCRIPTION_1}}",
  description_2: "{{DESCRIPTION_2}}",
  description_3: "{{DESCRIPTION_3}}",
  description_4: "{{DESCRIPTION_4}}",
  image: "{{IMAGE_PATH}}",
};

// Function to replace placeholders in SVG content
function generateCard(
  templatePath,
  outputPath, 
  title, 
  description_1,
  description_2, 
  description_3, 
  description_4, 
  imagePath) {
  const svgContent = fs.readFileSync(templatePath, "utf8");

  // Replace placeholders
  const updatedSvg = svgContent
    .replace(PLACEHOLDERS.title, title)
    .replace(PLACEHOLDERS.description_1, description_1)
    .replace(PLACEHOLDERS.description_2, description_2)
    .replace(PLACEHOLDERS.description_3, description_3)
    .replace(PLACEHOLDERS.description_4, description_4)
    .replaceAll(PLACEHOLDERS.image, imagePath);
  
  // Save the modified SVG
  fs.writeFileSync(outputPath, updatedSvg, "utf8");
}

// Main function to process the JSON definitions
function processCards(jsonFile) {
  // Ensure the output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  // Load JSON data
  const cards = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

  cards.forEach((card) => {
    const title = card.title || "No Title";
    const description_1 = card.description_1 || "No Description";
    const description_2 = card.description_2 || "";
    const description_3 = card.description_3 || "";
    const description_4 = card.description_4 || "";
    const rarity = (card.rarity || "common").toLowerCase();
    const imageName = card.image || "";

    // Determine paths
    const templatePath = path.join(CARDS_DIR, `${rarity}.svg`);
    if (!fs.existsSync(templatePath)) {
      console.error(`Template for rarity '${rarity}' not found. Skipping card.`);
      return;
    }

    const imagePath = path.join(IMAGES_DIR, imageName);
    if (!fs.existsSync(imagePath)) {
      console.error(`Image '${imageName}' not found. Skipping card.`);
      return;
    }

    // Output file path
    const outputFileName = `${title.replace(/ /g, "_")}.svg`;
    const outputPath = path.join(OUTPUT_DIR, outputFileName);

    // Generate card
    generateCard(
      templatePath, 
      outputPath, 
      title, 
      description_1, 
      description_2, 
      description_3, 
      description_4, 
      imagePath);
    console.log(`Generated card: ${outputFileName}`);
  });
}

// Command-line arguments
if (process.argv.length < 3) {
  console.error("Usage: node generateCards.js <path-to-json-file>");
  process.exit(1);
}

// Run the script
const jsonFile = process.argv[2];
processCards(jsonFile);
