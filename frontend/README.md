# Traveling Merchant

Traveling Merchant is a front end application that uses Reactjs to use traveling merchant backend api to manipulate data to present it to the user. I built the front end to learn the basics of front end so that I can understand what is needed from a backend and a new tool for my web development tool kit.

## Features

Merchant can use basic CRUD operations to change and view the data. The app provides a dashboard that present relevant daily, monthly, and yearly for the users sales. The dashboard also provides the pending money from customers and orders from providers.

![](public/videos/app-video.gif)

## How to use

The following are the requirements:

- Download repository and install dependencies.
- Install nvm in you operating system and run "nvm use" in the project directory terminal to run a unified Node.js version of v18.0.0.
- Traveling merchant backend

When all requirements are fulfilled first run the back end and then the front end. Then use existing merchant login to use app. If no merchant exist, create merchant user in the backend using sequelize database in the merchants table (Note: password for merchants table are all hashed using bcrypt, an npm package, with 10 salt rounds).

## Technologies

These are the technologies and/or frameworks used:

- Node.js (v18.0.0) - Javascript runtime
- React.js - front end web application framework
- Axios - making api requests
- Jest - npm module used for making tests
- Visual Studio Code - code editor

## Collaborators

I had no collaborators.

## License

MIT license

This is showed on the text file "LICENSE.txt" in the repository.

## What I learned

I learned the basics of using React js to build a front end application by implementing react route router and redux as some of the main tools. How to structure the file system of the app. Use jest to make tests.

## Sources

The following are the sources that is codeacedemy for fullstack engineering and documenations for javascript frontend:

- [Codecadey Full Stack Enginnering](https://www.codecademy.com/career-journey/full-stack-engineer)
- [React](https://react.dev/)
- [Redux](https://redux.js.org/)
- [React Router](https://reactrouter.com/en/main)
- [Tanstack Table](https://tanstack.com/table/v8)
- [Mui Date Picker](https://mui.com/x/react-date-pickers/date-picker/)
- [Jest](https://jestjs.io/)
