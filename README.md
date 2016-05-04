# [Course Board](https://meancourseboard.herokuapp.com/)
![npm version](https://img.shields.io/npm/v/bootstrap.svg)
![node version](https://img.shields.io/node/v/gh-badges.svg)
![mongod](https://img.shields.io/myget/mongodb/v/MongoDB.Driver.Core.svg?maxAge=2592000)

## Introduction
Course Board is a platform that provides faster and easier course creation and management using a course management system.

## Table of contents
* [Quick start](#quick-start)
* [What's inside](#whats-inside)
* [Bugs and features requests](#bugs-and-feature-requests)
* [Contributing](#contributing)

## Quick start
* Clone this repo
* Skip to run mongod if you have Homebrew, Node.js, npm and nodemon installed
* Install Homebrew
  ```ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"```
  * Ensure Homebrew is up to date
  ```brew update```
  * As a safe measure, make sure your system is ready to brew
  ```brew doctor```
  * Add Homebrew location to your ```$PATH``` and source your bash profile after adding/saving this ```export PATH="/usr/local/bin:$PATH"```
* Install Node (npm will be installed with node)
  ```brew install node```
* Install nodemon
  ```npm install -g nodemon```
* Install all dependencies
  ```npm install```
* Run the database. Once the database is running, you can close out of that tab.
  ```mongod```
* Create a .env file with token in the main project directory
  ```touch .env echo TOKEN_SECRET=SuperSecretToken```
* Run the server
  ```nodemon```
* Go to localhost:1337

### What's included
Within the download you'll find the following directories and files, logically grouping common assets. You'll see something like this:

```
courseboard/
├── models/
│   ├── answer.js
│   ├── comment.js
│   ├── course.js
│   ├── post.js
│   ├── question.js
│   ├── tag.js
│   └── user.js
├── public/
│   ├── css/
│   │   ├── footer.css
│   │   └── style.css
│   └── js/
│       ├── controllers/
│       │   ├── AdminCtrl.js
│       │   ├── CoursesCtrl.js
│       │   ├── MainCtrl.js
│       │   └── UsersCtrl.js
│       ├── app.js
│       ├── directives.js
│       └── services.js
├── resources/
│   ├── admin.js
│   ├── auth.js
│   ├── courses.js
│   ├── index.js
│   ├── posts.js
│   ├── questions.js
│   └── users.js
└── views/
    ├── emails/
    │   ├── email-layout.jade
    │   ├── enroll-notification.jade
    │   ├── new-password.jade
    │   ├── student-enroll-notification.jade
    │   └── welcome.jade
    ├── templates/
    │   ├── admin.jade
    │   ├── course-edit.jade
    │   ├── course-form.jade
    │   ├── course-index.jade
    │   ├── course-new.jade
    │   ├── course-show.jade
    │   ├── course.jade
    │   ├── navbar.jade
    │   ├── password-edit.jade
    │   ├── password-new.jade
    │   ├── post.jade
    │   ├── profile.jade
    │   ├── settings.jade
    │   └── splash.jade
    ├── index.jade
    └── layout.jade
```

## What's inside
* Express, Mongo, Node, Angular 1.4
* JWT token authentication (from Satellizer)

## Bugs and features requests
Please use the [issue tracker](https://github.com/ajbraus/courseboard/issues) to report bugs, features requests and submitting pull requests.

## Contributing
* Submit pull requests for issues in the issue tracker
* Open issues for bugs and feature requests