#!/usr/bin/env bash
set -e

REPO_OWNER="anujyadav70750"
REPO_NAME="skill-foundry"
BRANCH="main"

# Read GITHUB_TOKEN from env or .env file
if [ -z "$GITHUB_TOKEN" ] && [ -f ".env" ]; then
  GITHUB_TOKEN=$(grep -E "^GITHUB_TOKEN=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
fi

if [ -z "$GITHUB_TOKEN" ]; then
  echo "ERROR: GITHUB_TOKEN is not set."
  echo "Please set GITHUB_TOKEN in your AI Studio Settings (or .env file) with repo write permissions."
  exit 1
fi

REMOTE_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/${REPO_OWNER}/${REPO_NAME}.git"

if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
  git config user.name "Anuj Yadav"
  git config user.email "anujyadav70750@gmail.com"
  git remote add origin "$REMOTE_URL"
  git fetch origin "$BRANCH"
  git reset --mixed origin/"$BRANCH"
  git branch -M "$BRANCH"
else
  git config user.name "Anuj Yadav"
  git config user.email "anujyadav70750@gmail.com"
  git remote set-url origin "$REMOTE_URL"
  git fetch origin "$BRANCH"
  git reset --mixed origin/"$BRANCH"
fi

echo "Staging files..."
git add -A

if git diff-index --quiet HEAD 2>/dev/null; then
  echo "No changes to commit."
else
  echo "Committing updates..."
  git commit -m "Refine blueprint prompt control bar typography and button width alignment"
fi

echo "Pushing to GitHub..."
git push origin "$BRANCH"
echo "Push successful!"

