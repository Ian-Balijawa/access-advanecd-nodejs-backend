# Acess-advanced-systems-RESTFUL API
 [![Node.js CI](https://github.com/Ian-Balijawa/access-advanecd-nodejs-backend/actions/workflows/node.js.yml/badge.svg)](https://github.com/Ian-Balijawa/access-advanecd-nodejs-backend/actions/workflows/node.js.yml)

![example workflow](https://github.com/rzgry/Express-REST-API-Template/actions/workflows/node.js.yml/badge.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Express-REST-API-Template

ExpressJs api based off of [express-generator](https://expressjs.com/en/starter/generator.html). Includes [eslint](https://eslint.org) and [prettier](https://prettier.io) for linting/code formatting, [nodemon](https://github.com/remy/nodemon) for automatic server restarting, and [Jest](https://jestjs.io) for testing.

## Getting Started

## Introduction

This project is the backend of ACCESS ADVANCED SYSTEMS.
an organisation that builds business management software systems based on VBA.

This is the implementation of The Access advanced RESTFUL-API in Node.js.

## Setup

Make sure to follow all these steps exactly as explained below. Do not miss any steps or you won't be able to run this application.

### Install MongoDB

To run this project, you need to install the latest version of MongoDB Community Edition first.

https://docs.mongodb.com/manual/installation/

Once you install MongoDB, make sure it's running.

### Install the Dependencies

Next, from the project folder, install the dependencies:

 npm install

### Populate the Database

    node seed.js

### Run the Tests

You're almost done! Run the tests to make sure everything is working:

    yarn test

All tests should pass.

### Running in development

```
npm run dev
```

### Running in production

```
npm start
```

Runs on localhost:5000 by default but can be configured using the `PORT` environment variable.

### Running tests

```
yarn test

# Watch repo
yarn run test:watch
```

### Linting

```
yarn run lint

# fix issues
yarn run lint:fix
```

### Start the Server

    npm run dev

This will launch the Node server on port 5500. If that port is busy, you can set a different point in config/default.json.

Open up your browser and head over to this url

# http://localhost:5500/v1.0.0/users

You should see the list of users. That confirms that you have set up everything successfully.

## Environment Variables (Optional)

If you look at config/default.json, you'll see a property called jwtPrivateKey. This key is used to encrypt JSON web tokens. So, for security reasons, it should not be checked into the source control. I've set a default value here to make it easier for you to get up and running with this project. For a production scenario, you should store this key as an environment variable.

On Mac or linux:

    export jwtPrivateKey=yourSecureKey

On Windows:

     set jwtPrivateKey=yourSecureKey

