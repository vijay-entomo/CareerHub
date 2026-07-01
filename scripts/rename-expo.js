const fs = require("fs");
const path = require("path");

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  // Replace all instances of _expo/ with expo/
  let newContent = content.replace(/\/_expo\//g, "/expo/");
  newContent = newContent.replace(/"_expo\//g, "\"expo/");
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, "utf8");
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      if (
        fullPath.endsWith(".html") ||
        fullPath.endsWith(".js") ||
        fullPath.endsWith(".css") ||
        fullPath.endsWith(".json")
      ) {
        replaceInFile(fullPath);
      }
    }
  }
}

// 1. Rename _expo to expo
const oldPath = path.join(__dirname, "../dist/_expo");
const newPath = path.join(__dirname, "../dist/expo");

if (fs.existsSync(oldPath)) {
  if (fs.existsSync(newPath)) {
    fs.rmSync(newPath, { recursive: true, force: true });
  }
  fs.renameSync(oldPath, newPath);
  console.log("Renamed dist/_expo to dist/expo");
}

// 2. Replace references in dist files
walkDir(path.join(__dirname, "../dist"));
console.log("Successfully replaced all _expo references to bypass GitHub Pages limits.");
