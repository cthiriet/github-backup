#!/usr/bin/env zx

import pkg from "enquirer";
import fs from "fs";
const { prompt } = pkg;

if (!process.env["BACKUP_DIR"])
  throw new Error("BACKUP_DIR environment variable not set");
if (!process.env["GITHUB_TOKEN"])
  throw new Error("GITHUB_TOKEN environment variable not set");

cd(process.env["BACKUP_DIR"]);

// Use enquirer to select the affiliation
let affiliationResponse = await prompt({
  type: "select",
  name: "affiliation",
  message: "Choose your affiliation:",
  choices: ["owner", "collaborator", "organization_member"],
});
let affiliation = affiliationResponse.affiliation;

if (fs.existsSync(affiliation)) {
  throw new Error(`${affiliation} folder already exists`);
}

let res = await fetch(
  `https://api.github.com/user/repos?affiliation=${affiliation}&per_page=100`,
  {
    headers: {
      Authorization: `token ${process.env["GITHUB_TOKEN"]}`,
    },
  }
);
let data = await res.json();
let urls = data.map((x, i) => ({
  name: `${i} - ${x.full_name}`,
  value: x.clone_url,
}));

console.log(`Total repos fetched: ${urls.length}`);

// Use enquirer to prompt for repo selection
let selectedUrls = await prompt([
  {
    type: "multiselect",
    name: "repos",
    message: "Select repos to clone",
    choices: urls,
    initial: urls.map((_, index) => index), // Select all by default
  },
]);

console.log(`${selectedUrls.repos.length} repos selected for cloning`);

if (selectedUrls.repos.length > 0) {
  fs.mkdirSync(affiliation);
  cd(`./${affiliation}`);

  let cloneUrls = selectedUrls.repos.map(
    (repoName) => urls.find((url) => url.name === repoName).value
  );
  await Promise.allSettled(cloneUrls.map((url) => $`git clone ${url}`));
}
