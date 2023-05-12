# GitHub Backup 💾

Save your GitHub repositories to a local directory.

## Dependencies

You must have [Node.js](https://nodejs.org/en), `npm` and [`zx`](https://github.com/google/zx) installed globally on your machine.

To install `zx`, run the following command:

```bash
npm i -g zx
```

## Setup your credentials

Create a [personal access token (classic)](https://github.com/settings/tokens/new) with the `repo` scope.

![](./assets/token.png)

## Usage

### 1 - Setup your environment variables

Export your variables by running the following commands in your terminal:

```bash
export GITHUB_TOKEN="<personal-access-token>"
export BACKUP_DIR="<path-to-backup-directory>"
```

> `BACKUP_DIR` is the absolute path to the directory where you want to save your repos.

### 2 - Run the script

This script will clone all your repositories to the `BACKUP_DIR` directory.

```bash
zx main.mjs
```

### 3 - (Optional) Save public repositories

You might want to save some cool GitHub public repositories as well.

To do so, add the URL of the repos in the `repos.json` file and run the following command:

```bash
zx save-public-repos.mjs
```

> They will be saved in the `$BACKUP_DIR/public` directory.
