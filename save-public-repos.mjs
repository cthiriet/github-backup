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

// Clone repos in batches.
const batchSize = 1;
for (let i = 0; i < repos.length; i += batchSize) {
  const batch = repos.slice(i, i + batchSize);
  console.log(
    `Cloning batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
      repos.length / batchSize
    )} (${batch.length} repos)`
  );
  await Promise.allSettled(batch.map((url) => $`git clone --depth=1 ${url}`));
}
