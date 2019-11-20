#!/bin/bash
# for CI
# check this version is enable to release or not
# depended on https://github.com/azu/can-npm-publish
can-npm-publish --verbose
if [ $? -eq 1 ] ; then
  echo "Skip Release"
  exit 0;
fi

# get current version from package.json
TAG=$(cat package.json | grep version | cut -d " " -f 4 | tr -d "," | tr -d '"')
echo "add new tag to GitHub: ${TAG}"

# Add tag to GitHub
API_URL="https://api.github.com/repos/${REPO}/git/refs"

curl -s -X POST $API_URL \
  -H "Authorization: token $GITHUB_TOKEN" \
  -d @- << EOS
{
  "ref": "refs/tags/${TAG}",
  "sha": "${COMMIT}"
}
EOS
# release
npm publish
