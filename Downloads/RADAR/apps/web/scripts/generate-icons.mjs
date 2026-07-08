import fs from "node:fs";

const png1x1 = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p94AAAAASUVORK5CYII=", "base64");
for (const file of ["favicon.ico", "icon-192.png", "icon-512.png", "apple-touch-icon.png"]) {
  fs.writeFileSync(new URL(`../public/${file}`, import.meta.url), png1x1);
}
console.log("Generated RADAR placeholder PNG icons from in-repo mark source.");
