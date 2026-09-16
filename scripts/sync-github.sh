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

echo "Authenticating and pushing to https://github.com/${REPO_OWNER}/${REPO_NAME}.git on branch ${BRANCH}..."
git remote set-url origin "https://x-access-token:${GITHUB_TOKEN}@github.com/${REPO_OWNER}/${REPO_NAME}.git"
git push origin "${BRANCH}"
echo "Push successful!"
