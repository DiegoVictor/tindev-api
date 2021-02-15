# [API] Tindev
[![Travis (.org)](https://img.shields.io/travis/com/DiegoVictor/tindev-api?logo=travis&style=flat-square)](https://travis-ci.com/DiegoVictor/tindev-api.svg?branch=master)
[![mongo](https://img.shields.io/badge/mongodb-3.6.3-13aa52?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![redis](https://img.shields.io/badge/redis-2.8.0-d92b21?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![nodemon](https://img.shields.io/badge/nodemon-1.19.4-76d04b?style=flat-square&logo=nodemon)](https://nodemon.io/)
[![eslint](https://img.shields.io/badge/eslint-6.8.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-24.9.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/tindev-api?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/tindev-api)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/DiegoVictor/tindev-api/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Tindev&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Ftindev-api%2Fmaster%2FInsomnia_2021-01-09.json)

Responsible for provide data to the [`web`](https://github.com/DiegoVictor/tindev-web) and [`mobile`](https://github.com/DiegoVictor/tindev-app) front-ends. Allows users to register yourself, see other registered users, like or dislake them and see past matches. The app has friendly errors, use JWT to logins, validation, also a simple versioning was made.

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [Redis](#redis)
    * [MongoDB](#mongodb)
    * [.env](#env)
* [Usage](#usage)
  * [Error Handling](#error-handling)
    * [Errors Reference](#errors-reference)
  * [X-Total-Count](#x-total-count)
  * [Bearer Token](#bearer-token)
  * [Versioning](#versioning)
  * [Routes](#routes)
    * [Requests](#requests)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
The application use two databases: [MongoDB](https://www.mongodb.com/) and [Redis](https://redis.io/). For the fastest setup is recommended to use [docker](https://www.docker.com/), see below how to setup ever database.

### Redis
Responsible to store data utilized by the websocket to alert users when a match occurs. To create a postgres container just run:
```
$ docker run --name tindev-redis -d -p 6379:6379 redis:alpine
```

### MongoDB
Store all data utilized by the application. You can create a MongoDB container like so:
```
$ docker run --name tindev-mongo -d -p 27017:27017 mongo
```

### .env
In this file you may configure your Redis database connection, JWT settings, the environment, app's port and a url to documentation (this will be returned with error responses, see [error section](#error-handling)). Rename the `.env.example` in the root directory to `.env` then just update with your settings.

|key|description|default
|---|---|---
|APP_PORT|Port number where the app will run.|`3333`
|JWT_SECRET|A alphanumeric random string. Used to create signed tokens.| -
|JWT_EXPIRATION_TIME|How long time will be the token valid. See [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#usage) repo for more information.|`7d`
|MONGO_URL|MongoDB connection url.|`mongodb://127.0.0.1:27017/tindev`
|REDIS_HOST|Redis host. For Windows users using Docker Toolbox maybe be necessary in your `.env` file set the host to `192.168.99.100` (docker machine IP) instead of localhost or `127.0.0.1`.|`127.0.0.1`
|REDIS_PORT|Redis port.|`6379`
|DOCS_URL|An url to docs where users can find more information about the app's internal code errors.|`https://github.com/DiegoVictor/tindev-api#errors-reference`

# Usage
To start up the app run:
```
$ yarn dev:server
```
Or:
```
npm run dev:server
```

## Error Handling
Instead of only throw a simple message and HTTP Status Code this API return friendly errors:
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Developer not exists",
  "code": 240,
  "docs": "https://github.com/DiegoVictor/tindev-api#errors-reference"
}
```
> Errors are implemented with [@hapi/boom](https://github.com/hapijs/boom).
> As you can see a url to error docs are returned too. To configure this url update the `DOCS_URL` key from `.env` file.
> In the next sub section ([Errors Reference](#errors-reference)) you can see the errors `code` description.

### Errors Reference
|code|message|description
|---|---|---
|141|Token not provided|The JWT token was not sent.
|142|Token invalid|The JWT token provided is invalid or expired.
|240|Developer not exists|The `id` sent does not references an existing developer in the database.

### X-Total-Count
A header returned in routes of listing, this bring the total records amount.

## Bearer Token
A few routes expect a Bearer Token in an `Authorization` header.
> You can see these routes in the [routes](#routes) section.
```
GET http://localhost:3333/v1/developers Authorization: Bearer <token>
```
> To achieve this token you just need authenticate through the `/developers` route and it will return the `token` key with a valid Bearer Token.

## Versioning
A simple versioning was made. Just remember to set after the `host` the `/v1/` string to your requests.
```
GET http://localhost:3333/v1/developers
```

## Routes
|route|HTTP Method|params|description|auth method
|:---|:---:|:---:|:---:|:---:
|`/developers`|POST|Body with Github `username`.|Authenticates users, return a Bearer Token and user's data.|:x:
|`/developers`|GET| - |List developers not liked or disliked yet.|Bearer
|`/developers/:id`|GET|`id` of the developer.|Return one developer.|Bearer
|`/developers/:liked_user_id/like`|POST|`liked_user_id` of the developer to like.|Like a developer.|Bearer
|`/developers/:disliked_user_id/like`|POST|`disliked_user_id` of the developer to dislike.|Dislike a developer.|Bearer
|`/matches`|GET| - |List developers you liked in the past.|Bearer

> Routes with `Bearer` as auth method expect an `Authorization` header. See [Bearer Token](#bearer-token) section for more information.

### Requests
* `POST /developers`

Request body:
```json
{
  "username": "diegovictor"
}
```

# Running the tests
[Jest](https://jestjs.io/) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
