#!/usr/bin/env zx

import fs from "fs";

if (!process.env["BACKUP_DIR"])
  throw new Error("BACKUP_DIR environment variable not set");

const repos = JSON.parse(fs.readFileSync("repos.json", "utf8"));

cd(process.env["BACKUP_DIR"]);

let folderName = "public";

if (fs.existsSync(folderName)) {
  console.log(`${folderName} folder already exists`);
} else {
  fs.mkdirSync(folderName);
}

cd(`./${folderName}`);

await Promise.all(repos.map((url) => $`git clone --depth=1 ${url}`));
