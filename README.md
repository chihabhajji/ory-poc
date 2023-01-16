# Introduction

## Run locally

### Prequisites

[Docker](https://www.docker.com)
[Node](https://nodejs.org/en/)

### Steps

1. change the ip adresses of express1 and 2 to your network ip in contrib/oathkeeper/access-rules.yml
2. Run `docker-compose up --build --force-recreate -d`
3. Run `pnpm i && pnpm run dev` || `lerna bootstrap && lerna run dev`
4. Head over to [React client](http://127.0.0.1:3000) , please note that localhost and 127.0.0.1 are not the same in the context of this demo (refer to [Oathkeeper-Access-Rules](file://./contrib/quickstart/oathkeeper/access-rules.yml))
5. Dig around the repo, suggest changes, ask questions 😊

## Run on a cluster

### Helmchart
