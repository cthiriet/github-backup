#!/usr/bin/env zx

import fs from "fs";

cd(process.env["BACKUP_DIR"]);

let affiliation =
  (await question(
    "Choose your affiliation (owner,collaborator,organization_member): (owner) ",
    {
      choices: ["owner", "collaborator", "organization_member"],
    }
  )) || "owner";

if (fs.existsSync(affiliation)) {
  throw new Error(`${affiliation} folder already exists`);
} else {
  fs.mkdirSync(affiliation);
}

let headers = {};
let token = process.env["GITHUB_TOKEN"];
if (token) {
  headers = {
    Authorization: `token ${token}`,
  };
}
let res = await fetch(
  `https://api.github.com/user/repos?affiliation=${affiliation}&per_page=100`,
  {
    headers,
  }
);
let data = await res.json();
let urls = data.map((x) => x.clone_url);

console.log(urls);
console.log(`${urls.length} repos will be cloned`);

let clone =
  (await question("Clone these repos: (yes) ", {
    choices: ["yes", "no"],
  })) || "yes";

if (clone === "yes") {
  cd(`./${affiliation}`);
  await Promise.all(urls.map((url) => $`git clone ${url}`));
}
